import "dotenv/config";
import { ObjectId } from "mongodb";
import { connectDatabase } from "../src/database";
// import { Club } from "../src/lib/types";
import { clubs } from "./clubs";

const transformClubs = (clubs: any) => {
  return clubs.map((club: any) => {
    return {
      _id: new ObjectId(),
      name: club.name,
      address: club.address,
      website: club.website,
      photo: club.photo,
    };
  });
};

const seed = async () => {
  try {
    const db = await connectDatabase();
    console.log({ db });
    const transformedClubs = transformClubs(clubs);
    console.log({ transformedClubs });

    for (const club of transformedClubs) {
      await db.clubs.insertOne(club);
    }

    console.log("[seed] : success");
    process.exit();
  } catch (error) {
    throw new Error("failed to seed database");
  }
};

seed();
