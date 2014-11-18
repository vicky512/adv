
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongo = require('mongoskin');
var db = mongo.db('mongodb://127.0.0.1:27017/nodeTest1', {native_parser:true});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.use(function(req, res, next){
	// console.log('in app.use');
	// console.log(db);
	req.db = db;
	next();
});

app.post('/*', function(req, res, next){
	req.db = db;
	next();
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/testPage1', routes.testPage);
app.get('/display', routes.displayUsers);
app.get('/add', routes.newUser);
app.post('/add', routes.addNewUser);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
