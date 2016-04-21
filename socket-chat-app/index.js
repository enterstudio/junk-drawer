var server = require('http').createServer()
	, url = require('url')
	, WebSocketServer = require('ws').Server
	, wss = new WebSocketServer({ server: server })
	, express = require('express')
	, app = express()
	, port = 4080;

app.use('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

var count = 0;
var clients = {};


wss.on('connection', function connection(ws) {
	// Specific id for this client & increment count
	var id = count++;
	// Store the connection method so we can loop through & contact all clients
	clients[id] = ws;
	console.log((new Date()) + ' Connection accepted [' + id + ']');
	var location = url.parse(ws.upgradeReq.url, true);
	// you might use location.query.access_token to authenticate or share sessions
	// or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

	ws.on('message', function incoming(message) {
		var msgString = message.utf8Data;

		// Loop through all clients
		for(var i in clients){
			// Send a message to the client with the message
			clients[i].send(message);
		}
	});

	ws.send('Hello, please tell me something.');
});

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port); });
