import { Collection, ObjectId } from "mongodb";

export interface Review {
  _id: ObjectId;
  player: ObjectId;
  rating: string;
  review: string;
}

export interface Club {
  _id: ObjectId;
  name: string;
  address: string;
  website: string;
  photo: string | null;
}

export interface User {
  _id: ObjectId;
  token: string;
  name: string;
  avatar: string;
  email: string;
  ntrp: string;
  clubs: ObjectId[];
  reviews: ObjectId[];
  profilePicture: string | null;
  profileVideo: string | null;
  authorized?: boolean;
}

export interface SuccessResponse {
  success: boolean;
}

export interface Database {
  users: Collection<User>;
  clubs: Collection<Club>;
  reviews: Collection<Review>;
}
