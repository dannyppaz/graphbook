import express from "express";
import path from "path";
import helmet from "helmet"; // Helmet is a tool that allows you to set various HTTP headers to secure your application.
import cors from "cors";
import compress from "compress";

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

app.listen(8000, () => console.log("listen on port 8000!"));
