export const _posts = [
  {
    id: 2,
    text: "Lorem ipsum",
    user: {
      avatar: "/uploads/avatar1.png",
      username: "Test User"
    }
  },
  {
    id: 1,
    text: "Lorem ipsum",
    user: {
      avatar: "/uploads/avatar2.png",
      username: "Test User 2"
    }
  }
];

const resolvers = {
  RootQuery: {
    posts(root, args, context) {
      return _posts;
    }
  },
  RootMutation: {
    addPost(root, { post, user }, context) {
      console.log("LOGINFO: addPost -> user", user);
      console.log("LOGINFO: addPost -> post", post);
      const postObject = {
        ...post,
        user,
        id: _posts.length + 1
      };
      _posts.push(postObject);
      console.log("LOGINFO: addPost -> _posts", _posts);
      return _posts;
    }
  }
};

export default resolvers;
