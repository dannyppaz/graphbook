import "../../assets/css/style.css";
import React from "react";
import { Helmet } from "react-helmet";
import { Feed } from "./Feed";
import { Chats } from "./Chats";

export const App = () => {
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
          content="default-src *; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://cdnjs.cloudflare.com "
        ></meta>
      </Helmet>
      <Feed />
      <Chats />
    </div>
  );
};
