import request from "superagent";
import { Database, User } from "./types";
import { Response } from "express";

const cookieOptions = {
  httpOnly: true,
  signed: true,
  secure: process.env.NODE_ENV === "development" ? false : true,
};

const Facebook = {
  authUrl: (): string => {
    const redirect_url = encodeURIComponent(`${process.env.REDIRECT_URL}`);
    return `https://www.facebook.com/v6.0/dialog/oauth?client_id=${process.env.FB_CLIENT_ID}&redirect_uri=${redirect_url}&scope=email,user_photos`;
  },
  logIn: async (code: string): Promise<Record<string, unknown>> => {
    console.log({ code });
    const res = await request
      .post("https://graph.facebook.com/v6.0/oauth/access_token")
      .send(`client_id=${process.env.FB_CLIENT_ID}`)
      .send(`client_secret=${process.env.FB_CLIENT_SECRET}`)
      .send(`redirect_uri=${process.env.REDIRECT_URL}`)
      .send(`code=${code}`);

    const data = await request.get(
      `https://graph.facebook.com/me?access_token=${encodeURIComponent(
        res.body.access_token
      )}&fields=id,email,first_name,last_name,picture.height(150)`
    );

    const user = JSON.parse(data.text);

    return { user };
  },

  logInViaFacebook: async (
    code: string,
    token: string,
    db: Database,
    res: Response
  ): Promise<User | null> => {
    const { user } = await Facebook.logIn(code);
    if (!user) {
      throw new Error("LinkedIn login error");
    }

    // @ts-ignore
    const userName = `${user.first_name} ${user.last_name}`;
    // @ts-ignore
    const userId = user.id;
    // @ts-ignore
    const userAvatar = user.picture.data.url;
    // @ts-ignore
    const userEmail = user.email;

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

export { Facebook };
