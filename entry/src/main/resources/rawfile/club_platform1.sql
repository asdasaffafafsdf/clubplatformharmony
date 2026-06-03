/*
 Navicat Premium Dump SQL

 Source Server         : 阿里云-mysql
 Source Server Type    : MySQL
 Source Server Version : 80045 (8.0.45-0ubuntu0.24.04.1)
 Source Host           : 120.26.187.7:3306
 Source Schema         : club_platform1

 Target Server Type    : MySQL
 Target Server Version : 80045 (8.0.45-0ubuntu0.24.04.1)
 File Encoding         : 65001

 Date: 10/04/2026 08:56:53
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for check_ins
-- ----------------------------
DROP TABLE IF EXISTS `check_ins`;
CREATE TABLE `check_ins`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `member_id` int NOT NULL,
  `check_in_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_event_member_checkin`(`event_id` ASC, `member_id` ASC) USING BTREE,
  INDEX `member_id`(`member_id` ASC) USING BTREE,
  CONSTRAINT `check_ins_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `check_ins_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of check_ins
-- ----------------------------
INSERT INTO `check_ins` VALUES (1, 1, 1, '2026-04-09 21:28:28', 1);
INSERT INTO `check_ins` VALUES (2, 1, 2, '2026-04-09 21:29:12', 1);

-- ----------------------------
-- Table structure for clubs
-- ----------------------------
DROP TABLE IF EXISTS `clubs`;
CREATE TABLE `clubs`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of clubs
-- ----------------------------
INSERT INTO `clubs` VALUES (1, '123', '123', '2026-04-09 21:24:04');

-- ----------------------------
-- Table structure for event_signups
-- ----------------------------
DROP TABLE IF EXISTS `event_signups`;
CREATE TABLE `event_signups`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `member_id` int NOT NULL,
  `sign_up_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_event_member`(`event_id` ASC, `member_id` ASC) USING BTREE,
  INDEX `member_id`(`member_id` ASC) USING BTREE,
  CONSTRAINT `event_signups_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `event_signups_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of event_signups
-- ----------------------------
INSERT INTO `event_signups` VALUES (1, 1, 1, '2026-04-09 21:28:20');
INSERT INTO `event_signups` VALUES (2, 1, 2, '2026-04-09 21:29:05');

-- ----------------------------
-- Table structure for events
-- ----------------------------
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `location` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `status` enum('draft','published','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of events
-- ----------------------------
INSERT INTO `events` VALUES (1, '789', '789', '2026-04-17 21:26:01', '2026-04-01 21:26:06', '789', 'draft', '2026-04-09 21:26:20');

-- ----------------------------
-- Table structure for members
-- ----------------------------
DROP TABLE IF EXISTS `members`;
CREATE TABLE `members`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `club_id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'member',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_student_club`(`student_id` ASC, `club_id` ASC) USING BTREE,
  INDEX `club_id`(`club_id` ASC) USING BTREE,
  CONSTRAINT `members_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of members
-- ----------------------------
INSERT INTO `members` VALUES (1, 1, 'qwe', '123', '123', 'member', '2026-04-09 21:24:25');
INSERT INTO `members` VALUES (2, 1, '456', '456', '456', 'admin', '2026-04-09 21:28:42');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, '233', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2026-04-09 20:34:06');

SET FOREIGN_KEY_CHECKS = 1;
