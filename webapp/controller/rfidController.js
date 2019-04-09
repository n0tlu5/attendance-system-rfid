var express = require('express');
var router = express.Router();

router.post('/update/:nrp/:cid',function(req,res){
    const nrp = req.params.nrp;
    const cid = req.params.cid;
    const db = require('../db.js');

    console.log(cid)
    console.log(nrp)

    db.query('UPDATE mahasiswa SET card_id = ? WHERE nrp = ?', [cid, nrp], function (err, result) {
        if (err) {
            res.render('error', { title: 'Bad Request' });
        }else{
            db.query('UPDATE last_scan SET cid = "tap and refresh to update card id" WHERE id=1');
            res.redirect('/mahasiswa');
        }
    })
})

router.post('/update/last',function(req,res){
    const db = require('../db.js');
    var cid=req.body.cid;

    db.query('UPDATE last_scan SET cid = ? WHERE id = 1', [cid], function (err, result) {
        if (err) {
            res.send("db error");
        }else{
            res.send("success");
        }
    })
})

router.post('/',function(req,respond){
    const db = require('../db.js');
    var cid=req.body.cid;
    var ruang=req.body.ruang;
    console.log("python: " + cid + "; ruang: " + ruang);
    
    db.query('SELECT nrp FROM mahasiswa WHERE card_id = ?', [cid], function(err, result) {
        if(err){
            if(err) throw err;
        }else{
            if(result.length>0){
                const nrp = result[0].nrp;
                db.query('SELECT id, jadwal_hari, jam_mulai, jam_selesai FROM kelas WHERE (ruang = ?) AND (jadwal_hari = DAYOFWEEK(CURDATE())) AND ((CURTIME()>=jam_mulai-10*60) OR (CURTIME()<=jam_selesai))', [ruang], function(err, res){
                    if(err) throw err;
                    if(res.length>0){
                        db.query('select id from kehadiran where student_id= ? and class_id= ? AND (? = DAYOFWEEK(CURDATE())) AND ((CURTIME()>=?-10*60) OR (CURTIME()<=?))', [nrp, res[0].id, res[0].jadwal_hari, res[0].jam_mulai, res[0].jam_selesai], function(err, result){
                            if(err) throw err;
                            if(result.length==0){
                                db.query('INSERT INTO kehadiran(class_id, student_id) VALUES (?, ?)',[res[0].id, nrp], function(err){
                                    if(err){
                                        console.log(err)
                                        throw err;
                                    }else{
                                        console.log('welcome ' + nrp);
                                        respond.send('success : {ruang: '+ ruang +', nrp: '+nrp+', card id: '+ cid +"}");
                                    }
                                })
                            }else{
                                console.log('sudah absen');
                                respond.send('sudah absen');
                            }
                        })
                    }else{
                        console.log('ruang sedang tidak ada jadwal');
                        respond.send('ruang sedang tidak ada jadwal');
                    }
                })
            }else{
                console.log('NRP not found');
                respond.send('NRP not found');
            }
        }
    });
});

module.exports = router;

// net.createServer(function(socket) {
// 	console.log('[*]incoming request from: ' + socket.remoteAddress +':'+ socket.remotePort);
	
// 	socket.on('data', function(datax) {
// 		var data = ""+ datax;
// 		const ruang = data.substr(0,3);
// 		const cid = data.substr(3,12);
// 		// console.log("cid: " + cid + "; ruang: " + ruang);
// 		const db = require('../db.js');

// 		db.query('SELECT nrp FROM mahasiswa WHERE card_id = ?', [cid], function(err, result) {
// 			if(err){
// 				if(err) throw err;
// 			}
// 			if(result.length>0){
// 				const nrp = result[0].nrp;
// 				db.query('SELECT id FROM kelas WHERE (ruang = ?) AND (jadwal_hari = DAYOFWEEK(CURDATE())) AND ((CURTIME()>=jam_mulai-10*60) OR (CURTIME()<=jam_selesai))', [ruang], function(err, res){
// 					if(err) throw err;
// 					if(res.length>0){
// 						db.query('INSERT INTO kehadiran(class_id, student_id) VALUES (?, ?)',[res[0].id, nrp], function(err){
// 							if(err) console.log(err);
// 							console.log('welcome ' + nrp);
// 						})
// 					}else{
// 						console.log('data not valid');
// 					}
// 				})
// 				socket.write('ruang: '+ ruang +'; nrp: '+nrp+'; card id: '+data.substr(3,16));
// 			}else{
// 				socket.write('failed');
// 			}
// 		});
// 	});
	
// 	socket.on('close', function(data) {
// 		console.log('Socket connection closed... ');
// 	});
// }).listen(sPort, sHost);

// console.log('Server(NET) listening on ' + '0.0.0.0' +':'+ 8048);
