import { useMutation } from "react-apollo";
import { GET_POSTS } from "../queries/PostsFeed";
import gql from "graphql-tag";

import React from "react";

const DELETE_POST = gql`
  mutation deletePost($postId: String!) {
    deletePost(postId: $postId) {
      success
    }
  }
`;

export const DeletePostMutation = ({ children, post }) => {
  const postId = post.id;
  const variables = { page: 0, limit: 10, username: post.user.username };
  const [deletePost] = useMutation(DELETE_POST, {
    update: (
      store,
      {
        data: {
          deletePost: { success },
        },
      }
    ) => {
      if (success) {
        let query = { query: GET_POSTS };
        if (!!variables) {
          query.variables = variables;
        }
        const data = store.readQuery(query);
        for (var i = 0; i < data.postsFeed.posts.length; i++) {
          if (data.postsFeed.posts[i].id === postId) {
            break;
          }
        }

        data.postsFeed.posts.splice(i, 1);
        store.writeQuery({ ...query, data });
      }
    },
    optimisticResponse: {
      // TODO: Investigate why when removing the optimisticResponse, the GET_POSTS query does not automatically updated. :(
      __typename: "mutation",
      deletePost: {
        __typename: "Response",
        success: true,
      },
    },
  });

  return React.Children.map(children, (child) =>
    React.cloneElement(child, { deletePost, postId })
  );
};
