import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { Component } from "react";

import { Loading } from "../loading";
import { Error } from "../error";

export const GET_POSTS = gql`
  query postsFeed($page: Int, $limit: Int, $username: String) {
    postsFeed(page: $page, limit: $limit, username: $username) {
      posts {
        id
        text
        user {
          id
          username
          avatar
        }
      }
    }
  }
`;

export const PostsFeedQuery = ({ variables, children }) => {
  const getVariables = () => {
    var query_variables = {
      page: 0,
      limit: 10,
    };

    if (typeof variables !== typeof undefined) {
      if (typeof variables.page !== typeof undefined) {
        query_variables.page = variables.page;
      }
      if (typeof variables.limit !== typeof undefined) {
        query_variables.limit = variables.limit;
      }
      if (typeof variables.username !== typeof undefined) {
        query_variables.username = variables.username;
      }
    }

    return query_variables;
  };

  const { loading, error, data, fetchMore } = useQuery(GET_POSTS, {
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

  const { postsFeed } = data;
  const { posts } = postsFeed;

  return React.Children.map(children, (child) =>
    React.cloneElement(child, { posts, fetchMore })
  );
};
