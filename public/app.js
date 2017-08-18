/* This file provides the interface for the workout table to be built via the
 * server.js file that makes call to the server to update the table via events
 * that are triggered by the implementation of elements below.
 */

// create an event listener to look for clicks on the button to submit the form
document.getElementById('postNewCountry').addEventListener('click', function (event) {
    var req = new XMLHttpRequest();
    var payload = {};
    var newCountry = document.getElementById("newCountry");
    payload.name = newCountry.name.value;
    payload.continent = newCountry.continent.value;
    payload.population = newCountry.population.value;

    req.open("POST", "/insert_country", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function() {
        if(req.status >= 200 && req.status < 400) {
            if(req.responseText) {
                console.log(req.responseText);
             }
           }
           else {
               console.log("Error in network request: " + req.statusText);
           }
    });
    console.log(payload);
    req.send(JSON.stringify(payload));
    event.preventDefault();
});

// posts a new movie to the movies table
document.getElementById('postNewMovie').addEventListener('click', function (event) {
    var req = new XMLHttpRequest();
    var payload = {};
    var newMovie = document.getElementById("newMovie");
    payload.title = newMovie.title.value;
    payload.genre = newMovie.genre.value;
    payload.runtime = newMovie.runtime.value;
    payload.release_date = newMovie.release_date.value;

    req.open("POST", "/insert_movie", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function() {
        if(req.status >= 200 && req.status < 400) {
            if(req.responseText) {
                console.log(req.responseText);
             }
           }
           else {
               console.log("Error in network request: " + req.statusText);
           }
    });
    console.log(payload);
    req.send(JSON.stringify(payload));
    event.preventDefault();
});

// posts a new director to the directors table
document.getElementById('postNewDirector').addEventListener('click', function (event) {
    var req = new XMLHttpRequest();
    var payload = {};
    var newDirector = document.getElementById("newDirector");
    payload.first_name = newDirector.first_name.value;
    payload.last_name = newDirector.last_name.value;
    payload.age = newDirector.age.value;
    payload.name = newDirector.name.value;


    req.open("POST", "/insert_director", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function() {
        if(req.status >= 200 && req.status < 400) {
            if(req.responseText) {
                console.log(req.responseText);
             }
           }
           else {
               console.log("Error in network request: " + req.statusText);
           }
    });
    console.log(payload);
    req.send(JSON.stringify(payload));
    event.preventDefault();
});

// posts a new actor to the actors table
document.getElementById('postNewActor').addEventListener('click', function (event) {
    var req = new XMLHttpRequest();
    var payload = {};
    var newActor = document.getElementById("newActor");
    payload.first_name = newActor.first_name.value;
    payload.last_name = newActor.last_name.value;
    payload.age = newActor.age.value;
    payload.name = newActor.name.value;

    req.open("POST", "/insert_actor", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function() {
        if(req.status >= 200 && req.status < 400) {
            if(req.responseText) {
                console.log(req.responseText);
             }
           }
           else {
               console.log("Error in network request: " + req.statusText);
           }
    });
    console.log(payload);
    req.send(JSON.stringify(payload));
    event.preventDefault();
});

// posts a new relationship of movies filmed in a country
document.getElementById('postNewMinC').addEventListener('click', function (event) {
	var req = new XMLHttpRequest();
	var payload = {};
	var mINc = document.getElementById("newMinC");
	payload.title = mINc.title.value;
	payload.name = mINc.name.value;

	req.open("POST", "/insertMinC", true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load', function() {
		if (req.status >= 200 && req.status < 400) {
			if (req.responseText) {
				console.log(req.responseText);
			}
		}
		else {
			console.log("Error in network request: " + req.statusText);
		}
	});
	console.log(payload);
	req.send(JSON.stringify(payload));
	event.preventDefault();
});

// posts a new relationship of director of a movie
document.getElementById('postNewDofM').addEventListener('click', function (event) {
	var req = new XMLHttpRequest();
	var payload = {};
	var dOFm = document.getElementById("newDofM");
	payload.first_name = dOFm.d_fname.value;
	payload.last_name = dOFm.d_lname.value;
	payload.title = dOFm.title.value;

	req.open("POST", "/insertDofM", true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load', function() {
		if (req.status >= 200 && req.status < 400) {
			if (req.responseText) {
				console.log(req.responseText);
			}
		}
		else {
			console.log("Error in network request: " + req.statusText);
		}
	});
	console.log(payload);
	req.send(JSON.stringify(payload));
	event.preventDefault();
});

// posts a new relationship of actor in a movie
document.getElementById('postNewAinM').addEventListener('click', function (event) {
	var req = new XMLHttpRequest();
	var payload = {};
	var aINm = document.getElementById("newAinM");
	payload.first_name = aINm.a_fname.value;
	payload.last_name = aINm.a_lname.value;
	payload.title = aINm.title.value;

	req.open("POST", "/insertAinM", true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load', function() {
		if (req.status >= 200 && req.status < 400) {
			if (req.responseText) {
				console.log(req.responseText);
			}
		}
		else {
			console.log("Error in network request: " + req.statusText);
		}
	});
	console.log(payload);
	req.send(JSON.stringify(payload));
	event.preventDefault();
});
