import compress from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "path";
import React from "react";
import ReactDOM from "react-dom/server";
import { Helmet } from "react-helmet";
import Cookies from "cookies";
import JWT from "jsonwebtoken";
const { JWT_SECRET } = process.env;

import database from "./database";
import servicesLoader from "./services";
import { ServerClient as Graphbook } from "./ssr/";
import ApolloClient from "./ssr/apollo";
import template from "./ssr/template";

startServer();

async function startServer() {
  const db = await database.createDB("db.json");

  const utils = {
    db,
  };
  const services = servicesLoader(utils);

  const root = path.join(__dirname, "../..");
  const app = express();

  /* the use function which runs a series of commands when a given path matches. When executing this function without a path, it is executed for every request. */

  app.use(compress()); // This middleware compresses all responses going through it.

  app.use(cors()); // It merely sets a wildcard with * inside of Access-Control-Allow-Origin, allowing anyone from anywhere to use your API, at least in the first instance. The command also implements the OPTIONS route for the whole application.
  /* The OPTIONS method or request is made every time we use Cross-origin resource sharing. This action is what's called a preflight request, which ensures that the responding server trusts you. If the server does not respond correctly to the OPTIONS preflight, the actual method, such as POST, will not be made by the browser at all. */

  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "*.amazonaws.com"], // only images from these URLs should be loaded,
      },
    })
  );
  app.use(helmet.referrerPolicy({ policy: "same-origin" }));

  /*
    Initializes the cookies package under the req.cookies property for every request that it processes. The first parameter of the Cookies constructor is the request, the second is the response object, and the last one is an options parameter. It takes an array of keys, with which the cookies are signed. The keys are required if you want to sign your cookies for security reasons. You should take care of this in a production environment.
  */
  app.use((req, res, next) => {
    const options = { keys: ["Some random keys"] };
    req.cookies = new Cookies(req, res, options);
    next();
  });

  if (process.env.NODE_ENV === "development") {
    /* allows the back end to serve bundles generated by webpack, without creating files, but from memory. It is convenient for cases in which we need to run JavaScript directly, and do not want to use separate files.*/
    const devMiddleware = require("webpack-dev-middleware");
    /* only handles client-side updates. If a new version of a bundle was created, the client is notified, and the bundle is exchanged. */
    const hotMiddleware = require("webpack-hot-middleware");
    const webpack = require("webpack");
    const config = require("../../webpack.server.config");
    const compiler = webpack(config);
    app.use(devMiddleware(compiler));
    app.use(hotMiddleware(compiler));
  }

  app.use("/", express.static(path.join(root, "dist/client"))); // All files and folders in dist/client are served beginning with /
  app.use("/uploads", express.static(path.join(root, "uploads"))); // All files and folders in uploads are served beginning with uploads /

  applyServices(app, services);

  app.get("*", async (req, res) => {
    const client = ApolloClient(req);
    const context = {};
    const App = (
      <Graphbook client={client} location={req.url} context={context} />
    );
    const content = ReactDOM.renderToString(App);
    console.log("context is ===== ", context);
    if (context.url) {
      res.redirect(301, context.url);
    } else {
      const head = Helmet.renderStatic();
      res.status(200);
      res.send(`<!doctype html>\n${template(content, head)}`);
      res.end();
    }
  });

  app.listen(8000, () => console.info("listen on port 8000!"));
}

function applyServices(app, services) {
  const servicesName = Object.keys(services);
  for (let i = 0; i < servicesName.length; i++) {
    const name = servicesName[i];
    if (name === "graphql") {
      services[name].applyMiddleware({ app }); // Apollo automatically binds itself to the /graphql path because it is the default option. You could also include a path parameter if you want it to respond from a custom route.
    } else {
      app.use(`/${name}`, services[name]);
    }
  }
}
