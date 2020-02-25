import logger from "../../helpers/logger";

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

export default function resolvers() {
  const { db } = this;

  const resolvers = {
    RootQuery: {
      posts(root, args, context) {
        return db.get("posts").value();
      }
    },
    RootMutation: {
      addPost(root, { post, user }, context) {
        const postObject = {
          ...post,
          user,
          id: _posts.length + 1
        };
        _posts.push(postObject);
        logger.log("info", "Post was created");
        return _posts;
      }
    }
  };

  return resolvers;
}
