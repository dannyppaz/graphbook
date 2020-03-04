import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { Fragment, useState } from "react";

const GET_POSTS = gql`
  {
    posts {
      text
      id
      user {
        avatar
        username
      }
    }
  }
`;

const ADD_POST = gql`
  mutation addPost($post: PostInput!, $user: UserInput!) {
    addPost(post: $post, user: $user) {
      id
      text
      user {
        username
        avatar
      }
    }
  }
`;

export const Feed = () => {
  const [postContent, setPostContent] = useState("");
  const { loading, error, data } = useQuery(GET_POSTS);
  const [addPost] = useMutation(ADD_POST, {
    update(cache, { data: { addPost } }) {
      const { posts } = cache.readQuery({ query: GET_POSTS });
      cache.writeQuery({
        query: GET_POSTS,
        data: { posts: posts.concat([addPost]) }
      });
    }
  });

  if (loading) return "...Loading";
  if (error) return error.message;
  if (!data) return null;

  const handlePostContentChange = event => {
    setPostContent(event.target.value);
  };

  return (
    <Fragment>
      <div className="postForm" key="postForm">
        <form
          onSubmit={e => {
            e.preventDefault();
            addPost({
              variables: {
                post: { text: postContent },
                user: {
                  username: "danny",
                  avatar: "/uploads/avatar4.png"
                }
              },
              optimisticResponse: {
                __typename: "Mutation",
                addPost: {
                  __typename: "Post",
                  id: -1,
                  text: postContent,
                  user: {
                    __typename: "User",
                    username: "Loading ...",
                    avatar: "/public/loading.gif"
                  }
                }
              }
            }).then(() => {
              setPostContent("");
            });
          }}
        >
          <textarea
            value={postContent}
            onChange={handlePostContentChange}
            placeholder="Write your custom post!"
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
      <div className="feed" key="feed">
        {data.posts.map((post, i) => (
          <div
            key={post.id}
            className={"post " + (post.id < 0 ? "optimistic" : "")}
          >
            <div className="header">
              <img src={post.user.avatar} />
              <h2>{post.user.username}</h2>
            </div>
            <p className="content">{post.text}</p>
          </div>
        ))}
      </div>
    </Fragment>
  );
};
