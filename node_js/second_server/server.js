var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var birds = require('./birds');
var myLoger = require('./milddleware_function');

var newsApi = require('./newsApi');

var News = require('./models/news');


app.use(cookieParser());

app.use(bodyParser.urlencoded({
    extended: true
}));


// http://localhost:8889/index.html
app.use(express.static('public'));

newsApi.init(app);

app.use(myLoger);
app.use('/birds', birds);

app.get('/', function(req, res) {
    res.send('root');
});

app.get('/about', function(req, res) {
    res.send('about new text');
});


// http://localhost:8889/users/123/books/3

app.get('/users/:userId/books/:bookId', function(req, res) {
    res.send(req.params);
});



// Since the hyphen (-) and the dot (.) are interpreted literally, they can be used along with route parameters for useful purposes.

// Route path: /flights/:from-:to
// Request URL: http://localhost:3000/flights/LAX-SFO
// req.params: { "from": "LAX", "to": "SFO" }

// Route path: /plantae/:genus.:species
// Request URL: http://localhost:3000/plantae/Prunus.persica
// req.params: { "genus": "Prunus", "species": "persica" }


//-----------


// app.get('/example/d', [cb0, cb1], function (req, res, next) {
//     console.log('the response will be sent by the next function ...');
//     next();
// }, function (req, res) {
//     res.send('Hello from D!');
// });


//-----------


// app.route('/book')
//     .get(function (req, res) {
//         res.send('Get a random book');
//     })
//     .post(function (req, res) {
//         res.send('Add a book');
//     })
//     .put(function (req, res) {
//         res.send('Update the book');
//     });


mongoose.connect('mongodb://localhost:27017/vadimtestdb');




app.listen(8889, function() {
    console.log('Example app listening on port 8889!');
});