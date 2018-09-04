var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    const db = require('../db');

    db.query('SELECT * FROM kehadiran', function(err, result) {
        if(err) throw err;
        res.render('attendance/dashboard', {
            title: 'Daftar Kehadiran',
            result: result
        });
    })
});

router.get('/delete/:id', function(req, res, next) {
    const db = require('../db');
    const attendance_id = req.params.id;

    db.query('DELETE FROM kehadiran WHERE id = ?', [attendance_id], function(err, result) {
        if(err) throw err;
        res.redirect('/attendance');
    })
});

router.get('/checkin/:classid/:studentid', function(req, res, next) {
    const db = require('../db');
    const class_id = req.params.classid;
    const student_id = req.params.studentid;

    db.query('INSERT INTO kehadiran(class_id, student_id)', [class_id, student_id], function(err, result) {
        if(err) throw err;
        res.redirect('/attendance/success/'+class_id+'/'+student_id);
    })
});

router.get('/success/:classid/:studentid', function(req, res, next){
    const class_id = req.params.classid;
    const student_id = req.params.studentid;
    const db = require('../db');

    db.query('SELECT * FROM mahasiswa WHERE nrp = ?', [student_id], function(err, result) {
        if(err) throw err;

        res.render('attendance/success', {
            title: 'Scan your tag',
            name: result[0].nama,
            classid: class_id,
            studentid: student_id
        });
    });
});

router.get('/listening/:classid', function(req, res, next){
    const class_id = req.params.classid;


    res.render('attendance/listening', {
        title: 'Scan your tag',
        classid: class_id
    });
});


module.exports = router;