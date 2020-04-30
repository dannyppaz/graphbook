import React from "react";
import { ApolloConsumer, ApolloProvider } from "react-apollo";
import gql from "graphql-tag";
import { CurrentUserQuery } from "./../components/queries/CurrentUser";

const GET_CURRENT_USER = gql`
  query currentUser {
    currentUser {
      id
      username
      avatar
    }
  }
`;

export const UserProvider = ({ children }) => {
  return (
    <CurrentUserQuery
      render={(user) => (
        <ApolloProvider value={user}>{children}</ApolloProvider>
      )}
    ></CurrentUserQuery>
  );
};

export const UserConsumer = ({ children }) => {
  return (
    <ApolloConsumer>
      {(client) => {
        const { currentUser } = client.readQuery({ query: GET_CURRENT_USER });

        return React.Children.map(children, function (child) {
          return React.cloneElement(child, { user: currentUser });
        });
      }}
    </ApolloConsumer>
  );
};
