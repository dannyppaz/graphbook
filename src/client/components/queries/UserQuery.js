import React from "react";
import { Query, useQuery } from "react-apollo";
import { Loading } from "../loading";
import { Error } from "../error";
import gql from "graphql-tag";

const GET_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      id
      email
      username
      avatar
    }
  }
`;

export const UserQuery = ({ variables, children }) => {
  const getVariables = () => {
    var query_variables = {};
    if (typeof variables.username !== typeof undefined) {
      query_variables.username = variables.username;
    }
    return query_variables;
  };

  const { loading, error, data, fetchMore } = useQuery(GET_USER, {
    variables: getVariables(),
  });

  if (loading) return <Loading />;
  if (error)
    return (
      <Error>
        <p>{error.message}</p>
      </Error>
    );
  if (!data) return null;
  const { user } = data;
  return React.Children.map(children, (child) =>
    React.cloneElement(child, { user })
  );
};
