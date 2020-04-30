import React from "react";

export const PostForm = ({
  addPost,
  updatePost,
  postContent,
  postId,
  changePostContent,
  changeState,
}) => {
  const handlePostContentChange = (event) => {
    changePostContent(event.target.value);
  };

  return (
    <div className="postForm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (typeof updatePost !== typeof undefined) {
            updatePost({
              variables: { post: { text: postContent }, postId },
            }).then(() => {
              changeState();
            });
          } else {
            addPost({
              variables: {
                post: { text: postContent },
              },
            }).then(() => {
              changePostContent("");
            });
          }
        }}
      >
        <textarea
          value={postContent}
          onChange={handlePostContentChange}
          placeholder="Write your custom post!"
        />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};
