import Upload from "graphql-upload/Upload.js";
import { Club } from "../../../lib/types";
export interface LogInArgs {
  input: { code: string } | null;
}

export interface UpdateUserInput {
  id: string;
  name: string;
  ntrp: string;
  clubs: string[];
  profilePicture: Upload;
  profileVideo: Upload;
}

export interface UpdateUserArgs {
  input: UpdateUserInput;
}
