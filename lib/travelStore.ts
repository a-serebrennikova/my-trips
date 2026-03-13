// TODO get from api
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatarColor: string;
  homeCity: string;
};

export type Place = {
  id: string;
  name: string;
  city: string;
  note?: string;
};

export type Comment = {
  id: string;
  tripId: string;
  authorId: string;
  message: string;
  createdAt: string;
};

export type Trip = {
  id: string;
  userId: string;
  title: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  days: number;
  approximateCost: number;
  currency: "₽" | "€" | "$";
  rating: number;
  coverImage: string;
  notes?: string;
  attractions: Place[];
  cafes: Place[];
  createdAt: string;
  likedByUserIds: string[];
  comments: Comment[];
};
