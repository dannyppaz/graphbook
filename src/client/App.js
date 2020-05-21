import "../../assets/css/style.css";
import "./components/fontawesome";
import "@synapsestudios/react-drop-n-crop/lib/react-drop-n-crop.min.css";

import React, { useEffect, useState } from "react";
import { withApollo } from "react-apollo";
import { Helmet } from "react-helmet";
import { Routing } from "./router";
import { UserProvider } from "./context/user";

const _App = ({ client }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const changeLoginState = (loggedIn) => {
    setLoggedIn(loggedIn);
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    client.onResetStore(() => changeLoginState(false));
    return () => {
      client.onResetStore();
    };
  }, []);

  return (
    <div className="container">
      <Helmet>
        <title>Graphbook - Feed</title>
        <meta
          name="description"
          content="Newsfeed of all your friends on Graphbook"
        ></meta>
        <meta
          http-equiv="Content-Security-Policy"
          content="style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://cdnjs.cloudflare.com "
        ></meta>
      </Helmet>
      {/* {loggedIn ? (
        <UserProvider>
          <Bar changeLoginState={changeLoginState} />
          <Feed />
          <Chats />
        </UserProvider>
      ) : (
        <LoginRegisterForm changeLoginState={changeLoginState} />
      )} */}
      <Routing loggedIn={loggedIn} changeLoginState={changeLoginState} />
    </div>
  );
};

export const App = withApollo(_App);
