var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var exec = require('child_process').exec;

var app = express();
var status;

app.set('port', 3000);
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
	res.render('index');
});

app.get('/start', function(req, res){
  if (status) {
  	res.send('server is already running!');
	}
	else {
		status = exec('./start',
			function (error, stdout, stderr) {
				console.log('stdout: ' + stdout);
				console.log('stderr: ' + stderr);
			if (error !== null) {
				console.log('exec error: ' + error);
			}
		});	
		res.send('starting server...');
	}
});

app.get('/stop', function(req, res){
  if (status) {
		exec('./stop',
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
