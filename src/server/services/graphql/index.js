import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import Resolvers from "./resolvers";
import Schema from "./schema";

export default utils => {
  const executableSchema = makeExecutableSchema({
    typeDefs: Schema,
    resolvers: Resolvers.call(utils) // set the owner object of the exported Resolvers function. So, within the Resolvers function, accessing this now gives us the utils object.
  });

  const server = new ApolloServer({
    schema: executableSchema,
    context: ({ req }) => req
  });

  return server;
};
