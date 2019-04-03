var express = require('express');
var router = express.Router();

router.post('/',function(req,res){
    const db = require('../db.js');
    var cid=req.body.cid;
    var ruang=req.body.ruang;
    console.log("python: " + cid + "; ruang: " + ruang);
    
    db.query('SELECT nrp FROM mahasiswa WHERE card_id = ?', [cid], function(err, result) {
        if(err){
            if(err) throw err;
        }
        if(result.length>0){
            const nrp = result[0].nrp;
            db.query('SELECT id FROM kelas WHERE (ruang = ?) AND (jadwal_hari = DAYOFWEEK(CURDATE())) AND ((CURTIME()>=jam_mulai-10*60) OR (CURTIME()<=jam_selesai))', [ruang], function(err, res){
                if(err) throw err;
                if(res.length>0){
                    db.query('INSERT INTO kehadiran(class_id, student_id) VALUES (?, ?)',[res[0].id, nrp], function(err){
                        if(err) console.log(err);
                        console.log('welcome ' + nrp);
                        // res.send('success');
                    })
                }else{
                    console.log('data not valid');
                    // res.send('data is not valid');
                }
            })
            res.send('ruang: '+ ruang +'; nrp: '+nrp+'; card id: '+ cid);
        }else{
            res.send('failed');
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