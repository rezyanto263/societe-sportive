ALTER TABLE "matches" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "sports" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "venues" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "courts" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "payment_accounts" ADD COLUMN "deleted_at" timestamp;