import { MediasSchema } from '@/modules/medias/schema';
import z from 'zod';

export type CreateMediaData = z.infer<typeof MediasSchema.create>;
