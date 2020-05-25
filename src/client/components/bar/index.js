import React from "react";
import { SearchBar } from "./search";
import { UserConsumer } from "../../context/user";
import { UserBar } from "./user";
import { Logout } from "./logout";
import { Home } from "./home";
import { LogoutMutation } from "../mutations/Logout";

export const Bar = ({ changeLoginState }) => {
  return (
    <div className="topbar">
      <div className="inner">
        <SearchBar />
        <UserConsumer>
          <UserBar />
        </UserConsumer>
      </div>
      <div className="buttons">
        <Home />
        <LogoutMutation>
          <Logout changeLoginState={changeLoginState} />
        </LogoutMutation>
      </div>
    </div>
  );
};
