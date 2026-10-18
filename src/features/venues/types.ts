import { VenuesSchema } from "@/features/venues/schema";
import z from "zod";

export type CreateVenueData = z.infer<typeof VenuesSchema.create>;
export type UpdateVenueData = z.infer<typeof VenuesSchema.update>;
export type DeleteVenueData = z.infer<typeof VenuesSchema.delete>;
export type CreateCourtData = z.infer<typeof VenuesSchema.createCourt>;
export type DeleteCourtData = z.infer<typeof VenuesSchema.deleteCourt>;
export type SyncPhotoData = z.infer<typeof VenuesSchema.syncPhoto>;
export type DeletePhotoData = z.infer<typeof VenuesSchema.deletePhoto>;