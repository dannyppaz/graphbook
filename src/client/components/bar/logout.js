import React from "react";
import { withApollo } from "react-apollo";

const _Logout = ({ changeLoginState, client, logout }) => {
  const logoutFn = () => {
    logout().then(() => {
      localStorage.removeItem("jwt");
      changeLoginState(false);
      client.resetStore();
    });
  };

  return (
    <button className="logout" onClick={logoutFn}>
      Logout
    </button>
  );
};

export const Logout = withApollo(_Logout);
