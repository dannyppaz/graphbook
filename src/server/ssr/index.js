import React from "react";
import { ApolloProvider } from "react-apollo";
import App from "./app";

export const ServerClient = ({ client, location, context }) => (
  <ApolloProvider client={client}>
    <App location={location} context={context} />
  </ApolloProvider>
);
