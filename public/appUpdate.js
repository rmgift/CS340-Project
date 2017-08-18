/* This file provides the interface for updating tables via the
 * server.js file that makes call to the server to update the table via events
 * that are triggered by the implementation of elements below.
 */

// this event listener is triggered when someone updates an actors demographics
document.getElementById('postUpAct').addEventListener('click', function (event) {
	var req = new XMLHttpRequest();
	var payload = {};
	var upAct = document.getElementById("updateActor");

	payload.first_name = upAct.a_fname.value;
	payload.last_name = upAct.a_lname.value;
	payload.age = upAct.a_age.value;
	payload.name = upAct.name.value;

	req.open("POST", "/update_actor", true);
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