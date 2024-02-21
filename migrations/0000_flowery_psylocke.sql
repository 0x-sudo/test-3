CREATE TABLE `password` (
	`hash` text,
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`username` text NOT NULL,
	`name` text,
	`created_at` text,
	`updated_at` text
);
--> statement-breakpoint
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
CREATE UNIQUE INDEX `password_user_id_unique` ON `password` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `type_target_idx` ON `verification` (`target`,`type`);