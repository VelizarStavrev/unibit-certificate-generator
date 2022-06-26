CREATE TABLE `field_attributes` (
	`field_id` VARCHAR(255) NOT NULL DEFAULT '0' COLLATE 'utf8mb4_general_ci',
	`name` VARCHAR(255) NOT NULL DEFAULT '0' COLLATE 'utf8mb4_general_ci',
	`label` VARCHAR(255) NOT NULL DEFAULT '0' COLLATE 'utf8mb4_general_ci',
	`value` VARCHAR(255) NOT NULL DEFAULT '0' COLLATE 'utf8mb4_general_ci',
	`type` VARCHAR(255) NOT NULL DEFAULT '0' COLLATE 'utf8mb4_general_ci',
	`unit` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`units` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`options` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	PRIMARY KEY (`field_id`, `name`) USING BTREE,
	CONSTRAINT `field_id` FOREIGN KEY (`field_id`) REFERENCES `certificates_db`.`fields` (`id`) ON UPDATE RESTRICT ON DELETE CASCADE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;
