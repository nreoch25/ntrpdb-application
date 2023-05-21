import { google } from "googleapis";
import { Database, User } from "./types";
import { Response } from "express";

const cookieOptions = {
  httpOnly: true,
  signed: true,
  secure: process.env.NODE_ENV === "development" ? false : true,
};

const auth = new google.auth.OAuth2(
  process.env.G_CLIENT_ID,
  process.env.G_CLIENT_SECRET,
  `${process.env.PUBLIC_URL}/login`
);

const Google = {
  authUrl: auth.generateAuthUrl({
    access_type: "online",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  }),
  logIn: async (code: string): Promise<Record<string, unknown>> => {
    const { tokens } = await auth.getToken(code);
    console.log({ tokens });
    auth.setCredentials(tokens);
    const { data } = await google.people({ version: "v1", auth }).people.get({
      resourceName: "people/me",
      personFields: "emailAddresses,names,photos",
    });

    return { user: data };
  },

  logInViaGoogle: async (
    code: string,
    token: string,
    db: Database,
    res: Response
  ): Promise<User | null> => {
    const { user } = await Google.logIn(code);
    if (!user) {
      throw new Error("Google login error");
    }

    // Names/Photos/Email Lists
    // @ts-ignore
    const userNamesList = user.names && user.names.length ? user.names : null;
    // @ts-ignore
    const userPhotosList = user.photos && user.photos.length ? user.photos : null;

    const userEmailsList =
      // @ts-ignore
      user.emailAddresses && user.emailAddresses.length ? user.emailAddresses : null;

    // User Display Name
    const userName = userNamesList ? userNamesList[0].displayName : null;

    // User Id
    const userId =
      userNamesList && userNamesList[0].metadata && userNamesList[0].metadata.source
        ? userNamesList[0].metadata.source.id
        : null;

    // User Avatar
    const userAvatar = userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : null;

    // User Email
    const userEmail = userEmailsList && userEmailsList[0].value ? userEmailsList[0].value : null;

    if (!userId || !userName || !userAvatar || !userEmail) {
      throw new Error("Google login error");
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

export { Google };
