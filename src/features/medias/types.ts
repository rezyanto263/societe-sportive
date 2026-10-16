import { MediasSchema } from "@/features/medias/schema";
import z from "zod";

export type CreateMediaData = z.infer<typeof MediasSchema.create>;