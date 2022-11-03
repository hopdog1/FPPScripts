var http = require('http');
const got = require('got');

var io = require('socket.io-client'),
socket = io.connect("https://southernlights.herokuapp.com/", { //for local, use "http://192.168.142:3000";for prod, "https://southernlights.herokuapp.com/"
     extraHeaders: {     "fpp": "1234"   } }); 
socket.on('connect', function () { console.log("socket connected"); });

socket.on('getStatus', function () {
//	console.log("received getStatus");
	got('http://localhost/api/fppd/status/').then(response => {   
	//console.log(response.body);  
	data = JSON.parse(response.body);
//	console.log("emmitting statusUPdate");
//	socket.emit("statusUpdate",data);
	returnData("statusUpdate",data);
 	}).catch(error => {   console.log(error.response.body); });
});

function returnData(signal, stuff){
	socket.emit(signal ,stuff);
}

socket.on('speakerOn', function (volume){
	got("http://192.168.1.134/api/command/Volume%20Set/"+volume.toString()).then(response => {
		console.log("speakerOn ",volume.toString(), response.body);
	}).catch(error => {	console.log(error.response.body); });
});

socket.on('speakerOff', function () {
	got("http://192.168.1.134/api/command/Volume%20Set/0").then(response => {
		console.log(response.body);
	}).catch(error => {	console.log(error.response.body); });
});

socket.on('getSequenceList', function () {
	got("http://localhost/api/playlist/Production-RemoteFalcon").then(response => {
	tempList = [];
	data = JSON.parse(response.body);
	var ObjectKeysArray =  Object.keys(data.mainPlaylist);
	ObjectKeysArray.forEach(function(objKey) {

		test=data.mainPlaylist[objKey].sequenceName;
		tempList.push(test);
//			tempList.push(data.mainPlaylist[objKey].seqeuenceName);
 });
	 console.log(tempList);
	returnData("sendSequenceList",tempList); })});	
//	console.log(element) })}).catch(error => { console.log(error.response)});

socket.on("insertSong", function(index) {
 console.log("received insert song");
 got("http://localhost/api/command/Insert%20Playlist%20After%20Current/Production-RemoteFalcon/"+ index + "/" +index).then(response => {
    console.log("insert song response =",response.body);
}).catch(error => { console.log(error.response.body);});

socket.on("getCurrSequence", function () {
	console.log("received getCurrSequence");
	got('http://localhost/api/fppd/status/').then(response => {
	data = JSON.parse(response.body);
	console.log("currSequence = ", data.current_sequence);
	socket.emit("currSequence", data.current_sequence);
	}).catch(error => { console.log(error.response.body);});
});
});
 

