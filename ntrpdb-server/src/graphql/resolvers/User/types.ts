import Upload from "graphql-upload/Upload.js";
export interface LogInArgs {
  input: { code: string } | null;
}

export interface UpdateUserInput {
  id: string;
  name: string;
  ntrp: string;
  profilePicture: Upload;
  profileVideo: Upload;
}

export interface UpdateUserArgs {
  input: UpdateUserInput;
}
