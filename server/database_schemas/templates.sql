CREATE TABLE `templates` (
	`id` VARCHAR(255) NOT NULL DEFAULT '' COLLATE 'utf8mb4_general_ci',
	`creator_id` INT(11) NULL DEFAULT NULL,
	`name` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`notes` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`orientation` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`created` INT(11) NULL DEFAULT NULL,
	`edited` INT(11) NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;
