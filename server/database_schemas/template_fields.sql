CREATE TABLE `fields` (
	`id` VARCHAR(255) NOT NULL DEFAULT '' COLLATE 'utf8mb4_general_ci',
	`template_id` VARCHAR(255) NOT NULL DEFAULT '' COLLATE 'utf8mb4_general_ci',
	`type` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf8mb4_general_ci',
	PRIMARY KEY (`id`, `template_id`) USING BTREE,
	INDEX `template_id` (`template_id`) USING BTREE,
	CONSTRAINT `template_id` FOREIGN KEY (`template_id`) REFERENCES `certificates_db`.`templates` (`id`) ON UPDATE RESTRICT ON DELETE CASCADE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;
