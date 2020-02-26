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
      },
      chats(root, args, context) {
        return db.get("chats").value();
      },
      chat(root, { chatId }, context) {
        console.log("LOGINFO: chats -> chatId", chatId);
        return db
          .get("chats")
          .find({ id: chatId })
          .value();
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
    Message: {
      user(message, args, context) {
        return db
          .get("users")
          .find({ username: message.user })
          .value();
      },
      chat(message, args, context) {
        return db
          .get("chats")
          .find(chat => chat.messages.include(message.id))
          .value();
      }
    },
    Chat: {
      messages(chat, args, context) {
        return db
          .get("messages")
          .filter({ chat: chat.id })
          .value();
      },
      users(chat, args, context) {
        return db
          .get("users")
          .filter(user => chat.users.includes(user.username))
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

        return { ...post, ...user };
      },
      addChat(root, { chat }, context) {
        logger.log({
          level: "info",
          message: "Message was created"
        });

        db.get("chats")
          .push({
            users: [...chat.users]
          })
          .write();
        return chat;
      },
      addMessage(root, { message }, context) {
        logger.log({
          level: "info",
          message: "Message was created"
        });

        // return User.findAll().then((users) => {
        //   const usersRow = users[0];

        //   return Message.create({
        //     ...message,
        //   }).then((newMessage) => {
        //     return Promise.all([
        //       newMessage.setUser(usersRow.id),
        //       newMessage.setChat(message.chatId),
        //     ]).then(() => {
        //       return newMessage;
        //     });
        //   });
        // });
      }
    }
  };

  return resolvers;
}
