/* The RootQuery type wraps all of the queries a client can run. */

const typeDefinitions = `
  schema {
    query: RootQuery
    mutation: RootMutation
    subscription: RootSubscription
  }


  type RootQuery {
    posts: [Post],
    chats: [Chat],
    chat(chatId: String): Chat
  }

  type Post {
    id: String
    text: String
    user: User
  }

  type Message {
    id: String
    text: String
    chat: Chat
    user: User
  }

  type Chat {
    id: String
    messages: [Message]
    users: [User]
    lastMessage: Message
  }

  type User {
    id: String
    avatar: String
    username: String
  }

  type RootMutation {
    addPost(post: PostInput!, user: UserInput!): Post
    addChat(chat: ChatInput!): Chat
    addMessage (message: MessageInput!): Message
  }

  input PostInput {
    text: String!
  }

  input UserInput {
    username: String!
    avatar: String!
  }

  input ChatInput {
    users: [String]
  }

  input MessageInput {
    text: String!
    chatId: Int!
  }

  type RootSubscription {
    messageAdded: Message
  }
`;

export default [typeDefinitions];
