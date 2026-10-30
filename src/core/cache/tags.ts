export const cacheTags = {
  sports: { list: 'sports:list' },
  venues: {
    stats: 'venues:stats',
    list: 'venues:list',
    detail: (id: string) => `venues:${id}`,
  },
} as const;
