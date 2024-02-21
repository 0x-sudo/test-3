CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`type` text,
	`target` text,
	`secret` text,
	`algorithm` text,
	`digits` integer,
	`period` integer,
	`charset` text,
	`expires_at` text
);
--> statement-breakpoint
/*
 SQLite does not support "Drop default from column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
CREATE UNIQUE INDEX `type_target_idx` ON `verification` (`target`,`type`);