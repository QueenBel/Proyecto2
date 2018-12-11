var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
//var http = require('http');


//var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var casasRouter = require('./routes/house');

//var restauranteRouter = require('./routes/api/serviceRestaurants');
var menuRouter = require('./routes/api/serviceMenus');
var clienteRouter = require('./routes/api/serviceClients');
var ordenRouter = require('./routes/api/serviceFastFood');

var serviceRouter = require('./routes/api/service');
var userRouter = require('./routes/api/services');
var services = require('./routes/api/v1.0/services');
var app = express();

app.use(session({
  secret: "sosecret",
  saveUninitialized: false,
  resave: false
}));

// middleware to make 'user' available to all templates
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));



//app.use('/', indexRouter);
app.use('/', casasRouter);
app.use('/users', usersRouter);

//app.use('/api/', restauranteRouter);
app.use('/api/', menuRouter);
app.use('/api/', clienteRouter);
app.use('/api/', ordenRouter);

app.use('/api/', serviceRouter);
app.use('/api/', userRouter);

app.use('/api/v1.0/', services);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var port = 7070;
app.listen(port, () => {
  console.log("Corriendo en " + port);
});


module.exports = app;
