import { courts, venues } from "@/database/schema";
import { Sports } from "@/types/sport";
import { Prettify } from "better-auth";

export type Courts = typeof courts.$inferSelect;

export type Venues = Prettify<typeof venues.$inferSelect & {sport: Sports; courts: Courts[]}>;