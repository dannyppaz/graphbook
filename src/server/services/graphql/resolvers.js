import logger from "../../helpers/logger";
const shortid = require("shortid");
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { PubSub, withFilter } from "graphql-subscriptions";
import { uploadStreamImage } from "../../helpers/image";

const { JWT_SECRET } = process.env;
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
        return db.get("chats").find({ id: chatId }).value();
      },
      postsFeed(root, { page, limit, username }, context) {
        var skip = 0;

        if (page && limit) {
          skip = page * limit;
        }

        const _posts = limit
          ? db
              .get("posts")
              .filter((post) => post.user === username)
              .slice(skip, limit)
              .value()
          : db
              .get("posts")
              .filter((post) => post.user === username)
              .slice(skip)
              .value();

        return { posts: _posts };
      },
      usersSearch(root, { page, limit, text }, context) {
        if (text.length < 3) {
          return {
            users: [],
          };
        }
        let skip = 0;
        if (page && limit) {
          skip = page * limit;
        }

        const users = limit
          ? db
              .get("users")
              .filter((user) => user.username.includes(text))
              .slice(skip, limit)
              .value()
          : db
              .get("posts")
              .filter((user) => user.username.includes(text))
              .slice(skip)
              .value();

        return { users };
      },
      currentUser(root, {}, context) {
        return context.user;
      },
      user(root, { username }, context) {
        return db.get("users").find({ username }).value();
      },
    },
    Post: {
      user(post, args, context) {
        return db.get("users").find({ username: post.user }).value();
      },
    },
    Message: {
      user(message, args, context) {
        return db.get("users").find({ username: message.user }).value();
      },
      chat(message, args, context) {
        return db
          .get("chats")
          .find((chat) => chat.messages.include(message.id))
          .value();
      },
    },
    Chat: {
      messages(chat, args, context) {
        return db.get("messages").filter({ chat: chat.id }).value();
      },
      users(chat, args, context) {
        return db
          .get("users")
          .filter((user) => chat.users.includes(user.username))
          .value();
      },
      lastMessage(chat, args, context) {
        return db
          .get("messages")
          .find((message) => {
            return message.id === chat.messages[chat.messages.length - 1];
          })
          .value();
      },
    },
    RootMutation: {
      addPost(root, { post }, context) {
        logger.log({
          level: "info",
          message: "Post was created",
        });

        const postId = shortid.generate();

        const user = context.user;

        db.get("posts")
          .push({
            id: postId,
            ...post,
            createdAt: new Date(),
            updatedAt: new Date(),
            user: user.username,
          })
          .write();

        return db.get("posts").find({ id: postId }).value();
      },
      updatePost(root, { post, postId }, context) {
        db.get("posts").find({ id: postId }).assign(post).write();
        return db.get("posts").find({ id: postId }).value();
        // const updatedPost = {...currentPost, ...post };
      },
      deletePost(root, { postId }, context) {
        return db
          .get("posts")
          .remove({ id: postId })
          .write()
          .then((_) => ({
            success: true,
          }))
          .catch((error) => ({
            // FIXME: error handlers does not work here, check again !!!!
            success: false,
          }));
      },
      addChat(root, { chat }, context) {
        logger.log({
          level: "info",
          message: "Message was created",
        });

        db.get("chats")
          .push({
            id: shortid.generate(),
            users: [...chat.users],
          })
          .write();
        return chat;
      },
      addMessage(root, { message }, context) {
        logger.log({
          level: "info",
          message: "Message was created",
        });

        const chat = db
          .get("chats")
          .find((chat) => chat.id === message.chatId)
          .value();
        const newMessage = {
          id: shortid.generate(),
          text: message.text,
          chat: message.chatId,
          user: "danny",
        };

        chat.messages.push(newMessage);
        db.write();

        return newMessage;
      },
      login: async (root, { email, password }, context) => {
        const user = db
          .get("users")
          .find((user) => user.email === email)
          .value();

        if (!user) {
          throw new Error("User not found");
        }
        const passWordValid = await bcrypt.compare(password, user.password);

        if (!passWordValid) {
          throw new Error("Password does not match");
        }

        const token = JWT.sign({ email, id: user.id }, JWT_SECRET, {
          expiresIn: "1d",
        });
        console.log("LOGINFO: token", token);

        const cookieExpiration = 1;
        var expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + cookieExpiration);

        context.cookies.set("authorization", token, {
          signed: true,
          expires: expirationDate,
          httpOnly: true,
          secure: false,
          sameSite: "strict",
        });
        return { token };
      },
      signup: async (root, { email, password, username }, context) => {
        const existingUser = db
          .get("users")
          .find((user) => user.email === email || user.username === username)
          .value();

        if (existingUser) {
          throw new Error("User already existed");
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const userId = shortid.generate();
        await db
          .get("users")
          .push({
            id: userId,
            email,
            username,
            password: hashPassword,
            activated: 1,
          })
          .write();

        const token = JWT.sign({ email, id: userId }, JWT_SECRET, {
          expiresIn: "1d",
        });

        const cookieExpiration = 1;
        var expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + cookieExpiration);

        context.cookies.set("authorization", token, {
          signed: true,
          expires: expirationDate,
          httpOnly: true,
          secure: false,
          sameSite: "strict",
        });

        return { token };
      },
      logout(root, params, context) {
        context.cookies.set("authorization", "", {
          signed: true,
          expires: new Date(),
          httpOnly: true,
          secure: false,
          sameSite: "strict",
        });
        return {
          message: true,
        };
      },
      uploadAvatar: async (root, { file }, context) => {
        /*
        The Upload type contains these properties:
        stream: The upload stream manages streaming the file(s) to a filesystem or any storage location of your choice. e.g. S3, Azure, Cloudinary, e.t.c.
        filename: The name of the uploaded file(s).
        mimetype: The MIME type of the file(s) such as text/plain, application/octet-stream, etc.
        encoding: The file encoding such as UTF-8.
        */

        try {
          const uploadAvatar = await uploadStreamImage(file);

          const url = uploadAvatar.gcsUrl;
          const filename = uploadAvatar.name;
          const user = await db
            .get("users")
            .find({ id: context.user.id })
            .value();
          user.avatar = url;
          await db.write();
          return { filename, url };
        } catch (error) {
          console.error("ERROR WHILE UPLOADING AVATAR: ", error);
        }
      },
    },
    RootSubscription: {
      messageAdded: {
        subscribe: withFilter(
          () => pubsub.asyncIterator("messageAdded"),
          (payload, variables, context) => {
            if (payload.messageAdded.UserId != context.user.id) {
              return Chat.findOne({
                where: {
                  id: payload.messageAdded.ChatId,
                },
                include: [
                  {
                    model: User,
                    required: true,
                    through: { where: { userId: context.user.id } },
                  },
                ],
              }).then((chat) => {
                if (chat !== null) {
                  return true;
                }
                return false;
              });
            }
            return false;
          }
        ),
      },
    },
  };

  return resolvers;
}
