import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { Fragment, useState } from "react";

import { FeedList } from "./components/posts/FeedList";
import { PostsFeedQuery } from "./components/queries/PostsFeed";
import { PostForm } from "./components/posts/Form";
import { AddPostMutation } from "./components/mutations/AddPost";

export const Feed = ({ user }) => {
  const query_variables = { page: 0, limit: 10, username: user.username };
  return (
    <div className="container">
      <AddPostMutation variables={query_variables}>
        <PostForm />
      </AddPostMutation>

      <PostsFeedQuery variables={query_variables}>
        <FeedList></FeedList>
      </PostsFeedQuery>
    </div>
  );
};
