import { MembersSchema } from '@/modules/members/schema';
import z from 'zod';

export type CreateMemberData = z.infer<typeof MembersSchema.create>;
