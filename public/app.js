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

document.getElementById('postNewDirector').addEventListener('click', function (event) {
    var req = new XMLHttpRequest();
    var payload = {};
    var newDirector = document.getElementById("newDirector");
    payload.fname = newDirector.first_name.value;
    payload.lname = newDirector.last_name.value;
    payload.age = newDirector.age.value;
    payload.country = newDirector.country_director.value;


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

document.getElementById('postNewActor').addEventListener('click', function (event) {
    var req = new XMLHttpRequest();
    var payload = {};
    var newActor = document.getElementById("newActor");
    payload.fname = newActor.first_name.value;
    payload.lname = newActor.last_name.value;
    payload.age = newActor.age.value;
    payload.country = newActor.country_actor.value;

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
