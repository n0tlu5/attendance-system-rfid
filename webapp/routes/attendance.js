var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    const db = require('../db');

    db.query('SELECT id, student_id, class_id, DATE_FORMAT(date,"%a, %b %e %Y. %H:%i:%S") date FROM kehadiran ORDER BY date DESC', function(err, result) {
        if(err){
            res.render('error', { title: 'Bad Request' });
        }else{
            res.render('attendance/dashboard', {
                title: 'Daftar Kehadiran',
                result: result
            });
        }
    })
});

router.get('/delete/:id', function(req, res, next) {
    const db = require('../db');
    const attendance_id = req.params.id;

    db.query('DELETE FROM kehadiran WHERE id = ?', [attendance_id], function(err, result) {
        if(err){
            res.render('error', { title: 'Bad Request' });
        }else{
            res.redirect('/attendance');
        }
    })
});

module.exports = router;