import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import Resolvers from "./resolvers";
import Schema from "./schema";
import { AuthDirective } from "./auth";

import JWT from "jsonwebtoken";
const { JWT_SECRET } = process.env;

export default (utils) => {
  const executableSchema = makeExecutableSchema({
    typeDefs: Schema,
    resolvers: Resolvers.call(utils), // set the owner object of the exported Resolvers function. So, within the Resolvers function, accessing this now gives us the utils object.
    schemaDirectives: {
      auth: AuthDirective, // the auth index inside the schemaDirectives object is the mark that we have to set at every GraphQL request in our schema that requires authentication.
    },
  });

  const server = new ApolloServer({
    schema: executableSchema,
    playground: true,
    introspection: true,
    context: ({ req }) => {
      const authorization =
        req.headers.authorization || req.cookies.authorization;
      console.log("LOGINFO: authorization", authorization);
      if (authorization) {
        var search = "Bearer";
        var regEx = new RegExp(search, "ig");
        const token = authorization.replace(regEx, "").trim();
        JWT.verify(token, JWT_SECRET, async (err, result) => {
          if (err) {
            return req;
          } else {
            const user = await utils.db
              .get("users")
              .find({ id: result.id })
              .value();

            return { ...req, user };
          }
        });
      }

      return req;
    },
  });

  return server;
};
