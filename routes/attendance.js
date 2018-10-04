var express = require('express');
var router = express.Router();
var net = require('net');

router.get('/', function(req, res, next) {
    const db = require('../db');

    db.query('SELECT * FROM kehadiran', function(err, result) {
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

router.get('/listening/:classid', function(req, res, next){
    const class_id = req.params.classid;
    const db = require('../db');

    res.render('attendance/listening', {
        title: 'Scan your tag',
        classid: class_id
    });
});


module.exports = router;