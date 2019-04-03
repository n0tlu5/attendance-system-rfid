-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.7.23-0ubuntu0.18.04.1 - (Ubuntu)
-- Server OS:                    Linux
-- HeidiSQL Version:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for test
CREATE DATABASE IF NOT EXISTS `test` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `test`;

-- Dumping structure for table test.kehadiran
CREATE TABLE IF NOT EXISTS `kehadiran` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` varchar(14) NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_kehadiran_kelas` (`class_id`),
  KEY `FK_kehadiran_mahasiswa` (`student_id`),
  CONSTRAINT `FK_kehadiran_kelas` FOREIGN KEY (`class_id`) REFERENCES `kelas` (`id`),
  CONSTRAINT `FK_kehadiran_mahasiswa` FOREIGN KEY (`student_id`) REFERENCES `mahasiswa` (`nrp`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table test.kelas
CREATE TABLE IF NOT EXISTS `kelas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_kelas` varchar(50) DEFAULT NULL,
  `ruang` varchar(50) DEFAULT NULL,
  `jadwal_hari` int(11) DEFAULT NULL,
  `jam_mulai` time DEFAULT NULL,
  `jam_selesai` time DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table test.kelas_mahasiswa
CREATE TABLE IF NOT EXISTS `kelas_mahasiswa` (
  `student_id` varchar(14) DEFAULT NULL,
  `class_id` int(11) NOT NULL,
  KEY `FK_kelas_mahasiswa_kelas` (`class_id`),
  KEY `FK_kelas_mahasiswa_mahasiswa` (`student_id`),
  CONSTRAINT `FK_kelas_mahasiswa_kelas` FOREIGN KEY (`class_id`) REFERENCES `kelas` (`id`),
  CONSTRAINT `FK_kelas_mahasiswa_mahasiswa` FOREIGN KEY (`student_id`) REFERENCES `mahasiswa` (`nrp`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table test.mahasiswa
CREATE TABLE IF NOT EXISTS `mahasiswa` (
  `nrp` varchar(14) NOT NULL,
  `nama` varchar(50) DEFAULT NULL,
  `angkatan` varchar(4) DEFAULT NULL,
  `card_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`nrp`),
  UNIQUE KEY `card_id` (`card_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table test.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table test.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
