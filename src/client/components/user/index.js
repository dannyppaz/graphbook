import React from "react";
import { PostsFeedQuery } from "../queries/PostsFeed";
import { FeedList } from "../posts/FeedList";
import { UserProfileHeader } from "./header";
import { UserQuery } from "../queries/UserQuery";

export const UserProfile = ({ username }) => {
  const query_variables = { page: 0, limit: 10, username };
  return (
    <div className="user">
      <div className="inner">
        <UserQuery variables={{ username }}>
          <UserProfileHeader />
        </UserQuery>
      </div>
      <div className="container">
        <PostsFeedQuery variables={query_variables}>
          <FeedList />
        </PostsFeedQuery>
      </div>
    </div>
  );
};
