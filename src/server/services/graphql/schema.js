/* The RootQuery type wraps all of the queries a client can run. */

const typeDefinitions = `
  directive @auth on QUERY | FIELD_DEFINITION | FIELD
  scalar Upload
  schema {
    query: RootQuery
    mutation: RootMutation
    subscription: RootSubscription
  }


  type RootQuery {
    posts: [Post] @auth,
    chats: [Chat],
    chat(chatId: String): Chat @auth
    postsFeed(page: Int, limit: Int, username: String): PostFeed @auth
    usersSearch(page: Int, limit: Int, text: String!): UsersSearch
    currentUser: User @auth
    user(username: String!): User @auth
  }

  type Post {
    id: String
    text: String
    user: User
  }

  type PostFeed {
    posts: [Post]
  }

  type Message {
    id: String
    text: String
    chat: String
    user: User
    activated: Int
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
    email: String
    password: String
  }

  type File {
    filename: String!
    url: String!

  }

  type RootMutation {
    addPost(post: PostInput!): Post
    updatePost(post: PostInput!, postId: String!): Post
    deletePost(postId: String!): Response
    addChat(chat: ChatInput!): Chat
    addMessage (message: MessageInput!): Message
    login(email: String!, password: String!): Auth
    signup(username: String!, email: String!, password: String!): Auth
    uploadAvatar(file: Upload!): File @auth
  }

  input PostInput {
    id: String
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
    chatId: String!
  }

  type RootSubscription {
    messageAdded: Message
  }

  type Response {
    success: Boolean
  }

  type UsersSearch {
    users: [User]
  }

  type Auth {
    token: String
  }
`;

export default [typeDefinitions];
