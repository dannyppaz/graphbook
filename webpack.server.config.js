/* For SSR */

const path = require("path");
const webpack = require("webpack");
const buildDirectory = "dist";
module.exports = {
  mode: "development",
  entry: [
    /* we now have multiple entry points. The index file for the front end code is one entry point. The second one is the new webpack-hot-middleware module, which initiates the connection between the client and the server. The connection is used to send the client notifications to update the bundle to a newer version. */
    "webpack-hot-middleware/client",
    "./src/client/index.js",
  ],
  output: {
    path: path.join(__dirname, buildDirectory),
    filename: "bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader?limit=100000",
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
};
