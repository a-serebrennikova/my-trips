export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  homeCity: string;
};

export type AuthorInfo = {
  id: string;
  name: string;
  avatarUrl?: string | null;
};

export type Place = {
  id: string;
  name: string;
  city: string;
  note?: string;
  photos: Photo[];
};

export type Comment = {
  id: string;
  tripId: string;
  authorId: string;
  author: AuthorInfo;
  message: string;
  createdAt: string;
};

export type Photo = {
  id: string;
  url: string;
  sortOrder: number;
  publicId: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
};

export const CURRENCY = {
  RUB: "₽",
  EUR: "€",
  USD: "$",
} as const;

export type Currency = keyof typeof CURRENCY;
export type CurrencySymbol = (typeof CURRENCY)[Currency];

export type Trip = {
  id: string;
  userId: string;
  author: AuthorInfo;
  title: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  days: number;
  approximateCost: number;
  currency: Currency;
  notes?: string;
  photos: Photo[];
  attractions: Place[];
  cafes: Place[];
  createdAt: string;
  likedByUserIds: string[];
  comments: Comment[];
};
