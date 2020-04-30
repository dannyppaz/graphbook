import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useState } from "react";
import { GET_POSTS } from "../queries/PostsFeed";

export const UPDATE_POST = gql`
  mutation updatePost($post: PostInput!, $postId: String!) {
    updatePost(post: $post, postId: $postId) {
      id
      text
    }
  }
`;

export const UpdatePostMutation = ({ post, children }) => {
  const postId = post.id;

  const variables = { page: 0, limit: 10 };
  const [postContent, setPostContent] = useState(post.text);
  const changePostContent = (value) => setPostContent(value);
  const [updatePost] = useMutation(UPDATE_POST, {
    update: (cache, { data: { updatePost } }) => {
      let query = { query: GET_POSTS };
      if (!!variables) {
        query.variables = variables;
      }
      const data = cache.readQuery(query);
      for (let i = 0; i < data.postsFeed.posts.length; i++) {
        if (data.postsFeed.posts[i].id === postId) {
          data.postsFeed.posts[i].text = updatePost.text;
          break;
        }
      }

      cache.writeQuery({ ...query, data });
    },
    optimisticResponse: {
      __typename: "mutation",
      updatePost: {
        __typename: "Post",
        text: postContent,
      },
    },
  });

  return React.Children.map(children, (child) =>
    React.cloneElement(child, {
      updatePost,
      postContent,
      postId,
      changePostContent,
    })
  );
};
