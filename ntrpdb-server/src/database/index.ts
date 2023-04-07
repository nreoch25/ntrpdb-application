import { MongoClient } from "mongodb";
import { Database, User, Club, Review } from "../lib/types";

const user = process.env.DB_USER;
const userPassword = process.env.DB_USER_PASSWORD;
const cluster = process.env.DB_CLUSTER;

const url = `mongodb+srv://${user}:${userPassword}@${cluster}.mongodb.net?retryWrites=true&w=majority`;

export const connectDatabase = async (): Promise<Database> => {
  const client = await MongoClient.connect(url);
  const db = client.db("ntrpdb");

  return {
    users: db.collection<User>("users"),
    clubs: db.collection<Club>("clubs"),
    reviews: db.collection<Review>("reviews"),
  };
};
