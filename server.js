/* This file provides all the functionality to respond and send information
 * to information the server and then route our calls to the appropriate
 * handlebars page
 */

// imports our keys and access tokens
var mysql = require('./dbcon.js');

/* imports express module and assign it to express variable */
var express = require('express');
/* call our new express function that returns an express instance/application */
var app = express();

/* imports express-handlebars, creates an instance of it letting it know the 
   default layout will be called main then assigns it to handlebars variable */
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
/* sets the handlebar.engine to be the thing that handles all file extensions 
   with a .handlebars extension */
app.engine('handlebars', handlebars.engine);
/* setting the app view engine to handlebars lets us omit the file extension 
   when we make calls later in this app */
app.set('view engine', 'handlebars');

/* DIDN'T EVEN NEED BODY-PARSER BECAUSE OF UTILIZING ALL GET REQUESTS */
// required for a post form
// add it, set it up to parse both URL encoded forms and JSON data
// express will then auto-detect which parser to be used on content
var bodyParser = require('body-parser');                /* body-parser is middleware */
app.use(bodyParser.urlencoded({ extended: false }));	/* deal with url encoded submissions */
app.use(bodyParser.json());

/* 'port' is  an arbitrary name we're using to reference our port number */
app.set('port', 9798);
/* use static allows us to access our app.js file in the public folder
   this is necessary because our app.js file is a client side file that is
   scripted in the table.handlebars layout*/
app.use(express.static("public"));

/* get handler route for home page that renders our current server table */
app.get('/', function (req, res, next) {
	res.render('home');
});

app.get('/countries', function (req, res, next) {
        res.render('countries');
});

app.get('/movies', function (req, res, next) {
	res.render('movies');
});

app.get('/directors', function (req, res, next) {
	res.render('directors');
});

app.get('/actors', function (req, res, next) {
	res.render('actors');
});

/* use mounts middleware at a specified path, 1st catch all handler
   mounting means we're putting something on that path so when its requested 
   the thing mounted can be used */
app.use(function (req, res) {
    res.status(404);
    res.render("404");
});

/* second catch all handler
   this outputs the error to the console, and sends the message to the client */
app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render("500");
});

/* use app's get method to retrieve port value and pass that in as the first 
   argument the 2nd argument is a callback to call when the server is started,
   this prints message and port numbe */
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
