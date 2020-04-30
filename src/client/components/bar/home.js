import React from "react";
import { withRouter } from "react-router";

const _Home = ({ history }) => {
  const goHome = () => {
    history.push("/app");
  };
  return (
    <button className="goHome" onClick={goHome}>
      Home
    </button>
  );
};

export const Home = withRouter(_Home);
