import { IResolvers } from "@graphql-tools/utils";
import crypto from "crypto";
import { Response, Request } from "express";
import { Facebook, Google, LinkedIn } from "../../../lib";
import { LogInArgs, UpdateUserArgs } from "./types";
import { Database, User, SuccessResponse } from "../../../lib/types";
import { ObjectId } from "mongodb";
import cloudinary from "cloudinary";
import { ReadStream } from "fs-capacitor";
import Upload from "graphql-upload/Upload";
import { Vimeo } from "vimeo";

const cookieOptions = {
  httpOnly: true,
  signed: true,
  secure: process.env.NODE_ENV === "development" ? false : true,
};

const uploadStream = async (fileStream: ReadStream): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });

    const transformState = cloudinary.v2.uploader.upload_stream(
      { folder: "NTRPDB_Assets/" },
      (err, fileUploaded) => {
        if (err) {
          reject(err);
        }

        resolve(fileUploaded);
      }
    );

    fileStream.pipe(transformState);
  });
};

const uploadPicture = async (picture: Upload) => {
  const { file } = picture;
  const { createReadStream } = file;
  const fileStream = createReadStream();
  const { url } = await uploadStream(fileStream);
  return url;
};

const logInViaFacebook = async (
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
};

const logInViaLinkedIn = async (
  code: string,
  token: string,
  db: Database,
  res: Response
): Promise<User | null> => {
  const { user } = await LinkedIn.logIn(code);
  if (!user) {
    throw new Error("LinkedIn login error");
  }

  // @ts-ignore
  const userName = `${user.localizedFirstName} ${user.localizedLastName}`;
  // @ts-ignore
  const userId = user.id;
  // @ts-ignore
  const userAvatar = user.profilePicture["displayImage~"]?.elements[0]?.identifiers[0]?.identifier;
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
};

const logInViaGoogle = async (
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
};

const logInViaCookie = async (db: Database, req: Request, res: Response): Promise<User | null> => {
  const user = await db.users.findOne({ _id: req.signedCookies.ntrpdb_user });

  if (!user) {
    res.clearCookie("ntrpdb_user", cookieOptions);
  }

  return user;
};

const userResolvers: IResolvers = {
  Query: {
    googleAuthUrl: (): string => {
      try {
        return Google.authUrl;
      } catch (error) {
        throw new Error(`Failed to query Google Auth Url: ${error}`);
      }
    },
    linkedInAuthUrl: (): string => {
      try {
        return LinkedIn.authUrl();
      } catch (error) {
        throw new Error(`Failed to query LinkedIn Auth Url: ${error}`);
      }
    },
    facebookAuthUrl: (): string => {
      try {
        return Facebook.authUrl();
      } catch (error) {
        throw new Error(`Failed to query Facebook Auth Url: ${error}`);
      }
    },
    currentUser: async (
      _root: undefined,
      _args: undefined,
      { db, req, res }: { db: Database; req: Request; res: Response }
    ): Promise<User | null> => {
      try {
        const user: User | null = await logInViaCookie(db, req, res);

        if (!user) {
          return null;
        }

        return {
          _id: user._id,
          token: user.token,
          avatar: user.avatar,
          name: user.name,
          email: user.email,
          ntrp: user.ntrp,
          clubs: user.clubs,
          reviews: user.clubs,
          profilePicture: user.profilePicture,
          profileVideo: user.profileVideo,
        };
      } catch (error) {
        throw new Error(`Failed to log in: ${error}`);
      }
    },
  },
  Mutation: {
    logInLinkedIn: async (
      _root: undefined,
      { input }: LogInArgs,
      { db, res }: { db: Database; req: Request; res: Response }
    ): Promise<User | null> => {
      try {
        const code = input ? input.code : null;
        const token = crypto.randomBytes(16).toString("hex");
        const user: User | null = code ? await logInViaLinkedIn(code, token, db, res) : null;

        if (!user) {
          return null;
        }

        return {
          _id: user._id,
          token: user.token,
          avatar: user.avatar,
          name: user.name,
          email: user.email,
          ntrp: user.ntrp,
          clubs: user.clubs,
          reviews: user.clubs,
          profilePicture: user.profilePicture,
          profileVideo: user.profileVideo,
        };
      } catch (error) {
        throw new Error(`Failed to log in: ${error}`);
      }
    },
    logInGoogle: async (
      _root: undefined,
      { input }: LogInArgs,
      { db, res }: { db: Database; req: Request; res: Response }
    ): Promise<User | null> => {
      try {
        const code = input ? input.code : null;

        const token = crypto.randomBytes(16).toString("hex");
        const user: User | null = code ? await logInViaGoogle(code, token, db, res) : null;

        if (!user) {
          return null;
        }

        return user;
      } catch (error) {
        throw new Error(`Failed to log in: ${error}`);
      }
    },
    logInFacebook: async (
      _root: undefined,
      { input }: LogInArgs,
      { db, res }: { db: Database; req: Request; res: Response }
    ): Promise<User | null> => {
      try {
        const code = input ? input.code : null;

        const token = crypto.randomBytes(16).toString("hex");
        const user: User | null = code ? await logInViaFacebook(code, token, db, res) : null;

        if (!user) {
          return null;
        }

        return {
          _id: user._id,
          token: user.token,
          avatar: user.avatar,
          name: user.name,
          email: user.email,
          ntrp: user.ntrp,
          clubs: user.clubs,
          reviews: user.clubs,
          profilePicture: user.profilePicture,
          profileVideo: user.profileVideo,
        };
      } catch (error) {
        throw new Error(`Failed to log in: ${error}`);
      }
    },
    logOut: (
      _root: undefined,
      _args: Record<string, unknown>,
      { res }: { res: Response }
    ): SuccessResponse => {
      try {
        res.clearCookie("ntrpdb_user", cookieOptions);
        return { success: true };
      } catch (error) {
        throw new Error(`Failed to log out: ${error}`);
      }
    },
    updateUser: async (
      _root: undefined,
      { input }: UpdateUserArgs,
      { db }: { db: Database }
    ): Promise<SuccessResponse> => {
      const VimeoClient = new Vimeo(
        process.env.VIMEO_CLIENT_ID,
        process.env.VIMEO_CLIENT_SECRET,
        process.env.VIMEO_ACCESS_TOKEN
      );

      VimeoClient.request(
        {
          method: "GET",
          path: "/tutorial",
        },
        function (error, body, status_code, headers) {
          if (error) {
            console.log(error);
          }

          console.log({ body, status_code, headers });
        }
      );

      const { id, name, ntrp, profilePicture } = input;
      const userId = id as unknown as ObjectId;
      const profilePictureUrl = profilePicture && (await uploadPicture(profilePicture));

      const updateRes = await db.users.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            name,
            ntrp,
            ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
          },
        },
        { returnDocument: "after" }
      );

      const currentUser = updateRes.value;

      console.log({ currentUser });

      return {
        success: true,
      };
    },
  },
  User: {
    id: (user: User): ObjectId | undefined => user._id,
  },
};

export { userResolvers };
