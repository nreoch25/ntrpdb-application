import { IResolvers } from "@graphql-tools/utils";
import crypto from "crypto";
import { Response, Request } from "express";
import { Facebook, Google, LinkedIn, Upload } from "../../../lib";
import { LogInArgs, UpdateUserArgs } from "./types";
import { Database, User, SuccessResponse } from "../../../lib/types";
import { ObjectId } from "mongodb";

const cookieOptions = {
  httpOnly: true,
  signed: true,
  secure: process.env.NODE_ENV === "development" ? false : true,
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
        const user: User | null = code
          ? await LinkedIn.logInViaLinkedIn(code, token, db, res)
          : null;

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
        const user: User | null = code ? await Google.logInViaGoogle(code, token, db, res) : null;

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
        const user: User | null = code
          ? await Facebook.logInViaFacebook(code, token, db, res)
          : null;

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
      const { id, name, ntrp, clubs, profilePicture, profileVideo } = input;

      const userId = id as unknown as ObjectId;
      const profilePictureUrl = profilePicture && (await Upload.uploadPicture(profilePicture));
      const profileVideoUrl = profileVideo && (await Upload.uploadVideo(profileVideo));

      const updateRes = await db.users.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            name,
            ntrp,
            ...(clubs && { clubs: clubs.map((club) => new ObjectId(club)) }),
            ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
            ...(profileVideoUrl && { profileVideo: profileVideoUrl }),
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
