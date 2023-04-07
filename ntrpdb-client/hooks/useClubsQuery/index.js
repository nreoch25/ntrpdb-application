import { useQuery } from "@apollo/client";
import { CLUBS_QUERY } from "../../graphql/queries/Clubs";

const useClubsQuery = ({ limit, page }) => {
  const { data, loading, error } = useQuery(CLUBS_QUERY, {
    variables: {
      limit,
      page,
    },
  });

  return {
    data,
    loading,
    error,
  };
};

export { useClubsQuery };
