export type DbTrip = {
  id: string;
  user_id: string;
  title: string;
  city: string;
  country: string;
  start_date: string;
  end_date: string;
  days: number;
  approximate_cost: number;
  currency: string;
  rating: number;
  cover_image: string;
  notes: string | null;
  created_at: string;
};

export type DbPlace = {
  id: string;
  name: string;
  city: string;
  note: string | null;
  trip_id: string;
  type: string;
};

export type DbComment = {
  id: string;
  trip_id: string;
  author_id: string;
  message: string;
  created_at: string;
};

export type DbTripLike = {
  trip_id: string;
  user_id: string;
};

export type DbUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar_color: string;
  home_city: string;
};

export const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? "12");

export const USER_SELECT_COLUMNS =
  "id, name, email, password, avatar_color, home_city";

export const USER_PUBLIC_SELECT_COLUMNS =
  "id, name, email, avatar_color, home_city";

export const TRIP_SELECT_COLUMNS =
  "id, user_id, title, city, country, start_date, end_date, days, approximate_cost, currency, rating, cover_image, notes, created_at";
