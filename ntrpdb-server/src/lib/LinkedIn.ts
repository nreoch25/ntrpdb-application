import request from "superagent";
import { Database, User } from "./types";
import { Response } from "express";

const cookieOptions = {
  httpOnly: true,
  signed: true,
  secure: process.env.NODE_ENV === "development" ? false : true,
};

const LinkedIn = {
  authUrl: (): string => {
    const redirect_url = encodeURIComponent(`${process.env.REDIRECT_URL}`);
    return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&state=987654321&scope=r_liteprofile%20r_emailaddress&client_id=${process.env.LI_CLIENT_ID}&redirect_uri=${redirect_url}`;
  },
  logIn: async (code: string): Promise<Record<string, unknown>> => {
    const res = await request
      .post("https://www.linkedin.com/oauth/v2/accessToken")
      .send("grant_type=authorization_code")
      .send(`redirect_uri=${process.env.REDIRECT_URL}`)
      .send(`client_id=${process.env.LI_CLIENT_ID}`)
      .send(`client_secret=${process.env.LI_CLIENT_SECRET}`)
      .send(`code=${code}`)
      .send(`state=123456789`);

    const profile = await request
      .get(
        "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,email,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))"
      )
      .set("Authorization", `Bearer ${res.body.access_token}`);

    const email = await request
      .get("https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))")
      .set("Authorization", `Bearer ${res.body.access_token}`);

    return {
      user: { ...profile.body, ...email.body },
    };
  },

  logInViaLinkedIn: async (
    code: string,
    token: string,
    db: Database,
    res: Response
  ): Promise<User | null> => {
    const { user }: Record<any, any> = await LinkedIn.logIn(code);
    if (!user) {
      throw new Error("LinkedIn login error");
    }

    // @ts-ignore
    const userName = `${user.localizedFirstName} ${user.localizedLastName}`;
    // @ts-ignore
    const userId = user.id;
    // @ts-ignore
    const userAvatar =
      user.profilePicture["displayImage~"]?.elements[0]?.identifiers[0]?.identifier;
    // @ts-ignore
    const userEmail = user.elements[0]?.["handle~"]?.emailAddress;

    if (!userId || !userName || !userAvatar || !userEmail) {
      throw new Error("LinkedIn login error");
    }

    const updateRes = await db.users.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          name: userName,
          avatar: userAvatar,
          email: userEmail,
          token,
        },
      },
      { returnDocument: "after" }
    );

    let currentUser = updateRes.value;

    if (!currentUser) {
      const insertResult = await db.users.insertOne({
        _id: userId,
        token,
        name: userName,
        avatar: userAvatar,
        email: userEmail,
        ntrp: "0",
        clubs: [],
        reviews: [],
        profilePicture: null,
        profileVideo: null,
      });

      currentUser = await db.users.findOne({ _id: insertResult.insertedId });
    }

    res.cookie("ntrpdb_user", userId, {
      ...cookieOptions,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    return currentUser;
  },
};

export { LinkedIn };
