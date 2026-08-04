import type { Trip, User } from "@/src/types";
import type { DbUser } from "./types";

export type DbFriendSummaryRow = DbUser & {
  trips_count: number | string;
  likes_received: number | string;
  latest_trip_date: string | null;
};

export type DbFriendProfileStatsRow = {
  trips_count: number | string;
  likes_received: number | string;
  countries_count: number | string;
  avg_rating: string | number | null;
  latest_trip_date: string | null;
};

export type FriendSummary = {
  user: User;
  tripsCount: number;
  likesReceived: number;
  latestTripDate: string | null;
};

export type FriendProfileStats = {
  tripsCount: number;
  likesReceived: number;
  countriesCount: number;
  avgRating: string | null;
  latestTripDate: string | null;
};

export type FriendProfileData = {
  user: User;
  trips: Trip[];
  stats: FriendProfileStats;
};

export const READ_MODEL_REVALIDATE_SECONDS = 300;
