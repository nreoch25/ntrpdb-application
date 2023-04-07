import { Club } from "./../../../lib/types";
import { IResolvers } from "@graphql-tools/utils";
import { Database } from "../../../lib/types";
import { ClubsData, ClubsArgs } from "./types";

export const clubResolvers: IResolvers = {
  Query: {
    clubs: async (
      _root: undefined,
      { limit, page }: ClubsArgs,
      { db }: { db: Database }
    ): Promise<ClubsData> => {
      console.log({ db });

      const skip = page > 0 ? (page - 1) * limit : 0;

      const clubs = db.clubs.find({}).skip(skip).limit(limit);
      const total = await db.clubs.countDocuments();
      const result = await clubs.toArray();

      return {
        total,
        result,
      };
    },
  },
  Club: {
    id: (club: Club): string | undefined => club._id.toString(),
  },
};
