export const AD_CATEGORIES = [
  'for-sale',
  'housing',
  'services',
  'events',
  'jobs',
] as const;


export type AdCategory = (typeof AD_CATEGORIES)[number];

export const AD_CATEGORY_LABELS: Record<AdCategory, string> = {
  'for-sale': 'For Sale',
  housing: 'Housing',
  services: 'Services',
  events: 'Events',
  jobs: 'Jobs',
};


export interface AdLocation {
  lat: number;
  lng: number;
  address?: string;
}



export interface Ad {
  id: string;
  title: string;
  description: string;
  category: AdCategory;
  price?: number;
  location?: AdLocation;
  imageUrl?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdInput {
  title: string;
  description: string;
  category: AdCategory;
  price?: number;
  location?: AdLocation;
  imageUrl?: string | null;
}


export interface AdFilters {
  search?: string;
  category?: AdCategory;
  lat?: number;
  lng?: number;
  radiusKm?: number;
}

export type UpdateAdInput = Partial<CreateAdInput>;
