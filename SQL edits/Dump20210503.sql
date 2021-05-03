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
-- Table structure for table `file`
--

DROP TABLE IF EXISTS `file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file` (
  `file_id` int NOT NULL AUTO_INCREMENT,
  `cloudinary_file_id` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `cloudinary_url` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `original_filename` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `team_id` int NOT NULL,
  `created_by_id` int DEFAULT NULL,
  PRIMARY KEY (`file_id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
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
  `name` varchar(255) COLLATE latin1_general_ci NOT NULL,
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
  `one_time_password` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `user_id_fk2` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`one_time_password_id`),
  KEY `user_id_fk2_idx` (`user_id_fk2`),
  CONSTRAINT `user_id_fk2` FOREIGN KEY (`user_id_fk2`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `one_time_password`
--

LOCK TABLES `one_time_password` WRITE;
/*!40000 ALTER TABLE `one_time_password` DISABLE KEYS */;
INSERT INTO `one_time_password` VALUES (2,'752935',132,'2021-05-03 03:38:25'),(3,'473877',132,'2021-05-03 03:46:02');
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
  `role_name` varchar(255) COLLATE latin1_general_ci NOT NULL,
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
  `name` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `created_by_id` int NOT NULL,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`team_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team`
--

LOCK TABLES `team` WRITE;
/*!40000 ALTER TABLE `team` DISABLE KEYS */;
INSERT INTO `team` VALUES (100,'DAZZEL TEAM A',100,'2000-02-10 16:00:00'),(101,'DAZZEL TEAM B',100,'2000-02-10 16:00:00'),(102,'OZ TEAM A',102,'2000-02-10 16:00:00'),(103,'OZ TEAM B',102,'2000-02-10 16:00:00'),(104,'FRIZ TEAM A',106,'2000-02-10 16:00:00');
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
  `email` varchar(100) COLLATE latin1_general_ci NOT NULL,
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
INSERT INTO `team_member` VALUES (1,100,100,1,100,'2021-05-03 03:10:09'),(2,112,100,0,112,'2021-05-03 03:10:09'),(3,113,100,0,113,'2021-05-03 03:10:09'),(4,114,100,0,114,'2021-05-03 03:10:09'),(5,100,101,1,100,'2021-05-03 03:10:09'),(6,102,102,1,102,'2021-05-03 03:10:09'),(7,102,103,1,102,'2021-05-03 03:10:09'),(8,106,104,1,106,'2021-05-03 03:10:09'),(9,100,104,0,100,'2021-05-03 03:10:09');
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
  `first_name` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `last_name` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `email` varchar(100) COLLATE latin1_general_ci NOT NULL,
  `user_password` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `old_user_password` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `role_id` int NOT NULL,
  `institution_id` int NOT NULL,
  `status` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_verified` varchar(45) COLLATE latin1_general_ci DEFAULT 'false',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (100,'Dazzel','Neo','dazzelneo@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,1,'approved','2021-05-03 03:10:09','false'),(101,'Ray','Davidson','raydavidson@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,1,'pending','2021-05-03 03:10:09','false'),(102,'Oz','Kennedy','ozkennedy@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,1,'approved','2021-05-03 03:10:09','false'),(103,'Ema','Tan','ematan@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,1,'pending','2021-05-03 03:10:09','false'),(104,'Jane','Lim','janelim@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,1,'pending','2021-05-03 03:10:09','false'),(105,'Arin','Ash','arinash@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,1,'approved','2021-05-03 03:10:09','false'),(106,'Fiz','Erricson','fizerricson@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,1,'approved','2021-05-03 03:10:09','false'),(107,'Bob','Song','bobsong@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,3,0,'approved','2021-05-03 03:10:09','false'),(108,'Aramis','Guo','aramisguo@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,0,'pending','2021-05-03 03:10:09','false'),(109,'Tad','Pol','tadpol@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,0,'approved','2021-05-03 03:10:09','false'),(110,'Mary','Guo','maryguo@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,0,'approved','2021-05-03 03:10:09','false'),(111,'Bing','Guo','bingguo@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,0,'approved','2021-05-03 03:10:09','false'),(112,'Miku1','Miku','mikumiku1@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,0,'approved','2021-05-03 03:10:09','false'),(113,'Miku2','Miku','mikumiku2@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,0,'approved','2021-05-03 03:10:09','false'),(114,'Miku3','Miku','mikumiku3@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,0,'approved','2021-05-03 03:10:09','false'),(115,'Dini1','May','dinimay1@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,0,'approved','2021-05-03 03:10:09','false'),(116,'Dini2','May','dinimay2@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,0,'approved','2021-05-03 03:10:09','false'),(117,'Dini3','May','dinimay3@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,0,'approved','2021-05-03 03:10:09','false'),(118,'Rita1','Khan','ritakhan1@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,0,'approved','2021-05-03 03:10:09','false'),(119,'Rita2','Khan','ritakhan2@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,0,'approved','2021-05-03 03:10:09','false'),(120,'Rita3','Khan','ritakhan3@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,0,'approved','2021-05-03 03:10:09','false'),(121,'Mickey1','Mouse1','mickeymouse@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,0,'approved','2021-05-03 03:10:09','false'),(122,'Mickey2','Mouse2','mickeymouse2@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,0,'approved','2021-05-03 03:10:09','false'),(123,'Mickey3','Mouse3','mickeymouse3@abc.com','$2b$10$YYYqi5.Ig8W01/vZlliYzuiq7icgeOsqvLzESuViMVPhsjF2x9h/u',NULL,2,0,'approved','2021-05-03 03:10:09','false'),(132,'Chai','Pin Zheng','chaipinzheng@gmail.com','$2a$10$wOHreW2vgEhjYeVahsGr7.sJEtwnBTPrs6Ep99VFAANiRoSuGnzkC',NULL,2,1,'approved','2021-05-03 03:37:45','1');
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_temp`
--

LOCK TABLES `user_temp` WRITE;
/*!40000 ALTER TABLE `user_temp` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_temp` ENABLE KEYS */;
UNLOCK TABLES;

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
-- 1. start a new transaction
START TRANSACTION;


-- 2. Delete team_invite_list record
DELETE FROM team_invite_list WHERE email=(SELECT email FROM user WHERE user_id=userId);
-- 3. Insert team_member record
INSERT INTO team_member(team_id, member_id, leader, created_by_id, created_at) 
    VALUES (teamId,userId,0,userId, NOW());

      
-- 4. commit changes    
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

-- Dump completed on 2021-05-03 12:10:52
