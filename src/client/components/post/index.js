import React, { Component } from "react";
import { Header } from "./Header";
import { Content } from "./Content";

export const Post = ({ post }) => (
  <div className={"post " + (post.id < 0 ? "optimistic" : "")}>
    <Header post={post} />
    <Content post={post} />
  </div>
);
