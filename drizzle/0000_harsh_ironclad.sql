CREATE TABLE `todos` (
	`id` integer PRIMARY KEY NOT NULL,
	`content` text,
	`done` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `todos_id_unique` ON `todos` (`id`);