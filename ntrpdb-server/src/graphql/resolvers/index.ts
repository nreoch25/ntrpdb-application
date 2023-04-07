import merge from "lodash.merge";
import { userResolvers } from "./User";
import { clubResolvers } from "./Club";

export const resolvers = merge(userResolvers, clubResolvers);
