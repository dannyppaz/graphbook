import React from "react";
import { ApolloProvider } from "react-apollo";
import App from "./app";

export const ServerClient = ({ client, loggedIn, location, context }) => (
  <ApolloProvider client={client}>
    <App location={location} loggedIn={loggedIn} context={context} />
  </ApolloProvider>
);
