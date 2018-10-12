var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('home', { title: 'RFID Attendance System' });
});

router.get('/login', function(req, res, next) {
	res.render('login', {title: 'Login Page'});
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login'
}));

router.get('/logout', function(req, res, next) {
	req.logout();
	req.session.destroy(function() {
		res.redirect('/');
	});
});

router.get('/register', function(req, res, next) {
	res.render('register', {title: 'Registration Page'});
});

router.post('/register', function(req, res, next) {
	req.checkBody('username', 'Username field cannot be empty.').notEmpty();
	req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
	req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
	req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
	req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
	req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
	req.checkBody('passwordMatch', 'Password must be between 8-100 characters long.').len(8, 100);
	req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);
	req.checkBody('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');
	
	const errors = req.validationErrors();
	
	if(errors){
		
		res.render('register', {
			title: 'Registration Page',
			errors: errors
		});
	}else{
		const username = req.body.username;
		const email = req.body.email;
		const password = req.body.password;
		
		const db = require('../db');
		bcrypt.hash(password, 10, function(err, hash) {
			if(this.err) throw this.err;
			db.query('INSERT INTO users (username, email, password) VALUES(?,?,?)', [username, email, hash], function(err) {
				if(err){
					res.render('error', { title: 'Bad Request' });
				}else{
					
					db.query('SELECT LAST_INSERT_ID() as user_id', function(error, results, fields) {
						if(err){
							res.render('error', { title: 'Bad Request' });
						}else{
							const user_id =results[0];
							
							req.login(user_id, function(err) {
								if(err) throw err;
								res.redirect('/');
							});
						}
					});
				}
			});
		});
	}
});

passport.serializeUser(function(user_id, done) {
	done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
	done(null, user_id);
});

module.exports = router;