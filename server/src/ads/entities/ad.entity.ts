import { AdCategory } from '../categories';


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
