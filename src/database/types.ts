import { courts, medias, sports, venues } from "@/database/schema";
import { Prettify } from "better-auth";

export type Sports = typeof sports.$inferSelect;
export type Courts = typeof courts.$inferSelect;
export type Venues = Prettify<typeof venues.$inferSelect & {sport: Sports; courts: Courts[]}>;
export type Medias = typeof medias.$inferSelect;