var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var logger = require('morgan');

//auth packages
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var MySQLStore = require('express-mysql-session')(session);

var indexRouter = require('./routes/index');
var mahasiswaRouter = require('./routes/mahasiswa');
var kelasRouter = require('./routes/kelas');
var attendanceRouter = require('./routes/attendance');
var rfidController = require('./controller/rfidController');

var app = express();

require('dotenv').config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var options = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database : process.env.DB_NAME
};

var sessionStore = new MySQLStore(options);

app.use(session({
	secret: 'keyboard cat',
	resave: false,
	store: sessionStore,
	saveUninitialized: true,
	// cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
	res.locals.isAuthenticated = req.isAuthenticated();
	next();
})

app.use('/', indexRouter);
app.use('/mahasiswa', mahasiswaRouter);
app.use('/kelas', kelasRouter);
app.use('/attendance', attendanceRouter);
app.use('/rfid', rfidController);

passport.use(new LocalStrategy(
	function(username, password, done) {
		const db = require('./db');
		
		db.query('SELECT id, password FROM users WHERE username = ?', [username], function(err, results, fields) {
			if(err) {return done(err)};
			
			if(results.length === 0){
				return done(null, false);
			}else{
				const hash = results[0].password.toString();
				
				bcrypt.compare(password, hash, function(err, response) {
					if(response === true) {
						return done(null, {user_id: results[0].id});
					} else {
						return done(null, false);
					}
				});
			}
		})
	}
	));
	
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
	
	module.exports = app;
	