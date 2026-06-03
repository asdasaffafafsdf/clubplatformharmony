

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
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of check_ins
-- ----------------------------
INSERT INTO `check_ins` VALUES (8, 8, 8, '2026-04-14 19:56:02', 1);
INSERT INTO `check_ins` VALUES (9, 8, 9, '2026-04-14 19:56:28', 1);
INSERT INTO `check_ins` VALUES (10, 11, 10, '2026-04-18 11:24:54', 1);
INSERT INTO `check_ins` VALUES (11, 12, 10, '2026-04-18 11:26:31', 1);
INSERT INTO `check_ins` VALUES (12, 13, 10, '2026-04-18 11:29:54', 1);

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
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of clubs
-- ----------------------------
INSERT INTO `clubs` VALUES (4, '数学社团', '学习数学的好地方', '2026-04-14 15:41:57');
INSERT INTO `clubs` VALUES (5, '123', '123', '2026-04-18 10:47:59');

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
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of event_signups
-- ----------------------------
INSERT INTO `event_signups` VALUES (10, 8, 9, '2026-04-14 19:55:40');
INSERT INTO `event_signups` VALUES (11, 8, 8, '2026-04-14 19:55:57');
INSERT INTO `event_signups` VALUES (12, 9, 9, '2026-04-14 19:56:31');
INSERT INTO `event_signups` VALUES (13, 10, 8, '2026-04-14 20:00:20');
INSERT INTO `event_signups` VALUES (14, 11, 10, '2026-04-18 11:22:52');
INSERT INTO `event_signups` VALUES (15, 12, 10, '2026-04-18 11:26:11');
INSERT INTO `event_signups` VALUES (16, 13, 10, '2026-04-18 11:29:51');

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
  `club_id` int NOT NULL DEFAULT 1 COMMENT '4',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of events
-- ----------------------------
INSERT INTO `events` VALUES (8, 'ces', 'ces', '2026-04-14 19:54:00', '2026-05-14 02:54:00', 'ces', 'published', '2026-04-14 19:55:01', 4);
INSERT INTO `events` VALUES (9, '222', '222', '2026-04-14 19:55:00', '2026-09-14 19:55:00', '222', 'published', '2026-04-14 19:55:30', 4);
INSERT INTO `events` VALUES (10, '123', '123', '2026-04-14 19:59:00', '2026-04-14 19:59:00', '123', 'draft', '2026-04-14 20:00:00', 4);
INSERT INTO `events` VALUES (11, '123cs', '123cs', '2026-04-18 11:11:00', '2026-05-18 11:11:00', '123cs', 'published', '2026-04-18 11:15:55', 5);
INSERT INTO `events` VALUES (12, '789', '789', '2026-04-18 11:25:00', '2026-06-18 11:25:00', '789', 'published', '2026-04-18 11:25:38', 5);
INSERT INTO `events` VALUES (13, '8', '8', '2026-04-18 11:29:00', '2026-04-18 11:29:00', '8', 'published', '2026-04-18 11:29:33', 5);

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
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of members
-- ----------------------------
INSERT INTO `members` VALUES (8, 4, '88', '88', '88', 'admin', '2026-04-14 19:44:27');
INSERT INTO `members` VALUES (9, 4, '99', '99', '99', 'member', '2026-04-14 19:54:27');
INSERT INTO `members` VALUES (10, 5, '233', '233', '233', 'member', '2026-04-18 10:49:42');
INSERT INTO `members` VALUES (12, 4, '233', '2333', '123456', 'member', '2026-04-18 11:54:54');
INSERT INTO `members` VALUES (14, 4, '6', '6', '6', 'member', '2026-04-25 11:13:09');
INSERT INTO `members` VALUES (15, 4, '7', '7', '7', 'member', '2026-04-25 11:13:14');

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
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, '233', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2026-04-09 20:34:06');
INSERT INTO `users` VALUES (4, '1', '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', '2026-04-25 11:01:30');

SET FOREIGN_KEY_CHECKS = 1;
