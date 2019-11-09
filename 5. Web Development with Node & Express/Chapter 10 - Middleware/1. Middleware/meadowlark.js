var express = require('express');
var formidable = require('formidable');
var fortune = require('./lib/fortune.js');
require("./lib/prototype.js");
var jqupload = require('jquery-file-upload-middleware');
var credentials = require('./credentials.js');
const util = require('util')

var app = express();

app.set('port', process.env.PORT || 3000);
// set up handlebars view engine
var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
var cartValidation = require('./lib/cartValidation.js');
app.use(cartValidation.checkWaivers);
app.use(cartValidation.checkGuestCounts);

app.use(require('./lib/requiresWaiver.js'));

app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());

app.disable('x-powered-by');
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

app.use(function (req, res, next) {
// if there's a flash message, transfer
// it to the context, then clear it
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});

app.get('/sign-monster', function (req, res) {
    res.cookie('monster', 'nom nom');
    res.cookie('signed_monster', 'nom nom signed', {signed: true});

    res.send("Successfully Sign Monster Cookie");
});

app.get('/delete-sign-monster', function (req, res) {
    res.clearCookie('monster');
    res.clearCookie('signed_monster');
});

app.get('/check-sign-monster', function (req, res) {
    var monster = req.cookies.monster;
    var signedMonster = req.signedCookies.signed_monster;
    console.log(monster);
    console.log(signedMonster);
    res.send("Cookie : " + monster + "\nSigned Cookie : " + signedMonster);
});

app.use(function (req, res, next) {
    if (!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = getWeatherData();
    next();
});

app.use(require('body-parser')());

app.get('/newsletter', function (req, res) {
// we will learn about CSRF later...for now, we just
// provide a dummy value
    res.render('newsletter', {csrf: 'CSRF token goes here'});
});

app.get('/newsletter-old', function (req, res) {
// we will learn about CSRF later...for now, we just
// provide a dummy value
    res.render('newsletter-old', {csrf: 'CSRF token goes here'});
});

// for now, we're mocking NewsletterSignup:
function NewsletterSignup() {
}

NewsletterSignup.prototype.save = function (cb) {
    cb();
}

var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

app.post('/newsletter', function (req, res) {
    var name = req.body.name || '', email = req.body.email || '';
// input validation
    if (!email.match(VALID_EMAIL_REGEX)) {
        if (req.xhr) return res.json({error: 'Invalid name email address.'});
        req.session.flash = {
            type: 'danger',
            intro: 'Validation error!',
            message: 'The email address you entered was not valid.',
        };
        return res.redirect(303, '/newsletter/archive');
    }
    new NewsletterSignup({name: name, email: email}).save(function (err) {
        if (err) {
            if (req.xhr) return res.json({error: 'Database error.'});
            req.session.flash = {
                type: 'danger',
                intro: 'Database error!',
                message: 'There was a database error; please try again later.',
            }
            return res.redirect(303, '/newsletter/archive');
        }
        if (req.xhr) return res.json({success: true});
        req.session.flash = {
            type: 'success',
            intro: 'Thank you!',
            message: 'You have now been signed up for the newsletter.',
        };
        return res.redirect(303, '/newsletter/archive');
    });
});

app.get('/newsletter/archive', function (req, res) {
    res.render('newsletter/archive');
});

app.use('/upload', function (req, res, next) {
    var now = Date.now();
    console.log("Uploading File ...");
    jqupload.fileHandler({
        uploadDir: function () {
            return __dirname + '/public/uploads/' + now;
        },
        uploadUrl: function () {
            return '/uploads/' + now;
        },
    })(req, res, next);
});

app.post('/process', function (req, res) {
    console.log('Form (from querystring): ' + req.query.form);
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (from visible form field): ' + req.body.email);
    if (req.xhr || req.accepts('json,html') === 'json') {
        // if there were an error, we would send { error: 'error description' }
        res.send({success: true});
    } else {
        // if there were an error, we would redirect to an error page
        res.redirect(303, '/thank-you');
    }
});
app.get('/contest/vacation-photo', function (req, res) {
    var now = new Date();
    res.render('contest/vacation-photo', {
        year: now.getFullYear(), month: now.getMonth()
    });
});
app.post('/contest/vacation-photo/:year/:month', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) return res.redirect(303, '/error');
        console.log('received fields:');
        console.log(fields);
        console.log('received files:');
        console.log(files);
        res.redirect(303, '/thank-you');
    });
});

app.get('/jquery-test', function (req, res) {
    res.render('jquery-test');
});

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/headers', function (req, res) {
    res.set('Content-Type', 'text/plain');
    var s = '';
    for (var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
    res.send(s);
});


app.get('/thank-you', function (req, res) {
    res.render('thank-you');
});

app.get('/about', function (req, res) {
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js',
    });
});

var tours = [
    {id: 0, name: 'Hood River', price: 99.99},
    {id: 1, name: 'Oregon Coast', price: 149.95},
];

function getWeatherData() {
    return {
        locations: [
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            },
        ],
    };
}

app.get('/tours/example', function (req, res) {
    res.render('tours/example', {
        currency: {
            name: 'United States dollars',
            abbrev: 'USD',
        },
        tours: [
            {name: 'Hood River', price: '$99.95'},
            {name: 'Oregon Coast', price: '$159.95'},
        ],
        specialsUrl: '/january-specials',
        currencies: ['USD', 'GBP', 'BTC'],
    });
});

app.get('/tours/example-no-layout', function (req, res) {
    res.render('tours/example', {
        currency: {
            name: 'United States dollars',
            abbrev: 'USD',
        },
        tours: [
            {name: 'Hood River', price: '$99.95'},
            {name: 'Oregon Coast', price: '$159.95'},
        ],
        specialsUrl: '/january-specials',
        currencies: ['USD', 'GBP', 'BTC'],

        layout: null,
    });
});

app.get('/api/tours', function (req, res) {
    res.json(tours);
});

app.put('/api/tour/:id', function (req, res) {
    var tour = tours.some(function (p) {
        return p.id == req.params.id;
    });
    if (tour) {
        tours = tours.map(function (item) {
            if (item.id == req.params.id) {
                if (req.query.name) item.name = req.query.name.TitleCase();
                if (req.query.price) item.price = parseFloat(req.query.price).toFixed(2);
            }
            return item;
        });
        res.json({success: true});
    } else {
        res.json({error: 'No such tour exists.'});
    }
});

// API that deletes a product
app.delete('/api/tour/:id', function (req, res) {
    var i;
    for (var i = tours.length - 1; i >= 0; i--)
        if (tours[i].id == req.params.id) break;
    if (i >= 0) {
        tours.splice(i, 1);
        res.json({success: true});
    } else {
        res.json({error: 'No such tour exists.'});
    }
});

// Example of Endpoint that retuning based on request type
/*app.get('/api/tours', function (req, res) {
    var toursXml = '<?xml version="1.0"?><tours>' +
        products.map(function (p) {
            return '<tour price="' + p.price +
                '" id="' + p.id + '">' + p.name + '</tour>';
        }).join('') + '</tours>';
    var toursText = tours.map(function (p) {
        return p.id + ': ' + p.name + ' (' + p.price + ')';
    }).join('\n');
    res.format({
        function() {
            res.json(tours);
        },
        'application/xml': function () {
            res.type('application/xml');
            res.send(toursXml);
        },
        'text/xml': function () {
            res.type('text/xml');
            res.send(toursXml);
        },
        'text/plain': function () {
            res.type('text/plain');
            res.send(toursXml);
        }
    });
});*/

app.get('/tours/hood-river', function (req, res) {
    res.render('tours/hood-river');
});
app.get('/tours/oregon-coast', function (req, res) {
    res.render('tours/oregon-coast');
});
app.get('/tours/request-group-rate', function (req, res) {
    res.render('tours/request-group-rate');
});

// 404 catch-all handler (middleware)
app.use(function (req, res, next) {
    res.status(404);
    res.render('404');
});
// 500 error handler (middleware)
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});
