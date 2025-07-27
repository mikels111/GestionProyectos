CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET=utf8mb4;

START TRANSACTION;

ALTER DATABASE CHARACTER SET utf8mb4;

CREATE TABLE `Content` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Status_id` int NOT NULL,
    `text` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Creation_date` datetime(6) NOT NULL,
    CONSTRAINT `PK_Content` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Project` (
    `Id` int NOT NULL,
    `W_Environment_id` int NOT NULL,
    `Name` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Creation_date` datetime(6) NOT NULL,
    `Json_data` json NOT NULL,
    CONSTRAINT `PK_Project` PRIMARY KEY (`Id`, `W_Environment_id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Role` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Name` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_Role` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `User` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Mail` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Password` longtext CHARACTER SET utf8mb4 NULL,
    `Role` int NOT NULL,
    `Max_users` int NULL,
    `Type` longtext CHARACTER SET utf8mb4 NULL,
    `Is_verified` tinyint(1) NOT NULL,
    `Verification_code` longtext CHARACTER SET utf8mb4 NULL,
    `Code_expiration` datetime(6) NULL,
    `RefreshToken` longtext CHARACTER SET utf8mb4 NULL,
    `RefreshTokenExpiration` datetime(6) NULL,
    CONSTRAINT `PK_User` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `User_Project` (
    `User_Id` int NOT NULL,
    `Project_Id` int NOT NULL,
    `Creator_mail` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_User_Project` PRIMARY KEY (`User_Id`, `Project_Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `User_W_Environment` (
    `User_Id` int NOT NULL,
    `W_environment` int NOT NULL,
    `Rol_w_environment` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Creator_mail` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_User_W_Environment` PRIMARY KEY (`User_Id`, `W_environment`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Work_Environment` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Name` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Creation_date` datetime(6) NOT NULL,
    CONSTRAINT `PK_Work_Environment` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20250703133822_initial', '8.0.8');

COMMIT;

START TRANSACTION;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20250703135355_initial_1.0', '8.0.8');

COMMIT;

