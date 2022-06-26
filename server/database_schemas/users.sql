CREATE TABLE `users` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`role` INT(11) NOT NULL,
	`email` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`username` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`password` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`created` INT(11) NOT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `email` (`email`) USING BTREE,
	UNIQUE INDEX `username` (`username`) USING BTREE,
	INDEX `roleKey` (`role`) USING BTREE,
	CONSTRAINT `roleKey` FOREIGN KEY (`role`) REFERENCES `certificates_db`.`roles` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COMMENT='This is where we keep all of the users'
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=0
;
