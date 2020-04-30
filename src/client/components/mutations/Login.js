import React from "react";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const LoginMutation = ({ changeLoginState, children }) => {
  const [login, { loading, error }] = useMutation(LOGIN, {
    update(cache, { data: { login } }) {
      if (login.token) {
        localStorage.setItem("jwt", login.token);
        changeLoginState(true);
      }
    }
  });

  return React.Children.map(children, child =>
    React.cloneElement(child, { login, loading, error })
  );
};
