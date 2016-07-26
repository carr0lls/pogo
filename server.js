var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var execFile = require('child_process').execFile;
var fs = require('fs');

var app = express();
var status;
var CONFIG_FILE = path.join(__dirname, 'config.json');

app.set('port', 4000);
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
	res.render('index');
});

app.get('/start', function(req, res) {
  	if (status) {
  		res.send('server is already running!');
	}
	else {
		fs.readFile(CONFIG_FILE, function(err, data) {
	    	var CONFIG = data ? JSON.parse(data) : [];
	    	var options = '';
			for (setting in CONFIG) {
				options += CONFIG[setting].key + ' ' + CONFIG[setting].value + ' ';
			}
			status = execFile('./start', [options], function (error, stdout, stderr) {
					console.log('stdout: ' + stdout);
					console.log('stderr: ' + stderr);

				if (error !== null) {
					console.log('exec error: ' + error);
				}
			});	
			res.send('starting server...');
		});
	}
});

app.get('/stop', function(req, res){
  if (status) {
		execFile('./stop',
			function (error, stdout, stderr) {
				console.log('stdout: ' + stdout);
				console.log('stderr: ' + stderr);
			if (error !== null) {
				console.log('exec error: ' + error);
			}
		});
		status = null;
  	res.send('stopping server...');
	}
	else {
		res.send('server has already stopped!');
	}
});

app.get('/restart', function(req, res){
  res.end('ok');
});

app.listen(app.get('port'), () => {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
})
