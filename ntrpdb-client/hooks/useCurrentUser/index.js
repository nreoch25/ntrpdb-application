import { useQuery } from "@apollo/client";
import { CURRENT_USER } from "../../graphql/queries/CurrentUser";

const useCurrentUser = ({ onCompleted }) => {
  useQuery(CURRENT_USER, {
    onCompleted,
  });
};

export { useCurrentUser };
