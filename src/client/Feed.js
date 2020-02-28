import React, { useState, Fragment } from "react";
import gql from "graphql-tag";
import { graphql, Query, Mutation } from "react-apollo";

const GET_POSTS = gql`
  {
    posts {
      id
      text
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

  const handlePostContentChange = event => {
    setPostContent(event.target.value);
  };

  return (
    <Query query={GET_POSTS}>
      {({ loading, error, data }) => {
        if (loading) return "...Loading";
        if (error) return error.message;

        const { posts } = data;
        return (
          <Fragment>
            <div className="postForm">
              <Mutation mutation={ADD_POST}>
                {addPost => (
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
                )}
              </Mutation>
            </div>
            <div className="feed">
              {posts.map((post, i) => (
                <div key={post.id} className="post">
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
      }}
    </Query>
  );
};
