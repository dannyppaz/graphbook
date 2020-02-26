import React, { useState, Fragment } from "react";
import gql from "graphql-tag";
import { graphql, Query } from "react-apollo";

const GET_POSTS = gql`
  {
    posts {
      id
      text
      user {
        avatar
        username
      }
    }
  }
`;

// const Feed = props => {
//   const { posts, loading, error } = props;
//   const { postContent } = this.state;

//   if (loading) {
//     return "Loading...";
//   }
//   if (error) {
//     return error.message;
//   }

//   const [posts, setPosts] = useState(_posts);
//   const [postContent, setPostContent] = useState("");

//   const handlePostContentChange = event => {
//     setPostContent(event.target.value);
//   };

//   const handleSubmit = event => {
//     event.preventDefault();
//     const newPost = {
//       id: posts.length + 1,
//       text: postContent,
//       user: {
//         avatar: "/uploads/avatar1.png",
//         username: "Fake User"
//       }
//     };

//     setPosts(prevState => [newPost, ...prevState]);
//     setPostContent("");
//   };

//   return (
//     <Fragment>
//       <div className="postForm">
//         <form onSubmit={handleSubmit}>
//           <textarea
//             value={postContent}
//             onChange={handlePostContentChange}
//             placeholder="Write your custom post!"
//           />
//           <input type="submit" value="Submit" />
//         </form>
//       </div>
//       <div className="feed">
//         {posts.map((post, i) => (
//           <div key={post.id} className="post">
//             <div className="header">
//               <img src={post.user.avatar} />
//               <h2>{post.user.username}</h2>
//             </div>
//             <p className="content">{post.text}</p>
//           </div>
//         ))}
//       </div>
//     </Fragment>
//   );
// };

// export default graphql(GET_POSTS, {
//   props: ({ data: { loading, error, posts } }) => ({
//     loading,
//     posts,
//     error
//   })
// })(Feed);

export const Feed = () => {
  const [postContent, setPostContent] = useState("");

  const handlePostContentChange = event => {
    setPostContent(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    const newPost = {
      id: posts.length + 1,
      text: postContent,
      user: {
        avatar: "/uploads/avatar1.png",
        username: "Fake User"
      }
    };

    setPostContent("");
  };

  return (
    <Fragment>
      <div className="postForm">
        <form onSubmit={handleSubmit}>
          <textarea
            value={postContent}
            onChange={handlePostContentChange}
            placeholder="Write your custom post!"
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
      <div className="feed">
        <Query query={GET_POSTS}>
          {({ loading, error, data }) => {
            if (loading) return "...Loading";
            if (error) return error.message;

            const { posts } = data;
            return posts.map((post, i) => (
              <div key={post.id} className="post">
                <div className="header">
                  <img src={post.user.avatar} />
                  <h2>{post.user.username}</h2>
                </div>
                <p className="content">{post.text}</p>
              </div>
            ));
          }}
        </Query>
      </div>
    </Fragment>
  );
};
