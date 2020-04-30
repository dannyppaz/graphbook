import React from "react";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";

const SIGNUP = gql`
  mutation signup($email: String!, $password: String!, $username: String!) {
    signup(email: $email, password: $password, username: $username) {
      token
    }
  }
`;

export const SignUpMutation = ({ changeLoginState, children }) => {
  const [signup, { loading, error }] = useMutation(SIGNUP, {
    update(cache, { data: { signup } }) {
      if (signup.token) {
        localStorage.setItem("jwt", signup.token);
        changeLoginState(true);
      }
    }
  });

  return React.Children.map(children, child =>
    React.cloneElement(child, { signup, loading, error })
  );
};
