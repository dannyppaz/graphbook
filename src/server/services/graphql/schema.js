/* The RootQuery type wraps all of the queries a client can run. */

const typeDefinitions = `
  schema {
    query: RootQuery
    mutation: RootMutation
  }


  type RootQuery {
    posts: [Post]
  }

  type Post {
    id: String
    text: String
    user: User
  }

  type User {
    avatar: String
    username: String
  }

  type RootMutation {
    addPost(post: PostInput!, user: UserInput!): Post
  }

  input PostInput {
    text: String!
  }

  input UserInput {
    username: String!
    avatar: String!
  }
`;

export default [typeDefinitions];
