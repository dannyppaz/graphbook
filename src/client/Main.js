import React from "react";
import { Feed } from "./Feed";
import { Chats } from "./Chats";
import { Bar } from "./components/bar";
import { CurrentUserQuery } from "./components/queries/CurrentUser";

export const Main = ({ changeLoginState }) => (
  <CurrentUserQuery>
    <Bar changeLoginState={changeLoginState} />
    <Feed />
    <Chats />
  </CurrentUserQuery>
);
