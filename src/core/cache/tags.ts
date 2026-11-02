export const cacheTags = {
  sports: { list: 'sports:list' },
  venues: {
    stats: 'venues:stats',
    list: 'venues:list',
    detail: (id: string) => `venues:${id}`,
  },
  paymentAccounts: {
    list: 'payment-accounts:list',
    detail: (id: string) => `payment-accounts:${id}`,
  },
} as const;
