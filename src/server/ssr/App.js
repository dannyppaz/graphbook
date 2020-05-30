import React, { Component, useState, Fragment } from "react";
import { Helmet } from "react-helmet";
import { withApollo } from "react-apollo";
import "../../client/components/fontawesome";
import { Routing } from "../../client/router";

const _App = ({ location, loggedIn: loggedInProp, context }) => {
  const [loggedIn, setLoggedIn] = useState(loggedInProp);
  console.log("render app server component");
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
