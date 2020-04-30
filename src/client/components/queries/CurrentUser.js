import gql from "graphql-tag";
import React, { Fragment } from "react";
import { useQuery } from "react-apollo";

const GET_CURRENT_USER = gql`
  query currentUser {
    currentUser {
      id
      username
      avatar
    }
  }
`;

export const CurrentUserQuery = ({ render, children }) => {
  const { loading, error, data } = useQuery(GET_CURRENT_USER);
  if (loading || error || typeof data === typeof undefined) return null;
  const { currentUser } = data;
  if (render) {
    return <Fragment>{render(currentUser)}</Fragment>;
  } else if (children) {
    return React.Children.map(children, function (child) {
      return React.cloneElement(child, { user: currentUser });
    });
  } else return null;
};
