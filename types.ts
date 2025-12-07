export interface MarketplaceItem {
  id: number;
  title: string;
  price: number;
  seller: string;
  image: string;
  rating: string;
  desc: string;
  category: string;
  style: string;
  material: string;
}

export interface NewsArticle {
  title: string;
  content: string;
  stat: string;
  source: string;
}

export interface ScanResult {
  brand: string;
  origin: string;
  material: string;
  risk: number;
  date: string;
}

export type UserRole = 'Guest' | 'User' | null;
export type SubscriptionTier = 'Free' | 'Needles';

export interface UserState {
  role: UserRole;
  subscription: SubscriptionTier;
  accessibilityMode: boolean;
  scanHistory: ScanResult[];
  styles: string[];
  guestScans: number;
}