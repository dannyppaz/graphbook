import express from "express";

const app = express();

app.get(
  "*",
  (req, res, next) => {
    console.log("first function");
    next();
  },
  (req, res) => {
    console.log("second function");
    res.send("Hello World");
  }
);
app.listen(8000, () => console.log("listen on port 8000!"));
