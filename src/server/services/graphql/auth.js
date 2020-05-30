import {
  SchemaDirectiveVisitor,
  AuthenticationError,
} from "apollo-server-express";

/* If we add AuthDirective to our GraphQL schema, we execute a function whenever the marked GraphQL action is requested */
export class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    console.log("visitFieldDefinition : ", field.astNode.name.value);
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const ctx = args[2];
      console.log(
        "LOGINFO: AuthDirective -> visitFieldDefinition -> ctx.user",
        ctx.user
      );
      if (ctx.user) {
        return await resolve.apply(this, args);
      } else {
        throw new AuthenticationError("You need to be logged in.");
      }
    };
  }
}
