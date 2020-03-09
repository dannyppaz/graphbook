import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { Fragment, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

const GET_POSTS = gql`
  query postsFeed($page: Int, $limit: Int) {
    postsFeed(page: $page, limit: $limit) {
      posts {
        id
        text
        user {
          avatar
          username
        }
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
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const { loading, error, data, fetchMore } = useQuery(GET_POSTS, {
    variables: { page: 0, limit: 10 }
  });
  const [addPost] = useMutation(ADD_POST, {
    update(cache, { data: { addPost } }) {
      const variables = { page: 0, limit: 10 };
      const data = cache.readQuery({ query: GET_POSTS, variables });
      data.postsFeed.posts.unshift(addPost);
      cache.writeQuery({
        query: GET_POSTS,
        variables,
        data
      });
    }
  });

  if (loading) return "...Loading";
  if (error) return error.message;
  if (!data) return null;

  const { postsFeed } = data;
  const { posts } = postsFeed;

  const handlePostContentChange = event => {
    setPostContent(event.target.value);
  };

  const loadMore = fetchMore => {
    fetchMore({
      variables: {
        page: page + 1
      },
      updateQuery(previousResult, { fetchMoreResult }) {
        if (!fetchMoreResult.postsFeed.posts.length) {
          setHasMore(false);
          return previousResult;
        }

        setPage(prevPage => prevPage + 1);

        const newData = {
          postsFeed: {
            __typename: "PostFeed",
            posts: [
              ...previousResult.postsFeed.posts,
              ...fetchMoreResult.postsFeed.posts
            ]
          }
        };
        return newData;
      }
    });
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
        <InfiniteScroll
          loadMore={() => loadMore(fetchMore)}
          hasMore={hasMore}
          loader={
            <div className="loader" key={"loader"}>
              Loading ...
            </div>
          }
        >
          {posts.map((post, i) => (
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
        </InfiniteScroll>
      </div>
    </Fragment>
  );
};
