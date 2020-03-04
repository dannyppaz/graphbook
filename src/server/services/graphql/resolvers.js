import logger from "../../helpers/logger";
const shortid = require("shortid");
import { PubSub, withFilter } from "graphql-subscriptions";
const pubsub = new PubSub();

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
      },
      lastMessage(chat, args, context) {
        console.log(
          db
            .get("messages")
            .filter(
              message => message.id === chat.messages[chat.messages.length - 1]
            )
            .value()
        );
        return db
          .get("messages")
          .find(
            message => message.id === chat.messages[chat.messages.length - 1]
          )
          .value();
      }
    },
    RootMutation: {
      addPost(root, { post, user }, context) {
        logger.log({
          level: "info",
          message: "Post was created"
        });

        const postId = shortid.generate();
        const userId = shortid.generate();

        db.get("posts")
          .push({
            id: postId,
            ...post,
            createdAt: new Date(),
            updatedAt: new Date(),
            user: user.username
          })
          .write();
        db.get("users")
          .push({ id: userId, ...user })
          .write();

        return db
          .get("posts")
          .find({ id: postId })
          .value();
      },
      addChat(root, { chat }, context) {
        logger.log({
          level: "info",
          message: "Message was created"
        });

        db.get("chats")
          .push({
            id: shortid.generate(),
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
    },
    RootSubscription: {
      messageAdded: {
        subscribe: withFilter(
          () => pubsub.asyncIterator("messageAdded"),
          (payload, variables, context) => {
            if (payload.messageAdded.UserId != context.user.id) {
              return Chat.findOne({
                where: {
                  id: payload.messageAdded.ChatId
                },
                include: [
                  {
                    model: User,
                    required: true,
                    through: { where: { userId: context.user.id } }
                  }
                ]
              }).then(chat => {
                if (chat !== null) {
                  return true;
                }
                return false;
              });
            }
            return false;
          }
        )
      }
    }
  };

  return resolvers;
}
