/* The RootQuery type wraps all of the queries a client can run. */

const typeDefinitions = `
  type Post {
    id: Int
    text: String
  }

  type RootQuery {
    posts: [Post]
  }

  schema {
    query: RootQuery
  }
`;

export default [typeDefinitions];
