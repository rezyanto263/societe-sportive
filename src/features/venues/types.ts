import { VenuesSchema } from "@/features/venues/schema";
import z from "zod";

export type CreateVenueData = z.infer<typeof VenuesSchema.create>;
export type UpdateVenueData = z.infer<typeof VenuesSchema.update>;
export type DeleteVenueData = z.infer<typeof VenuesSchema.delete>;