CREATE TYPE "payment_account_types" AS ENUM('bank', 'qris', 'e-wallet');--> statement-breakpoint
CREATE TABLE "matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"sport_id" uuid NOT NULL,
	"name" text NOT NULL,
	"date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"fee" numeric(12,2) NOT NULL,
	"venue_id" uuid NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "match_courts" (
	"match_id" uuid NOT NULL,
	"court_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "match_payment_accounts" (
	"match_id" uuid NOT NULL,
	"payment_account_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "venues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"sport_id" uuid NOT NULL,
	"name" text NOT NULL,
	"phone_number" text NOT NULL,
	"google_maps_url" text NOT NULL,
	"address" text NOT NULL,
	"city" text,
	"facilities" text[],
	"notes" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"venue_id" uuid NOT NULL,
	"name" text NOT NULL,
	"specifications" text[],
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"type" "payment_account_types" NOT NULL,
	"provider_name" text NOT NULL,
	"account_number" text,
	"account_holder_name" text NOT NULL,
	"image_url" text,
	"bookmark" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_sport_id_sports_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "sports"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_venue_id_venues_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id");--> statement-breakpoint
ALTER TABLE "match_courts" ADD CONSTRAINT "match_courts_match_id_matches_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "match_courts" ADD CONSTRAINT "match_courts_court_id_courts_id_fkey" FOREIGN KEY ("court_id") REFERENCES "courts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "match_payment_accounts" ADD CONSTRAINT "match_payment_accounts_match_id_matches_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "match_payment_accounts" ADD CONSTRAINT "match_payment_accounts_lurimNV5LiFC_fkey" FOREIGN KEY ("payment_account_id") REFERENCES "payment_accounts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "venues" ADD CONSTRAINT "venues_sport_id_sports_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "sports"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "courts" ADD CONSTRAINT "courts_venue_id_venues_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE CASCADE;