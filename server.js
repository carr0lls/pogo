var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var execFile = require('child_process').execFile;
var fs = require('fs');

var app = express();
var status;
var CONFIG_FILE = path.join(__dirname, 'config.json');

app.set('port', 4000);
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

function startServer(cb) {
	fs.readFile(CONFIG_FILE, function(err, data) {
    	var CONFIG = data ? JSON.parse(data) : [];
    	var options = '';
		for (setting in CONFIG) {
			options += CONFIG[setting].key + ' ' + CONFIG[setting].value + ' ';
		}
		status = execFile('./start', [options], function (error, stdout, stderr) {
			if (error !== null) {
				console.log('exec error: ' + error);
			}
		});	
		cb(null, 'starting server... ');
	});	
}

function stopServer(cb) {
	exec('./stop', function (error, stdout, stderr) {
		if (error !== null) {
			console.log('exec error: ' + error);
		}
		status = null;
		cb(null, 'stopping server... ');		
	});
}

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/start', function(req, res) {
  	if (status) {
  		res.send('server is already running!');
	}
	else {
		startServer(function(err, response) {
			res.send(response);
		});
	}
});

app.get('/stop', function(req, res) {
	if (!status) {
		res.send('server has already stopped!');
	}
	else {
		stopServer(function(err, response) {
			res.send(response);
		});		
	}
});

app.get('/restart', function(req, res) {
	if (status) {
		stopServer(function(err, response) {
			res.write(response);
			startServer(function(err, response) {
				res.write(response);
				res.end();
			});		
		});		
	}
	else {
		startServer(function(err, response) {
			res.write(response);
			res.end();
		});
	}
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
})
