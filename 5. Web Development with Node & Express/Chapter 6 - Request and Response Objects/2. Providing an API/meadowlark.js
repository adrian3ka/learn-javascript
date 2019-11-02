var express = require('express');
var fortune = require('./lib/fortune.js');
require("./lib/prototype.js");
var app = express();

app.set('port', process.env.PORT || 3000);
// set up handlebars view engine
var handlebars = require('express3-handlebars').create({defaultLayout: 'main'});

app.disable('x-powered-by');
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
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
