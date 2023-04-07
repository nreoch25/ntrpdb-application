import { gql } from "@apollo/client";

export const CLUBS_QUERY = gql`
  query Clubs($limit: Int!, $page: Int!) {
    clubs(limit: $limit, page: $page) {
      total
      result {
        id
        name
        address
        website
        photo
      }
    }
  }
`;
