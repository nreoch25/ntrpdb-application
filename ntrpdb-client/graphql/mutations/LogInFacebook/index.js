import { gql } from "@apollo/client";

export const LOG_IN_FACEBOOK = gql`
  mutation LogInFacebook($input: LogInInput) {
    logInFacebook(input: $input) {
      id
      token
      avatar
      email
      name
      ntrp
      profilePicture
      profileVideo
      clubs
    }
  }
`;
