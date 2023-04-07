import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

export default function createApolloClient(initialState, headers) {
  console.log({ initialState });
  const authLink = new ApolloLink((operation, forward) => {
    const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
    operation.setContext({
      fetchOptions: {
        credentials: "include",
      },
      headers: {
        ...headers,
        ...(token && { "X-CSRF-TOKEN": 5 }),
      },
    });
    return forward(operation);
  });

  const httpLink = new createUploadLink({
    uri: "http://localhost:8000/graphql",
  });

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: authLink.concat(httpLink),
    cache: new InMemoryCache().restore(initialState),
  });
}
