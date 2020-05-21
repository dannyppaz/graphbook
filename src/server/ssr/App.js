import React, { Component, useState, Fragment } from "react";
import { Helmet } from "react-helmet";
import { withApollo } from "react-apollo";
import "../../client/components/fontawesome";
import { Routing } from "../../client/router";

const _App = ({ location, context }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const changeLoginState = (loggedIn) => {
    setLoggedIn(loggedIn);
  };
  return (
    <Fragment>
      <Helmet>
        <title>Graphbook - Feed</title>
        <meta
          name="description"
          content="Newsfeed of all your friends on Graphbook"
        />
      </Helmet>
      <Routing
        loggedIn={loggedIn}
        changeLoginState={changeLoginState}
        location={location}
        context={context}
      />
    </Fragment>
  );
};

export default withApollo(_App);
