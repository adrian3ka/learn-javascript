var express = require('express');
var formidable = require('formidable');
var fortune = require('./lib/fortune.js');
require("./lib/prototype.js");
var jqupload = require('jquery-file-upload-middleware');
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

app.disable('x-powered-by');
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
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
