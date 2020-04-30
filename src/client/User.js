import React from "react";
import { UserProfile } from "./components/user";
import { Chats } from "./Chats";
import { Bar } from "./components/bar";
import { UserQuery } from "./components/queries/UserQuery";

export const User = ({ changeLoginState, match }) => (
  <UserQuery variables={{ username: match.params.username }}>
    <Bar changeLoginState={changeLoginState} />
    <UserProfile username={match.params.username} />
    <Chats />
  </UserQuery>
);
