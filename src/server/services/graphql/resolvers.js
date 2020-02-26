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
    Post: {
      user(post, args, context) {
        return db
          .get("users")
          .find({ username: post.user })
          .value();
      }
    },
    RootMutation: {
      addPost(root, { post, user }, context) {
        logger.log({
          level: "info",
          message: "Post was created"
        });

        db.get("posts")
          .push({
            ...post,
            createdAt: new Date(),
            updatedAt: new Date(),
            user: user.username
          })
          .write();
        db.get("users")
          .push(user)
          .write();

        return db.get("posts").value();
      }
    }
  };

  return resolvers;
}
