import { gql } from "@apollo/client";

export const LOG_IN_COOKIE = gql`
  mutation LogInCookie {
    logInCookie {
      id
      token
      avatar
      email
      ntrp
      clubs
      profilePicture
      profileVideo
    }
  }
`;
