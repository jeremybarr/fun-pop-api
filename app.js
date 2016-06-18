

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');

var routes = require('./routes/index');
var users = require('./routes/user');

var app = express();


var pg = require("pg");

var conString = "pg://shiv:root@localhost:5432/funpop";

var client = new pg.Client(conString);

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup
app.engine('swig', swig.renderFile)
app.set('view cache', false);
swig.setDefaults({ cache: false });
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'swig');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.post('/save', function(req,res) {
    var event_name = req.body.name;
    var desc = req.body.desc;
    var creator = req.body.creator;
    var current = req.body.current;
    var target = req.body.target;
    var url = req.body.url;


    console.log("event name: "+event_name);

        var client = new pg.Client(conString);
		client.connect();
			
		client.query("insert into events(name,description,creator,current,target,url) values ($1,$2,$3,$4,$5,$6)", [event_name,desc,creator, current, target, url], function(err) {
            if(err)
            {
                console.log("Error inserting");
                res.send("fail");
            }
            else
            {
                console.log("Success");
                res.send("success");
            }
        });

			

});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
