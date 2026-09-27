import { defineRelations } from 'drizzle-orm';
import * as schema from '@/database/schema';

export const relations = defineRelations(schema, (r) => ({
  users: {
    sessions: r.many.sessions(),
    accounts: r.many.accounts(),
  },

  sessions: {
    user: r.one.users({
      from: r.sessions.userId,
      to: r.users.id,
    }),
  },

  accounts: {
    user: r.one.users({
      from: r.accounts.userId,
      to: r.users.id,
    }),
  },

  venues: {
    courts: r.many.courts(),
  },

  courts: {
    venue: r.one.venues({
      from: r.courts.venueId,
      to: r.venues.id,
    }),
    matches: r.many.matches({
      from: r.courts.id.through(r.matchCourts.courtId),
      to: r.matches.id.through(r.matchCourts.matchId),
    }),
  },

  paymentAccounts: {
    matches: r.many.matches({
      from: r.paymentAccounts.id.through(
        r.matchPaymentAccounts.paymentAccountId,
      ),
      to: r.matches.id.through(r.matchPaymentAccounts.matchId),
    }),
  },

  sports: {
    matches: r.many.matches(),
  },

  matches: {
    sport: r.one.sports({
      from: r.matches.sportId,
      to: r.sports.id,
    }),
    courts: r.many.courts({
      from: r.matches.id.through(r.matchCourts.matchId),
      to: r.courts.id.through(r.matchCourts.courtId),
    }),
    paymentAccounts: r.many.paymentAccounts({
      from: r.matches.id.through(r.matchPaymentAccounts.matchId),
      to: r.paymentAccounts.id.through(r.matchPaymentAccounts.paymentAccountId),
    }),
  },
}));

export default relations;
