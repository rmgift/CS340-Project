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
app.set('port', 3000); //9798
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
    var context = {};
    mysql.pool.query("SELECT DISTINCT name FROM `country`", function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        context.name = rows;
        res.render('removeFromTables', context);
    });
});

app.get('/updateTables', function (req, res, next) {
    var context = {};
    mysql.pool.query("SELECT DISTINCT name FROM `country`", function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        context.name = rows;
        res.render('updateTables', context);
    });
});




/* COUNTRY ROUTE HANDLERS FOLLOW
 * "/countries" = routes to the page that displays the current countries table information
 * "/insert_country" = route inserts country into table that comes from form submission
 * "/removeCountry" =
 */
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

app.post('/removeCountry', function (req, res, next) {
    mysql.pool.query("DELETE FROM `country` WHERE name=?", [req.body.name], function (err, result) {
        if (err) {
            next(err);
            return;
        }
        res.redirect('/removeFromTables');
    });
});


/* MOVIE ROUTE HANDLERS FOLLOW
 * "/movies" =  routes to the page that displays the current movies table information
 * "/moviesInCountries" = routes to the page that displays the current movies filmed in countries table information
 * "/insert_movie" = route inserts movie into table that comes from form submission
 * "/insertMinC" = route inserts a movie in a country into table that comes from form submission
 * "/removeMinC" = route removes the relationship of a movie that was filmed in a country from the table upon form submission
 */
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

app.get('/moviesInCountries', function (req, res, next) {
	var context = {};
	mysql.pool.query("SELECT m.title, c.name FROM `movies` m INNER JOIN `movies_countries` mc ON mc.movie_id = m.id LEFT JOIN `country` c ON c.id = mc.cid",
	function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		context.results = rows;
		res.render('moviesInCountries', context);
	});
});

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

app.post('/removeMinC', function(req, res, next) {
	mysql.pool.query("SELECT id FROM `movies` WHERE title=?", [req.body.title], function(err, rows, fields){
		if (err) {
			next(err);
			return;
		}
		var movID = rows[0].id;
		console.log(movID);
		mysql.pool.query("SELECT id FROM `country` WHERE name=?", [req.body.name], function(err, rows, fields) {
			if (err) {
				next(err);
				return;
			}
			var cID = rows[0].id;
			console.log(cID);
			mysql.pool.query("DELETE FROM `movies_countries` WHERE movie_id=? AND cid=?", [movID, cID], function(err, result){
				if (err) {
					next(err);
					return;
				}
				res.send(result.insertId.toString());
			});
		});
	});
});


/* DIRECTOR ROUTE HANDLERS FOLLOW
 * "/directors" = routes to the page that displays the current directors table information
 * "/directorOfMovies" = routes to the page that displays the current directors of movies table information
 * "/insert_director" = route inserts director into table that comes from form submission
 * "/insertDofM" = route inserts director of a movie into table that comes from form submission
 */
app.get('/directors', function (req, res, next) {
	var context = {};
	mysql.pool.query("SELECT d.id, d.first_name, d.last_name, d.age, c.name FROM `directors` d LEFT JOIN `country` c ON c.id = d.cid", function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		context.results = rows;
		res.render('directors', context);
	});
});

app.get('/directorsOfMovies', function (req, res, next) {
	var context = {};
	mysql.pool.query("SELECT d.first_name, d.last_name, m.title FROM `directors` d INNER JOIN `directors_movies` dm ON dm.direct_id = d.id INNER JOIN `movies` m ON m.id = dm.movie_id",
	function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		context.results = rows;
		res.render('directorsOfMovies', context);
	});
});

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


/* ACTOR ROUTE HANDLERS FOLLOW
 * "/actors" = routes to the page that displays the current actors table information
 * "/actorsInMovies" = routes to the page that displays the current actors in movies table information
 * "/insert_actor" = route inserts actor into table that comes from form submission
 * "/update_actor" = 
 * "/insertAinM" = route inserts an actor in a movie into table that comes from form submission
 * "/removeAinM" = 
 */
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

app.get('/actorsInMovies', function (req, res, next) {
	var context = {};
	mysql.pool.query("SELECT a.first_name, a.last_name, m.title FROM `actors` a INNER JOIN `actors_movies` am ON am.act_id = a.id INNER JOIN `movies` m ON m.id = am.movie_id",
	function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		context.results = rows;
		res.render('actorsInMovies', context);
	});
});

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

app.post('/update_actor', function(req,res,next) {
	mysql.pool.query("SELECT id FROM `actors` WHERE first_name=? AND last_name=?", [req.body.first_name, req.body.last_name], function(err, rows, fields){
		if (err) {
			next(err);
			return;
		}
		var curVals = rows[0];
		var curID = rows[0].id;
		console.log(curVals);
		mysql.pool.query("SELECT id FROM `country` WHERE name=?", [req.body.name], function(err, rows, fields){
			if (err) {
				next(err);
				return;
			}
			var coID = rows[0].id;
			console.log(coID);
			mysql.pool.query("UPDATE actors SET first_name=?, last_name=?, age=?, cid=? WHERE id=?",
			[req.body.first_name || curVals.first_name, req.body.last_name || curVals.last_name, req.body.age || curVals.age, coID || curVals.cid, curID],
			function(err, result) {
				if (err) {
					next(err);
					return;
				}
                res.redirect('/updateTables');
			});
		});
	});
});

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

app.post('/removeAinM', function(req, res, next) {
	mysql.pool.query("SELECT id FROM `actors` WHERE first_name=? AND last_name=?", [req.body.first_name, req.body.last_name], function(err, rows, fields) {
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
			var movID = rows[0].id;
			console.log(movID);
			mysql.pool.query("DELETE FROM `actors_movies` WHERE act_id=? AND movie_id=?", [actID, movID], function(err, result){
				if (err) {
					next(err);
					return;
				}
				res.send(result.insertId.toString());
			});
		});
	});
});


/* ADVANCED TABLES
 * "/collaborations" = 
 * "/countries_and_the_movies" = 
 * "/actor_bio_filmography" = 
 * "/director_bio_filmography" = 
 * "/reset-table" = routes to the page that resets the tables to contain no information
 */
app.get('/collaborations', function (req, res, next) {
	var context = {};
	var selectString = "SELECT d.first_name AS `dfn`, d.last_name AS `dln`," +
		"a.first_name AS `afn`, a.last_name AS `aln`, COUNT(m.id) AS `amount` FROM " +
		"`directors` d INNER JOIN `directors_movies` dm ON d.id = dm.direct_id INNER" +
		" JOIN `movies` m ON m.id = dm.movie_id INNER JOIN `actors_movies` am ON " +
		"am.movie_id = m.id INNER JOIN `actors` a ON a.id = am.act_id" ;


	//based on answer from https://stackoverflow.com/questions/17385009/can-i-iterate-over-the-query-string-parameters-using-expressjs
	//and https://stackoverflow.com/questions/35600800/how-to-get-number-of-request-query-parameters-in-express-js
	var properties = [];
	var whereString = " WHERE ";
	if(Object.keys(req.query).length > 0) {
		for(var property in req.query) {
			if(req.query.hasOwnProperty(property) && req.query[property] != '' && property != 'amount') {
				whereString = whereString + " " + property + " = ? AND ";
				if(!isNaN(parseInt(req.query[property]))) {
					properties.push(parseInt(req.query[property]));
				}
				else {
					properties.push(req.query[property]);
				}

			}
		}
		if(properties.length > 0) {
			selectString = selectString + whereString;
			selectString = selectString.substring(0, selectString.length - 4);
		}

	}
	selectString = selectString + " GROUP BY d.first_name, d.last_name, a.first_name, a.last_name";
	if(Object.keys(req.query).length > 0) {
		for(var property in req.query) {
			if(req.query.hasOwnProperty(property) && property == 'amount' && req.query[property] != '') {
				selectString = selectString + " HAVING amount = ?";
				properties.push(parseInt(req.query['amount']));
			}
		}
	}
	selectString = selectString + " ORDER BY d.last_name ASC, a.last_name ASC"
	mysql.pool.query(selectString, properties, function(err, rows, fields){
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
	mysql.pool.query("SELECT DISTINCT continent FROM country", function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		context.continents = rows;
		var selectString = "SELECT c.name, c.population, COALESCE(mov.mov_count, 0) AS `movieCount`, " +
		"COALESCE(dir.dir_count, 0) AS `directorCount`, COALESCE(act.act_count, 0)  AS `actorCount` FROM country c LEFT JOIN " +
		"(SELECT c.id AS `mov_country`, COUNT(mc.cid) AS `mov_count` FROM country c " +
		"INNER JOIN movies_countries mc ON mc.cid = c.id GROUP BY c.id) AS mov ON " +
		"mov.mov_country = c.id LEFT JOIN (SELECT c.id AS `dir_country`, COUNT(d.id) " +
		"AS `dir_count` FROM country c INNER JOIN directors d ON c.id = d.cid GROUP BY c.id) " +
		"AS dir ON dir.dir_country = c.id LEFT JOIN (SELECT c.id AS `act_country`, " +
		"COUNT(a.id) AS `act_count` FROM country c INNER JOIN actors a ON c.id = a.cid " +
		"GROUP BY c.id) AS act ON act.act_country = c.id";

		//based on answer from https://stackoverflow.com/questions/17385009/can-i-iterate-over-the-query-string-parameters-using-expressjs
		//and https://stackoverflow.com/questions/35600800/how-to-get-number-of-request-query-parameters-in-express-js
		var properties = [];
		var whereString = " WHERE ";
		if(Object.keys(req.query).length > 0) {
			for(var property in req.query) {
				if(req.query.hasOwnProperty(property) && req.query[property] != '') {
					whereString = whereString + " " + property + " = ? AND ";
					if(!isNaN(parseInt(req.query[property]))) {
						properties.push(parseInt(req.query[property]));
					}
					else {
						properties.push(req.query[property]);
					}

				}
			}
			if(properties.length > 0) {
				selectString = selectString + whereString;
				selectString = selectString.substring(0, selectString.length - 4);
			}

		}
		selectString = selectString +  " ORDER BY c.name ASC";
		console.log(selectString);
		mysql.pool.query(selectString, properties, function(err, rows, fields){
			if(err){
				next(err);
				return;
			}
			context.results = rows;
			res.render('fancyCountries', context);
		});
	});

});

app.get('/actor_bio_filmography', function (req, res, next) {
	var context = {};
	var selectString = "SELECT a.first_name AS `afn`, a.last_name AS `aln`, a.age AS `aAge`, c.name AS `countryName`, " +
	"m.title AS `mTitle`, m.genre AS `mGenre`, m.runtime AS `mRuntime`, DATE_FORMAT(m.release_date, '%m/%d/%Y') AS " +
	"formattedDate FROM `actors` a INNER JOIN `country` c ON a.cid = c.id " +
	"INNER JOIN `actors_movies` am ON am.act_id = a.id INNER JOIN `movies` m ON m.id = am.movie_id";


	//based on answer from https://stackoverflow.com/questions/17385009/can-i-iterate-over-the-query-string-parameters-using-expressjs
	//and https://stackoverflow.com/questions/35600800/how-to-get-number-of-request-query-parameters-in-express-js
	var properties = [];
	var whereString = " WHERE ";
	if(Object.keys(req.query).length > 0) {
		for(var property in req.query) {
			if(req.query.hasOwnProperty(property) && req.query[property] != '') {
				if(property == 'm.release_date') {
					whereString = whereString + " " + property + " >= ? AND ";
					whereString = whereString + " " + property + " <= ? AND ";
					properties.push(req.query[property] + "-01-01");
					properties.push(req.query[property] + "-12-31");
				}
				else {
					whereString = whereString + " " + property + " = ? AND ";
					if(!isNaN(parseInt(req.query[property]))) {
						properties.push(parseInt(req.query[property]));
					}
					else {
						properties.push(req.query[property]);
					}
				}

			}
		}
		if(properties.length > 0) {
			selectString = selectString + whereString;
			selectString = selectString.substring(0, selectString.length - 4);
		}

	}
	selectString = selectString + " ORDER BY `aln` ASC, m.release_date DESC";
	console.log(selectString);
	console.log(properties);

	mysql.pool.query(selectString, properties, function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		context.results = rows;
		res.render('fancyActors', context);
	});
});

app.get('/director_bio_filmography', function (req, res, next) {
	var context = {};
	var selectString = "SELECT d.first_name AS `dfn`, d.last_name AS `dln`, d.age AS `dAge`, c.name AS `countryName`, " +
	"m.title AS `mTitle`, m.genre AS `mGenre`, m.runtime AS `mRuntime`, DATE_FORMAT(m.release_date, '%m/%d/%Y') AS " +
	"formattedDate FROM `directors` d INNER JOIN `country` c ON d.cid = c.id " +
	"INNER JOIN `directors_movies` dm ON dm.direct_id = d.id INNER JOIN `movies` m ON m.id = dm.movie_id";

	//based on answer from https://stackoverflow.com/questions/17385009/can-i-iterate-over-the-query-string-parameters-using-expressjs
	//and https://stackoverflow.com/questions/35600800/how-to-get-number-of-request-query-parameters-in-express-js
	var properties = [];
	var whereString = " WHERE ";
	if(Object.keys(req.query).length > 0) {
		for(var property in req.query) {
			if(req.query.hasOwnProperty(property) && req.query[property] != '') {
				if(property == 'm.release_date') {
					whereString = whereString + " " + property + " >= ? AND ";
					whereString = whereString + " " + property + " <= ? AND ";
					properties.push(req.query[property] + "-01-01");
					properties.push(req.query[property] + "-12-31");
				}
				else {
					whereString = whereString + " " + property + " = ? AND ";
					if(!isNaN(parseInt(req.query[property]))) {
						properties.push(parseInt(req.query[property]));
					}
					else {
						properties.push(req.query[property]);
					}
				}

			}
		}
		if(properties.length > 0) {
			selectString = selectString + whereString;
			selectString = selectString.substring(0, selectString.length - 4);
		}

	}
	selectString = selectString + " ORDER BY `dln` ASC, m.release_date DESC";
	mysql.pool.query(selectString, properties, function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		context.results = rows;
		res.render('fancyDirectors', context);
	});
});

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
							  	"`cid` int(11) DEFAULT '0'," +
							  	"PRIMARY KEY (`id`)," +
							  	"FOREIGN KEY (`cid`) REFERENCES `country` (`id`) ON DELETE SET NULL ON UPDATE CASCADE" +
							  	") ENGINE=InnoDB";
							  var actors = "CREATE TABLE `actors` (" +
							  	"`id` int(11) NOT NULL AUTO_INCREMENT," +
							  	"`first_name` varchar(255) NOT NULL," +
							  	"`last_name` varchar(255) NOT NULL," +
							  	"`age` int(11) NOT NULL," +
							  	"`cid` int(11) DEFAULT '0'," +
							  	"PRIMARY KEY (`id`)," +
							  	"FOREIGN KEY (`cid`) REFERENCES `country` (`id`) ON DELETE SET NULL ON UPDATE CASCADE" +
							  	") ENGINE=InnoDB";
							  var dM = "CREATE TABLE `directors_movies` (" +
							  	"`direct_id` int(11) NOT NULL DEFAULT '0'," +
							  	"`movie_id` int(11) NOT NULL DEFAULT '0'," +
							  	"PRIMARY KEY (`direct_id`,`movie_id`)," +
							  	"FOREIGN KEY (`direct_id`) REFERENCES `directors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE," +
							  	"FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE" +
							  	") ENGINE=InnoDB";
							  var aM = "CREATE TABLE `actors_movies` (" +
							  	"`act_id` int(11) NOT NULL DEFAULT '0'," +
							  	"`movie_id` int(11) NOT NULL DEFAULT '0'," +
							  	"PRIMARY KEY (`act_id`,`movie_id`)," +
							  	"FOREIGN KEY (`act_id`) REFERENCES `actors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE," +
							  	"FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE" +
							  	") ENGINE=InnoDB";
							  var mC = "CREATE TABLE `movies_countries` (" +
							  	"`movie_id` int(11) NOT NULL DEFAULT '0'," +
							  	"`cid` int(11) NOT NULL DEFAULT '0'," +
							  	"PRIMARY KEY (`movie_id`,`cid`)," +
							  	"FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE," +
							  	"FOREIGN KEY (`cid`) REFERENCES `country` (`id`) ON DELETE CASCADE ON UPDATE CASCADE" +
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