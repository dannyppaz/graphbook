import React, { Component } from "react";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";

const LOGOUT = gql`
  mutation logout {
    logout {
      success
    }
  }
`;

export const LogoutMutation = ({ children }) => {
  const [logout, { loading, error }] = useMutation(LOGOUT);
  return React.Children.map(children, (child) =>
    React.cloneElement(child, { logout, loading, error })
  );
};
