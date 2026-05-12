CREATE TYPE "public"."habit_status" AS ENUM('completed', 'skipped', 'failed');--> statement-breakpoint
ALTER TABLE "habit_completions" ALTER COLUMN "status" SET DEFAULT 'completed'::"public"."habit_status";--> statement-breakpoint
ALTER TABLE "habit_completions" ALTER COLUMN "status" SET DATA TYPE "public"."habit_status" USING "status"::"public"."habit_status";--> statement-breakpoint
ALTER TABLE "habit_completions" DROP COLUMN "completed";