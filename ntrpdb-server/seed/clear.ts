import "dotenv/config";

import { connectDatabase } from "../src/database";

const clear = async () => {
  try {
    console.log("[clear] : running...");

    const db = await connectDatabase();

    const clubs = await db.clubs.find({}).toArray();
    // const users = await db.users.find({}).toArray();

    if (clubs.length > 0) {
      await db.clubs.drop();
    }

    // if (users.length > 0) {
    //   await db.users.drop();
    // }

    console.log("[clear] : success");
    process.exit();
  } catch {
    throw new Error("failed to clear database");
  }
};

clear();
