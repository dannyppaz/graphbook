import gql from "graphql-tag";
import React, { Component } from "react";
import { useQuery } from "react-apollo";

const GET_USERS = gql`
  query usersSearch($page: Int, $limit: Int, $text: String!) {
    usersSearch(page: $page, limit: $limit, text: $text) {
      users {
        id
        avatar
        username
      }
    }
  }
`;

export const UsersSearchQuery = ({ variables, children }) => {
  const getVariables = () => {
    var query_variables = {
      page: 0,
      limit: 5,
      text: ""
    };
    if (typeof variables !== typeof undefined) {
      if (typeof variables.page !== typeof undefined) {
        query_variables.page = variables.page;
      }
      if (typeof variables.limit !== typeof undefined) {
        query_variables.limit = variables.limit;
      }
      if (typeof variables.text !== typeof undefined) {
        query_variables.text = variables.text;
      }
    }
    return query_variables;
  };

  const skip = variables.text.length < 3;

  const { loading, error, data, fetchMore, refetch } = useQuery(GET_USERS, {
    variables: getVariables()
  });

  if (loading || error || typeof data === typeof undefined) return null;

  const { usersSearch } = data;
  const { users } = usersSearch;
  return React.Children.map(children, function(child) {
    return React.cloneElement(child, { users, fetchMore, variables, refetch });
  });
};
