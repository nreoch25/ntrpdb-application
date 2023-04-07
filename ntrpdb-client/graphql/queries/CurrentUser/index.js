import { gql } from "@apollo/client";

export const CURRENT_USER = gql`
  query {
    currentUser {
      id
      token
      name
      avatar
      email
      ntrp
      profilePicture
      profileVideo
      clubs {
        id
        address
        name
        photo
        website
      }
    }
  }
`;
