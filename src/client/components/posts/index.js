import React, { useState } from "react";
import PropTypes from "prop-types";
import { Header } from "./Header";
import { Content } from "./Content";
import { PostForm } from "./Form";
import { UpdatePostMutation } from "../mutations/UpdatePost";

export const Post = ({ post }) => {
  const [editing, setEditing] = useState(false);

  const changeState = () => {
    setEditing(!editing);
  };

  return (
    <div className={"post " + (post.id < 0 ? "optimistic" : "")}>
      <Header post={post} changeState={changeState} />
      {!editing && <Content post={post} />}
      {editing && (
        <UpdatePostMutation post={post}>
          <PostForm changeState={changeState} />
        </UpdatePostMutation>
      )}
    </div>
  );
};

Post.propTypes = {
  /** Object containing the complete post. */
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    user: PropTypes.shape({
      avatar: PropTypes.string,
      username: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};
