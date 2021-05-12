CREATE DATABASE  IF NOT EXISTS `competiton_system_4_db` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `competiton_system_4_db`;
-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: competiton_system_4_db
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `deadline`
--

DROP TABLE IF EXISTS `deadline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deadline` (
  `deadline_id` int NOT NULL AUTO_INCREMENT,
  `deadline_timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`deadline_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deadline`
--

LOCK TABLES `deadline` WRITE;
/*!40000 ALTER TABLE `deadline` DISABLE KEYS */;
INSERT INTO `deadline` VALUES (1,'2021-05-12 01:55:30');
/*!40000 ALTER TABLE `deadline` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `file`
--

DROP TABLE IF EXISTS `file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file` (
  `file_id` int NOT NULL AUTO_INCREMENT,
  `cloudinary_file_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `cloudinary_url` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `original_filename` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `team_id` int NOT NULL,
  `created_by_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`file_id`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file`
--

LOCK TABLES `file` WRITE;
/*!40000 ALTER TABLE `file` DISABLE KEYS */;
/*!40000 ALTER TABLE `file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `institution`
--

DROP TABLE IF EXISTS `institution`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `institution` (
  `institution_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  PRIMARY KEY (`institution_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institution`
--

LOCK TABLES `institution` WRITE;
/*!40000 ALTER TABLE `institution` DISABLE KEYS */;
INSERT INTO `institution` VALUES (5,'NANYANG POLYTECHNIC'),(2,'NGEE ANN POLYTECHNIC'),(4,'REPUBLIC POLYTECHNIC'),(1,'SINGAPORE POLYTECHNIC'),(3,'TEMASEK POLYTECHNIC');
/*!40000 ALTER TABLE `institution` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `one_time_password`
--

DROP TABLE IF EXISTS `one_time_password`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `one_time_password` (
  `one_time_password_id` int NOT NULL AUTO_INCREMENT,
  `one_time_password` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `user_id_fk2` int NOT NULL,
  `number_of_attemps` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`one_time_password_id`),
  KEY `user_id_fk2_idx` (`user_id_fk2`),
  CONSTRAINT `user_id_fk2` FOREIGN KEY (`user_id_fk2`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `one_time_password`
--

LOCK TABLES `one_time_password` WRITE;
/*!40000 ALTER TABLE `one_time_password` DISABLE KEYS */;
INSERT INTO `one_time_password` VALUES (24,'429335',132,1,'2021-05-05 22:35:07'),(25,'570037',132,0,'2021-05-05 22:36:37'),(26,'201044',132,0,'2021-05-05 22:39:29'),(27,'606224',132,3,'2021-05-05 23:28:06'),(28,'928347',132,1,'2021-05-05 23:28:44'),(29,'138830',132,0,'2021-05-05 23:32:33'),(30,'332020',132,0,'2021-05-05 23:43:47'),(31,'92021',132,0,'2021-05-06 02:15:13'),(32,'198198',132,0,'2021-05-06 02:17:12'),(33,'545840',132,2,'2021-05-06 02:19:03'),(34,'219208',132,0,'2021-05-06 02:19:03'),(35,'548419',132,0,'2021-05-06 02:19:55'),(36,'26951',132,0,'2021-05-06 02:31:29'),(37,'860862',132,0,'2021-05-06 02:37:00'),(38,'796319',132,0,'2021-05-06 02:42:55'),(39,'501893',132,0,'2021-05-06 02:52:27'),(40,'857653',132,0,'2021-05-06 03:05:36'),(41,'970301',132,0,'2021-05-06 03:13:32'),(42,'984604',132,0,'2021-05-06 03:17:53'),(43,'127531',132,3,'2021-05-06 03:25:33'),(44,'282743',132,0,'2021-05-06 03:26:32'),(45,'946541',132,0,'2021-05-06 03:37:36'),(46,'258642',132,0,'2021-05-07 04:13:31'),(47,'434891',132,0,'2021-05-07 04:17:32'),(48,'302600',132,0,'2021-05-06 17:37:11'),(49,'875578',132,0,'2021-05-08 03:25:03'),(50,'858866',132,0,'2021-05-08 19:31:54'),(51,'144342',132,0,'2021-05-08 19:34:04'),(52,'782010',132,0,'2021-05-08 19:39:50'),(53,'579811',132,0,'2021-05-08 19:56:10'),(54,'660267',132,3,'2021-05-08 20:26:58'),(55,'172758',132,3,'2021-05-08 20:34:36');
/*!40000 ALTER TABLE `one_time_password` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'admin'),(3,'master_admin'),(2,'user');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team` (
  `team_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `created_by_id` int NOT NULL,
  `created_at` timestamp NOT NULL,
  `pending_proposals` varchar(45) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT '0',
  PRIMARY KEY (`team_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team`
--

LOCK TABLES `team` WRITE;
/*!40000 ALTER TABLE `team` DISABLE KEYS */;
INSERT INTO `team` VALUES (101,'DAZZEL TEAM B',100,'2000-02-10 16:00:00','1'),(102,'OZ TEAM A',102,'2000-02-10 16:00:00','0'),(103,'OZ TEAM B',102,'2000-02-10 16:00:00','3'),(104,'FRIZ TEAM A',106,'2000-02-10 16:00:00','0');
/*!40000 ALTER TABLE `team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_invite_list`
--

DROP TABLE IF EXISTS `team_invite_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_invite_list` (
  `team_invite_list_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `team_id` int NOT NULL,
  `created_by_id` int NOT NULL,
  `join_status` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`team_invite_list_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_invite_list`
--

LOCK TABLES `team_invite_list` WRITE;
/*!40000 ALTER TABLE `team_invite_list` DISABLE KEYS */;
INSERT INTO `team_invite_list` VALUES (1,'emayeo@abc.com',100,100,0,'2020-02-20 16:00:00'),(2,'brendafenris@abc.com',100,100,0,'2020-02-20 16:00:00'),(3,'maytang@abc.com',100,100,0,'2020-02-20 16:00:00'),(4,'edwardlim@abc.com',102,102,0,'2020-02-20 16:00:00'),(5,'susankakis@abc.com',102,102,0,'2020-02-20 16:00:00'),(6,'vrozraj@abc.com',102,102,0,'2020-02-20 16:00:00'),(7,'tadpol@abc.com',104,106,0,'2020-02-20 16:00:00'),(8,'maryguo@abc.com',104,106,0,'2020-02-20 16:00:00'),(9,'bingguo@abc.com',104,106,0,'2020-02-20 16:00:00');
/*!40000 ALTER TABLE `team_invite_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_member`
--

DROP TABLE IF EXISTS `team_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_member` (
  `team_member_id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NOT NULL,
  `team_id` int NOT NULL,
  `leader` tinyint(1) NOT NULL,
  `created_by_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`team_member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_member`
--

LOCK TABLES `team_member` WRITE;
/*!40000 ALTER TABLE `team_member` DISABLE KEYS */;
INSERT INTO `team_member` VALUES (5,100,101,1,100,'2021-05-03 03:10:09'),(6,102,102,1,102,'2021-05-03 03:10:09'),(7,102,103,1,102,'2021-05-03 03:10:09'),(8,106,104,1,106,'2021-05-03 03:10:09'),(9,100,104,0,100,'2021-05-03 03:10:09');
/*!40000 ALTER TABLE `team_member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `user_password` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT NULL,
  `user_password_histories` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT NULL,
  `user_password_timestamp` timestamp NULL DEFAULT NULL,
  `number_of_login_attempts` int DEFAULT '0',
  `role_id` int NOT NULL,
  `institution_id` int NOT NULL,
  `status` varchar(50) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `is_verified` varchar(45) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT 'false',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_logout` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (101,'Ray','Davidson','raydavidson@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,2,1,'pending','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(102,'Oz','Kennedy','ozkennedy@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,2,1,'approved','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(103,'Ema','Tan','ematan@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,2,1,'pending','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(104,'Jane','Lim','janelim@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,2,1,'pending','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(105,'Arin','Ash','arinash@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,2,1,'approved','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(106,'Fiz','Erricson','fizerricson@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,2,1,'approved','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(107,'Bob','Song','bobsong@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,3,0,'approved','false','2021-05-03 03:10:09','2021-05-11 17:18:09','2021-05-12 15:38:25'),(108,'Aramis','Guo','aramisguo@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,2,0,'pending','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(109,'Tad','Pol','tadpol@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,2,0,'approved','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(110,'Mary','Guo','maryguo@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,2,0,'approved','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(111,'Bing','Guo','bingguo@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,2,0,'approved','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(112,'Miku1','Miku','mikumiku1@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,2,0,'approved','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(113,'Miku2','Miku','mikumiku2@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,2,0,'approved','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(114,'Miku3','Miku','mikumiku3@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,2,0,'approved','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(115,'Dini1','May','dinimay1@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,2,0,'approved','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(116,'Dini2','May','dinimay2@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,2,0,'approved','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(117,'Dini3','May','dinimay3@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,2,0,'approved','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(118,'Rita1','Khan','ritakhan1@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,2,0,'approved','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(119,'Rita2','Khan','ritakhan2@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,2,0,'approved','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(120,'Rita3','Khan','ritakhan3@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,2,0,'approved','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(121,'Mickey1','Mouse1','mickeymouse@abc.com','$2a$10$zlWpZk2E7d7uIgxW/KhAsu6RN5jgwaYOnDzQTUNE0T/0quXmMyJ/y',NULL,NULL,0,2,0,'approved','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(122,'Mickey2','Mouse2','mickeymouse2@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,2,0,'approved','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(123,'Mickey3','Mouse3','mickeymouse3@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,NULL,0,2,0,'approved','false','2021-05-03 03:10:09','2021-05-11 03:31:09','2021-05-12 15:38:25'),(132,'Chai','Pin Zheng','chaipinzheng@gmail.com','$2a$10$1NMeZxUmS9xtNbBfDZon1eeradr46pk5nJwJ1duvU1DSEZ57ZeKaq','$2a$10$KuJq9809jHSzBjN5dY/Y6OCdQAz6y6h6RPmcjVxbwYeVxIfZXyYii«','2021-05-09 07:43:02',5,2,1,'approved','1','2021-05-03 03:37:45','2021-05-11 03:31:09','2021-05-12 15:38:25'),(133,'Chai','Pin Zhengs','chaipinzhengs@gmail.com','123',NULL,'2021-05-06 14:20:55',0,2,2,'pending','1','2021-05-04 06:57:30','2021-05-11 03:31:09','2021-05-12 15:38:25'),(134,'SHARON','TAN','mchanjh.20@ichat.sp.edu.sg','$2a$10$3XnTiYSEjzQu15BnLvh7luLgI6CMb/L94MuMWGr4JE1l6l/ToFYVe',NULL,NULL,0,2,1,'pending','false','2021-05-08 05:34:41','2021-05-11 03:31:09','2021-05-12 15:38:25');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_temp`
--

DROP TABLE IF EXISTS `user_temp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_temp` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `accepted` int NOT NULL DEFAULT '0',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_temp`
--

LOCK TABLES `user_temp` WRITE;
/*!40000 ALTER TABLE `user_temp` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_temp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'competiton_system_4_db'
--

--
-- Dumping routines for database 'competiton_system_4_db'
--
/*!50003 DROP FUNCTION IF EXISTS `f_countNumberOfMembers` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `f_countNumberOfMembers`(
    teamId INT
) RETURNS tinyint
    DETERMINISTIC
BEGIN
  SET @nunmberOfMembers = 0;
  SELECT COUNT(team_id) INTO @numberOfMembers FROM team_member WHERE team_member.team_id=teamId;
  RETURN @numberOfMembers;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `f_countNumberOfSubmissions` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `f_countNumberOfSubmissions`(
    teamId INT
) RETURNS tinyint
    DETERMINISTIC
BEGIN
  SET @numberOfSubmissions = 0;
  SELECT COUNT(team_id) INTO @numberOfSubmissions FROM file WHERE file.team_id=teamId;
  RETURN @numberOfSubmissions;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_createTeamInviteList` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_createTeamInviteList`(IN email varchar(255), IN teamId int, IN createdById int)
BEGIN

INSERT INTO team_invite_list
(email,team_id,created_by_id,join_status,created_at) VALUES
(email,teamId,createdById,false,now());



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_createTeamInviteListAndGetNewTeamInviteList` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_createTeamInviteListAndGetNewTeamInviteList`(IN email varchar(255), IN teamId int, IN createdById int)
BEGIN
START TRANSACTION;
INSERT INTO team_invite_list
(email,team_id,created_by_id,join_status,created_at) VALUES
(email,teamId,createdById,false,now());
DELETE FROM team_invite_list WHERE team_id=0;
SELECT team_invite_list_id id, email, 
                team_id teamId, join_status joinStatus, created_at createdAt FROM
                    team_invite_list WHERE team_id=teamId GROUP BY team_id;


END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_createTeamMember` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_createTeamMember`(IN userId INT, IN teamId int)
BEGIN

START TRANSACTION;



DELETE FROM team_invite_list WHERE email=(SELECT email FROM user WHERE user_id=userId);

INSERT INTO team_member(team_id, member_id, leader, created_by_id, created_at) 
    VALUES (teamId,userId,0,userId, NOW());

      

COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_deleteTeamInviteListAndGetNewTeamInviteList` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_deleteTeamInviteListAndGetNewTeamInviteList`(IN recordId int)
BEGIN


DECLARE teamId INT DEFAULT 0;

SELECT DISTINCT(team_id )
INTO teamId
FROM team_invite_list WHERE team_invite_list_id=recordId;

DELETE FROM team_invite_list WHERE team_invite_list_id=recordId;
SELECT team_invite_list_id id, email, 
                team_id teamId, join_status joinStatus, created_at createdAt FROM
                    team_invite_list WHERE team_id=teamId;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_getAllTeams` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getAllTeams`()
BEGIN
SELECT *, f_countNumberOfSubmissions(team_id) number_of_submissions, 
f_countNumberOfMembers(team.team_id) number_of_members from team;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_getTeamInviteListByTeamId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getTeamInviteListByTeamId`(IN teamId int)
BEGIN
SELECT team_invite_list_id id, email, 
                team_id teamId, join_status joinStatus, created_at createdAt FROM
                    team_invite_list WHERE team_id=teamId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_getTeamsByTeamMemberId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getTeamsByTeamMemberId`(IN teamMemberId INT)
BEGIN
SELECT *, f_countNumberOfMembers(team_member.team_id) numOfMembers from team INNER JOIN team_member ON team_member.team_id=team.team_id 
WHERE team_member.member_id =teamMemberId ;


END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-12 23:49:46
