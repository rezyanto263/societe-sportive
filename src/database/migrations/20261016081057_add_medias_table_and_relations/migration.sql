CREATE TYPE "media_resource_type" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "media_status" AS ENUM('pending', 'attached');--> statement-breakpoint
CREATE TABLE "venue_medias" (
	"venue_id" uuid NOT NULL,
	"media_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"public_id" text NOT NULL,
	"url" text NOT NULL,
	"resource_type" "media_resource_type" NOT NULL,
	"status" "media_status" DEFAULT 'pending'::"media_status",
	"deleted_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payment_accounts" RENAME COLUMN "image_url" TO "image_id";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar_id" uuid;--> statement-breakpoint
ALTER TABLE "venues" ADD COLUMN "thumbnail_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "courts" ADD COLUMN "thumbnail_id" uuid;--> statement-breakpoint
ALTER TABLE "payment_accounts" ALTER COLUMN "image_id" SET DATA TYPE uuid USING "image_id"::uuid;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_medias_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "medias"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "venues" ADD CONSTRAINT "venues_thumbnail_id_medias_id_fkey" FOREIGN KEY ("thumbnail_id") REFERENCES "medias"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "courts" ADD CONSTRAINT "courts_thumbnail_id_medias_id_fkey" FOREIGN KEY ("thumbnail_id") REFERENCES "medias"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "venue_medias" ADD CONSTRAINT "venue_medias_venue_id_venues_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "venue_medias" ADD CONSTRAINT "venue_medias_media_id_medias_id_fkey" FOREIGN KEY ("media_id") REFERENCES "medias"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "payment_accounts" ADD CONSTRAINT "payment_accounts_image_id_medias_id_fkey" FOREIGN KEY ("image_id") REFERENCES "medias"("id") ON DELETE SET NULL;