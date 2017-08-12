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
app.set('port', 9798); //9798
/* use static allows us to access our app.js file in the public folder
   this is necessary because our app.js file is a client side file that is
   scripted in the table.handlebars layout*/
app.use(express.static("public"));

/* get handler route for home page that renders our current server table */
app.get('/', function (req, res, next) {
	res.render('home');
});

app.get('/addToTables', function (req, res, next) {
	res.render('addToTables');
});

app.get('/removeFromTables', function (req, res, next) {
	res.render('removeFromTables');
});

app.get('/updateTables', function (req, res, next) {
	res.render('updateTables');
});

// handler routes to the page that displays the current countries table information
app.get('/countries', function (req, res, next) {
	var context = {};
	mysql.pool.query("SELECT * FROM `country`", function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		context.results = rows;
		res.render('countries', context);
	});
});

// handler routes to the page that displays the current movies table information
app.get('/movies', function (req, res, next) {
	var context = {};
	mysql.pool.query("SELECT * FROM `movies`", function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		context.results = rows;
		res.render('movies', context);
	});
});

// handler routes to the page that displays the current directors table information
app.get('/directors', function (req, res, next) {
	var context = {};
	mysql.pool.query("SELECT d.id, d.first_name, d.last_name, d.age, c.name FROM `directors` d INNER JOIN `country` c ON c.id = d.cid", function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		context.results = rows;
		res.render('directors', context);
	});
});

// handler routes to the page that displays the current actors table information
app.get('/actors', function (req, res, next) {
	var context = {};
	mysql.pool.query("SELECT a.id, a.first_name, a.last_name, a.age, c.name FROM `actors` a INNER JOIN `country` c ON c.id = a.cid", function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		context.results = rows;
		res.render('actors', context);
	});
});

app.get('/collaborations', function (req, res, next) {
	var context = {};
	var selectString = "SELECT d.first_name AS `dfn`, d.last_name AS `dln`," +
		"a.first_name AS `afn`, a.last_name AS `aln`, COUNT(m.id) AS `amount` FROM " +
		"`directors` d INNER JOIN `directors_movies` dm ON d.id = dm.direct_id INNER" +
		" JOIN `movies` m ON m.id = dm.movie_id INNER JOIN `actors_movies` am ON " +
		"am.movie_id = m.id INNER JOIN `actors` a ON a.id = am.act_id GROUP BY " +
		"d.first_name, d.last_name, a.first_name, a.last_name";
	mysql.pool.query(selectString, function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		context.results = rows;
		res.render('collaborations', context);
	});
});

app.get('/countries_and_the_movies', function (req, res, next) {
	var context = {};
	var selectString = "SELECT c.name, c.population, COALESCE(mov.mov_count, 0) AS `movieCount`, " +
	"COALESCE(dir.dir_count, 0) AS `directorCount`, COALESCE(act.act_count, 0)  AS `actorCount` FROM country c LEFT JOIN " +
	"(SELECT c.id AS `mov_country`, COUNT(mc.cid) AS `mov_count` FROM country c " +
	"INNER JOIN movies_countries mc ON mc.cid = c.id GROUP BY c.id) AS mov ON " +
	"mov.mov_country = c.id LEFT JOIN (SELECT c.id AS `dir_country`, COUNT(d.id) " +
	"AS `dir_count` FROM country c INNER JOIN directors d ON c.id = d.cid GROUP BY c.id) " +
	"AS dir ON dir.dir_country = c.id LEFT JOIN (SELECT c.id AS `act_country`, " +
	"COUNT(a.id) AS `act_count` FROM country c INNER JOIN actors a ON c.id = a.cid " +
	"GROUP BY c.id) AS act ON act.act_country = c.id ORDER BY c.name ASC";
	mysql.pool.query(selectString, function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		context.results = rows;
		res.render('fancyCountries', context);
	});
});

// route handler inserts country into table that comes from form submission
app.post('/insert_country',function(req,res,next){
  mysql.pool.query("INSERT INTO country (`name`, `continent`, `population`) VALUES (?, ?, ?)",
    [req.body.name || null, req.body.continent || null, req.body.population || null], function(err, result){
    if(err){
      next(err);
      return;
  	}
    res.send(result.insertId.toString());
  });
});

// route handler inserts movie into table that comes from form submission
app.post('/insert_movie',function(req,res,next){
  mysql.pool.query("INSERT INTO movies (`title`, `genre`, `runtime`, `release_date`) VALUES (?, ?, ?, ?)",
    [req.body.title || null, req.body.genre || null, req.body.runtime || null, req.body.release_date || null], function(err, result){
    if(err){
      next(err);
      return;
  	}
    res.send(result.insertId.toString());
  });
});

// route handler inserts director into table that comes from form submission
app.post('/insert_director',function(req,res,next){
  mysql.pool.query("SELECT id FROM `country` WHERE name=?", [req.body.country], function(err, rows, fields){
  	if(err){
    	next(err);
    	return;
  	}
		var id = rows[0].id;
		console.log(id);
		mysql.pool.query("INSERT INTO directors (`first_name`, `last_name`, `age`, `cid`) VALUES (?, ?, ?, ?)",
	    [req.body.fname || null, req.body.lname || null, req.body.age || null, id || null], function(err, result){
	    if(err){
	      next(err);
	      return;
	  	}
	    res.send(result.insertId.toString());
	  });
  });
});

// route handler inserts actor into table that comes from form submission
app.post('/insert_actor',function(req,res,next){
  mysql.pool.query("SELECT id FROM `country` WHERE name=?", [req.body.country], function(err, rows, fields){
  	if(err){
    	next(err);
    	return;
  	}
		var id = rows[0].id;
		console.log(id);
		mysql.pool.query("INSERT INTO actors (`first_name`, `last_name`, `age`, `cid`) VALUES (?, ?, ?, ?)",
	    [req.body.fname || null, req.body.lname || null, req.body.age || null, id || null], function(err, result){
	    if(err){
	      next(err);
	      return;
	  	}
	    res.send(result.insertId.toString());
	  });
  });
});

// route handler inserts a movie in a country into table that comes from form submission
app.post('/insertMinC', function(req, res, next) {
	// first select the movie id from form submission and assign to var mid
	mysql.pool.query("SELECT id FROM `movies` WHERE title=?", [req.body.title], function(err, rows, fields){
		if (err) {
			next(err);
			return;
		}
		var mTitleID = rows[0].id;
		console.log(mTitleID);
		// then select the country id from form submission and assign to var id
		mysql.pool.query("SELECT id FROM `country` WHERE name=?", [req.body.country], function(err, rows, fields){
			if (err) {
				next(err);
				return;
			}
			var coID = rows[0].id;
			console.log(coID);
			mysql.pool.query("INSERT INTO movies_countries (`movie_id`, `cid`) VALUES (?, ?)", [mTitleID || null, coID || null], function(err, result){
				if (err) {
					next(err);
					return;
				}
				res.send(result.insertId.toString());
			});
		});
	});
});

// route handler inserts director of a movie into table that comes from form submission
app.post('/insertDofM', function(req, res, next) {
	mysql.pool.query("SELECT id FROM `directors` WHERE first_name=? AND last_name=?", [req.body.first_name, req.body.last_name], function(err, rows, fields){
		if (err) {
			next(err);
			return;
		}
		var dirID = rows[0].id;
		console.log(dirID);
		mysql.pool.query("SELECT id FROM `movies` WHERE title=?", [req.body.title], function(err, rows, fields){
			if (err) {
				next(err);
				return;
			}
			var mID = rows[0].id;
			console.log(mID);
			mysql.pool.query("INSERT INTO directors_movies (`direct_id`, `movie_id`) VALUES (?, ?)", [dirID || null, mID || null], function(err, result){
				if (err) {
					next(err);
					return;
				}
				res.send(result.insertId.toString());
			});
		});
	});
});

// route handler inserts an actor in a movie into table that comes from form submission
app.post('/insertAinM', function(req, res, next) {
	mysql.pool.query("SELECT id FROM `actors` WHERE first_name=? AND last_name=?", [req.body.first_name, req.body.last_name], function(err, rows, fields){
		if (err) {
			next(err);
			return;
		}
		var actID = rows[0].id;
		console.log(actID);
		mysql.pool.query("SELECT id FROM `movies` WHERE title=?", [req.body.title], function(err, rows, fields){
			if (err) {
				next(err);
				return;
			}
			var mID = rows[0].id;
			console.log(mID);
			mysql.pool.query("INSERT INTO actors_movies (`act_id`, `movie_id`) VALUES (?, ?)", [actID || null, mID || null], function(err, result){
				if (err) {
					next(err);
					return;
				}
				res.send(result.insertId.toString());
			});
		});
	});
});

// handler routes to the page that displays the current directors of movies table information
app.get('/directorsOfMovies', function (req, res, next) {
	var context = {};
	mysql.pool.query("SELECT directors.first_name, directors.last_name, movies.title FROM `directors` INNER JOIN `directors_movies` ON directors_movies.direct_id = directors.id INNER JOIN `movies` ON movies.id = directors_movies.movie_id", function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		context.results = rows;
		res.render('directorsOfMovies', context);
	});
});

// handler routes to the page that displays the current actors in movies table information 
app.get('/actorsInMovies', function (req, res, next) {
	var context = {};
	mysql.pool.query("SELECT actors.first_name, actors.last_name, movies.title FROM `actors` INNER JOIN `actors_movies` ON actors_movies.act_id = actors.id INNER JOIN `movies` ON movies.id = actors_movies.movie_id", function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		context.results = rows;
		res.render('actorsInMovies', context);
	});
});

// handler routes to the page that displays the current movies filmed in countries table information
app.get('/moviesInCountries', function (req, res, next) {
	var context = {};
	mysql.pool.query("SELECT movies.title, country.name FROM `movies` INNER JOIN `movies_countries` ON movies_countries.movie_id = movies.id INNER JOIN `country` ON country.id = movies_countries.cid", function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		context.results = rows;
		res.render('moviesInCountries', context);
	});
});

// handler routes to the page that resets the tables to contain no information
app.get('/reset-table',function(req,res,next){
  var context = {};
  var dropMC = "DROP TABLE IF EXISTS `movies_countries`";
  var dropAM = "DROP TABLE IF EXISTS `actors_movies`";
  var dropDM = "DROP TABLE IF EXISTS `directors_movies`";
  var dropA = "DROP TABLE IF EXISTS `actors`";
  var dropD = "DROP TABLE IF EXISTS `directors`";
  var dropM = "DROP TABLE IF EXISTS `movies`";
  var dropC = "DROP TABLE IF EXISTS `country`";
  mysql.pool.query(dropMC, function(err){
	  mysql.pool.query(dropAM, function(err){
		  mysql.pool.query(dropDM, function(err){
			  mysql.pool.query(dropA, function(err){
				  mysql.pool.query(dropD, function(err){
					  mysql.pool.query(dropM, function(err){
						  mysql.pool.query(dropC, function(err){
							  console.log("country dropped");
							  var country = "CREATE TABLE `country` (" +
							  	"`id` int(11) NOT NULL AUTO_INCREMENT," +
							  	"`name` varchar(255) NOT NULL," +
							  	"`continent` varchar(255) NOT NULL," +
							  	"`population` decimal(7,1) NOT NULL," +
							  	"PRIMARY KEY (`id`)" +
							  	") ENGINE=InnoDB";
							  var movies = "CREATE TABLE `movies` (" +
							  	"`id` int(11) NOT NULL AUTO_INCREMENT," +
							  	"`title` varchar(255) NOT NULL," +
							  	"`genre` varchar(255) NOT NULL," +
							  	"`runtime` int(11) NOT NULL," +
							  	"`release_date` date," +
							  	"PRIMARY KEY (`id`)" +
							  	") ENGINE=InnoDB";
							  var directors = "CREATE TABLE `directors` (" +
							  	"`id` int(11) NOT NULL AUTO_INCREMENT," +
							  	"`first_name` varchar(255) NOT NULL," +
							  	"`last_name` varchar(255) NOT NULL," +
							  	"`age` int(11) NOT NULL," +
							  	"`cid` int(11) NOT NULL," +
							  	"PRIMARY KEY (`id`)," +
							  	"CONSTRAINT FOREIGN KEY (`cid`) REFERENCES `country` (`id`)" +
							  	") ENGINE=InnoDB";
							  var actors = "CREATE TABLE `actors` (" +
							  	"`id` int(11) NOT NULL AUTO_INCREMENT," +
							  	"`first_name` varchar(255) NOT NULL," +
							  	"`last_name` varchar(255) NOT NULL," +
							  	"`age` int(11) NOT NULL," +
							  	"`cid` int(11) NOT NULL," +
							  	"PRIMARY KEY (`id`)," +
							  	"CONSTRAINT FOREIGN KEY (`cid`) REFERENCES `country` (`id`)" +
							  	") ENGINE=InnoDB";
							  var dM = "CREATE TABLE `directors_movies` (" +
							  	"`direct_id` int(11) NOT NULL DEFAULT '0'," +
							  	"`movie_id` int(11) NOT NULL DEFAULT '0'," +
							  	"PRIMARY KEY (`direct_id`,`movie_id`)," +
							  	"CONSTRAINT FOREIGN KEY (`direct_id`) REFERENCES `directors` (`id`)," +
							  	"CONSTRAINT FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`)" +
							  	") ENGINE=InnoDB";
							  var aM = "CREATE TABLE `actors_movies` (" +
							  	"`act_id` int(11) NOT NULL DEFAULT '0'," +
							  	"`movie_id` int(11) NOT NULL DEFAULT '0'," +
							  	"PRIMARY KEY (`act_id`,`movie_id`)," +
							  	"CONSTRAINT FOREIGN KEY (`act_id`) REFERENCES `actors` (`id`)," +
							  	"CONSTRAINT FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`)" +
							  	") ENGINE=InnoDB";
							  var mC = "CREATE TABLE `movies_countries` (" +
							  	"`movie_id` int(11) NOT NULL DEFAULT '0'," +
							  	"`cid` int(11) NOT NULL DEFAULT '0'," +
							  	"PRIMARY KEY (`movie_id`,`cid`)," +
							  	"CONSTRAINT FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`)," +
							  	"CONSTRAINT FOREIGN KEY (`cid`) REFERENCES `country` (`id`)" +
							  	") ENGINE=InnoDB";
								mysql.pool.query(country, function(err){
									mysql.pool.query(movies, function(err){
										mysql.pool.query(directors, function(err){
											mysql.pool.query(actors, function(err){
												mysql.pool.query(dM, function(err){
													mysql.pool.query(aM, function(err){
														mysql.pool.query(mC, function(err){
						  									context.results = "Table reset";
						  									res.render('home',context);
												  		});
											  		});
										  		});
									  		});
								  		});
							  		});
						  		});
						  });
					  });
				  });
			  });
		  });
	  });
  });
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
