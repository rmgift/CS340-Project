/* This file provides the interface for the workout table to be built via the
 * server.js file that makes call to the server to update the table via events
 * that are triggered by the implementation of elements below.
 */

// create an event listener to look for clicks on the button to submit the form
document.getElementById('postNewCountry').addEventListener('click', function (event) {
    /* get the form ID so we can capture the data upon clicking the submit button */
    var newCountry = document.getElementById("newCountry");
    /* XMLHttpRequest is an object that can make an HTTP request and 
       return the data it gets from that request */
    var req = new XMLHttpRequest();
    /* setup our URL from the submission so we can send the get request */
    var siteURL = "country=" + newCountry.elements.country.value +
        "&continent=" + newCountry.elements.continent.value +
        "&population=" + newCountry.elements.population.value;
    /* open a get request, setup to send via the server.js and the app.get('/insert') route 
       this route, '/insert' is mapped to send a query to the server to insert the new
       exercise into the table */
    req.open("GET", "/insert?" + siteURL, true);
    /* set the request header to let the server know the type of data we're sending */
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    /* send our request and response will print once its received */
    req.send("/insert?" + siteURL);
    /* prevent the default from beginning */
    event.preventDefault();
});