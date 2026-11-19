import { ROLE } from '@/modules/auth/constants';
import { AuthSchema } from '@/modules/auth/schema';
import z from 'zod';

export class MembersSchema {
  static create = AuthSchema.signUp.extend({
    role: z.enum([ROLE.ORGANIZER, ROLE.PLAYER]),
  });
}
