import express from "express";
import path from "path";
import helmet from "helmet"; // Helmet is a tool that allows you to set various HTTP headers to secure your application.
import cors from "cors";
import compress from "compression";

import database from "./database";
import servicesLoader from "./services";

startServer();

async function startServer() {
  const root = path.join(__dirname, "../..");
  const app = express();
  const db = await database.createDB("db.json");

  const utils = {
    db
  };

  const services = servicesLoader(utils);

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
        imgSrc: ["'self'", "data:", "*.amazonaws.com"] // only images from these URLs should be loaded,
      }
    })
  );
  app.use(helmet.referrerPolicy({ policy: "same-origin" }));

  app.use("/", express.static(path.join(root, "dist/client"))); // All files and folders in dist/client are served beginning with /
  app.use("/uploads", express.static(path.join(root, "uploads"))); // All files and folders in uploads are served beginning with uploads/

  app.get("/", (req, res) => {
    res.sendFile(path.join(root, "/dist/client/index.html"));
  });

  applyServices(app, services);

  app.listen(8000, () => console.log("listen on port 8000!"));
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
