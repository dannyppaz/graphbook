import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { createUploadLink } from "apollo-upload-client";

/* Before sending any request, we have to read the JWT from the localStorage and add it as an HTTP authorization header. Inside the link property, we have specified the links for our ApolloClient processes. Before the configuration of the HTTP link, we insert a third preprocessing hook as follows: */
const AuthLink = (operation, next) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    operation.setContext((context) => ({
      ...context,
      headers: {
        ...context.headers,
        Authorization: `Bearer ${token}`,
      },
    }));
  }
  return next(operation);
};

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path, extensions }) => {
          // when the jwt token is invalid.
          if (extensions.code === "UNAUTHENTICATED") {
            localStorage.removeItem("jwt");
            client.resetStore();
          }
          console.error(`[GraphQL error]: Message: ${message}, Location:
        ${locations[0]}, Path: ${path}`);
        });
        if (networkError) {
          console.error(`[Network error]: ${networkError}`);
        }
      }
    }),
    AuthLink,
    // new HttpLink({
    //   uri: "http://localhost:8000/graphql",
    //   credentials: "same-origin",
    // }),
    createUploadLink({
      uri: "http://localhost:8000/graphql",
      credentials: "same-origin",
      useGETForQueries: true,
    }),
  ]),
  cache: new InMemoryCache(),
});

export default client;
