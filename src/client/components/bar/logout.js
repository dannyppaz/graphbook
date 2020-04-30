import React from "react";
import { withApollo } from "react-apollo";

const _Logout = ({ changeLoginState, client }) => {
  const logout = () => {
    localStorage.removeItem("jwt");
    changeLoginState(false);
    client.resetStore();
  };
  return (
    <button className="logout" onClick={logout}>
      Logout
    </button>
  );
};

export const Logout = withApollo(_Logout);
