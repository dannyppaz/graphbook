import React, { Component, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

import { Post } from "./../posts";

export const FeedList = ({ posts, fetchMore }) => {
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);

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
    <div className="feed">
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
          <Post key={post.id} post={post} />
        ))}
      </InfiniteScroll>
    </div>
  );
};
