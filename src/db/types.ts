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
  notes: string | null;
  created_at: string;
};

export type DbTripWithAuthor = DbTrip & {
  author_name?: string | null;
  avatar_url?: string | null;
};

export type DbPlace = {
  id: string;
  name: string;
  city: string;
  note: string | null;
  trip_id: string;
  type: string;
};

export type DbPhoto = {
  id: string;
  trip_id: string | null;
  place_id: string | null;
  url: string;
  sort_order: number;
  public_id: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
};

export type DbComment = {
  id: string;
  trip_id: string;
  author_id: string;
  message: string;
  created_at: string;
};

export type DbCommentWithAuthor = DbComment & {
  author_name?: string | null;
  avatar_url?: string | null;
};

export type DbTripLike = {
  trip_id: string;
  user_id: string;
};

export type DbUser = {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  home_city: string;
};

export type DbUserWithPasswordHash = DbUser & {
  passwordHash: string;
  updated_at: string;
  last_login_at: string | null;
};

export const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? "12");

export const USER_SELECT_COLUMNS =
  'id, name, email, password_hash AS "passwordHash", avatar_url, home_city, updated_at, last_login_at';

export const USER_PUBLIC_SELECT_COLUMNS =
  "id, name, email, avatar_url, home_city";

export const TRIP_SELECT_COLUMNS =
  "id, user_id, title, city, country, start_date, end_date, days, approximate_cost, currency, notes, created_at";
