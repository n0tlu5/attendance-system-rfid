var express = require('express');
var router = express.Router();

router.get('/', authenticationMiddleware(), function(req, res, next) {
    const db = require('../db');
    db.query('SELECT * FROM kelas', function(err, results) {
        if(err) throw err;
    
        res.render('kelas/kelas', {
          title: 'Daftar Kelas',
          list: results
        });
      });
});

router.get('/:id/tambah', function(req, res, next) {
    res.render('kelas/tambah_mahasiswa', { title: 'Tambahkan Mahasiswa ke Kelas', class_id: req.params.id});
});

router.post('/:id/tambah', function(req, res, next) {
    req.checkBody('nrp', 'NRP must be 14 characters long.').len(14);

    const errors = req.validationErrors();

    if(errors){
        res.render('kelas/tambah_mahasiswa', {
            title: 'Tambahkan Mahasiswa ke Kelas',
            errors: errors
        });
    } else {
        const nrp = req.body.nrp;
    
        const db = require('../db');
        
        db.query('INSERT INTO kelas_mahasiswa (student_id, class_id) VALUES(?, ?)', [nrp, req.params.id], function(err) {
            if(err){
                res.render('error', { title: 'Bad Request' });
            }else{
                res.redirect('/kelas/detail/'+req.params.id);
            }
        });
    }
});

router.get('/:id/:nrp/delete', authenticationMiddleware(), function(req, res, next) {
    const db = require('../db');
    const class_id=req.params.id;
    const student_id=req.params.nrp;

    db.query('DELETE FROM kelas_mahasiswa WHERE student_id = ? AND class_id = ?', [student_id, class_id], function(err, result){
        if(err){
            res.render('error', { title: 'Bad Request' });
        }else{
            res.redirect('/kelas/detail/'+class_id);
        }
    })
});

router.get('/detail/:id', authenticationMiddleware(), function(req, res, next) {
    const class_id=req.params.id;
    const db = require('../db');
    db.query('SELECT * FROM kelas_mahasiswa WHERE class_id = ? ORDER BY student_id ASC', [class_id], function(err, results) {
        if(err) throw err;

        if(results.length === 0){
            res.render('kelas/detail_kelas', {
                title: 'Daftar Mahasiswa Kelas',
                class_id: class_id,
            });
        }else{
            res.render('kelas/detail_kelas', {
                title: 'Daftar Mahasiswa Kelas',
                class_id: class_id,
                results: results
            });
        }
    });
})

router.get('/delete/:id', authenticationMiddleware(), function(req, res, next) {
    const db = require('../db');
    const class_id = req.params.id;

    db.query('DELETE FROM kelas_mahasiswa WHERE class_id = ?', [class_id], function(err, row) {
        if(err){
            res.render('error', { title: 'Bad Request' });
        }else{
            db.query('DELETE FROM kelas WHERE id = ?',[class_id],function(err, results) {
                if(err) throw err;
        
                res.redirect('/kelas');
            })
        }
    })
});

router.get('/edit/:id', authenticationMiddleware(), function(req, res, next) {
    const db = require('../db');

    const class_id = req.params.id;

    db.query('SELECT * FROM kelas WHERE id = ?',[class_id],function(err, results, fields) {
        if(err){
            res.render('error', { title: 'Bad Request' });
        }else{
            res.render('kelas/edit_kelas', { title: 'Edit Data', results: results});
        }
    })
});

router.post('/edit/:id', authenticationMiddleware(), function(req, res, next) {
    req.checkBody('nama', 'Nama Kelas field cannot be empty.').notEmpty();
    req.checkBody('nama', 'Nama Kelas must be between 4-15 characters long.').len(4, 15);

    const errors = req.validationErrors();

    if(errors){
        res.render('kelas/edit_kelas', {
            title: 'Edit Kelas',
            errors: errors
        });
    } else {
        const nama = req.body.nama;
        const jadwal_hari = req.body.jadwal_hari;
        const ruang = req.body.ruang;
        const jam_mulai = req.body.jam_mulai;
        const jam_selesai = req.body.jam_selesai;
    
        const db = require('../db');
        db.query('UPDATE kelas SET nama_kelas = ?, ruang= ?, jadwal_hari = ?, jam_mulai = ?, jam_selesai = ? WHERE id = ?', [nama, ruang, jadwal_hari, jam_mulai, jam_selesai, req.params.id], function(err) {
            if(err){
                res.render('error', { title: 'Bad Request' });
            }else{
                res.redirect('/kelas');
            }
        });
    }
});

router.get('/tambah', authenticationMiddleware(), function(req, res, next) {
    res.render('kelas/tambah_kelas');``
});

router.post('/tambah', authenticationMiddleware(), function(req, res, next) {
    req.checkBody('nama', 'Nama Kelas field cannot be empty.').notEmpty();
    req.checkBody('nama', 'Nama Kelas must be between 4-15 characters long.').len(4, 15);
    
    const errors = req.validationErrors();
    if(errors){
        
        res.render('kelas/kelas', {
        title: 'Tambah Kelas',
        errors: errors
        });
    } else{
        const nama = req.body.nama;
        const jadwal_hari = req.body.jadwal_hari;
        const ruang = req.body.ruang;
        const jam_mulai = req.body.jam_mulai;
        const jam_selesai = req.body.jam_selesai;

        const db = require('../db');
        db.query('INSERT INTO kelas (nama_kelas, ruang, jadwal_hari, jam_mulai, jam_selesai) VALUES(?, ?, ?, ?, ?)', [nama, ruang, jadwal_hari, jam_mulai, jam_selesai], function(err) {
            if(err){
                res.render('error', { title: 'Bad Request' });
            }else{
                res.redirect('/kelas');
            }
        })
    }
});

function authenticationMiddleware () {  
	return (req, res, next) => {

	    if (req.isAuthenticated()) return next();
	    res.redirect('/login')
	}
}

module.exports = router;