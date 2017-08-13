/* This file provides the interface for updating tables via the
 * server.js file that makes call to the server to update the table via events
 * that are triggered by the implementation of elements below.
 */

document.getElementById('postREMOVEam').addEventListener('click', function (event) {
	var req = new XMLHttpRequest();
	var payload = {};
	var RMam = document.getElementById("removeAfromM");
	payload.first_name = RMam.a_fname.value;
	payload.last_name = RMam.a_lname.value;
	payload.title = RMam.movie_title.value;

	req.open("POST", "/removeAinM", true);
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

document.getElementById('postREMOVEdm').addEventListener('click', function (event) {
	var req = new XMLHttpRequest();
	var payload = {};
	var RMdm = document.getElementById("removeDfromM");
	payload.first_name = RMdm.d_fname.value;
	payload.last_name = RMdm.d_lname.value;
	payload.title = RMdm.m_title.value;

	req.open("POST", "/removeDofM", true);
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

document.getElementById('postREMOVEmc').addEventListener('click', function (event) {
	var req = new XMLHttpRequest();
	var payload = {};
	var RMmc = document.getElementById("removeMfromC");
	payload.title = RMmc.movie_title.value;
	payload.name = RMmc.country_name.value;

	req.open("POST", "/removeMinC", true);
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

