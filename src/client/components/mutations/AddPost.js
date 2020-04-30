import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useState } from "react";

import { GET_POSTS } from "../queries/PostsFeed";

const ADD_POST = gql`
  mutation addPost($post: PostInput!) {
    addPost(post: $post) {
      id
      text
      user {
        id
        username
        avatar
      }
    }
  }
`;

export const AddPostMutation = ({ variables, children }) => {
  const changePostContent = (value) => {
    setPostContent(value);
  };

  const [postContent, setPostContent] = useState("");

  const [addPost] = useMutation(ADD_POST, {
    update: (cache, { data: { addPost } }) => {
      let query = {
        query: GET_POSTS,
      };
      if (typeof variables !== typeof undefined) {
        query.variables = variables;
      }
      const data = cache.readQuery(query);

      const newData = {
        postsFeed: {
          ...data.postsFeed,
          posts: [addPost, ...data.postsFeed.posts],
        },
      };

      cache.writeQuery({ ...query, data: newData });
    },
    optimisticResponse: {
      __typename: "mutation",
      addPost: {
        __typename: "Post",
        text: postContent,
        id: "-1",
        user: {
          __typename: "User",
          id: "-1",
          username: "Loading...",
          avatar: "/public/loading.gif",
        },
      },
    },
  });

  return React.Children.map(children, function (child) {
    return React.cloneElement(child, {
      addPost,
      postContent,
      changePostContent,
    });
  });
};
