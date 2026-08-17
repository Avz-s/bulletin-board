export const AD_CATEGORIES = [
  'for-sale',
  'housing',
  'services',
  'events',
  'jobs',
] as const;

// export type AdCategory = 'for-sale' | 'housing' | 'services' | 'events' | 'jobs';

export type AdCategory = (typeof AD_CATEGORIES)[number];
