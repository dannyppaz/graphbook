const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // This automatically generates an HTML file that includes all of the webpack bundles.
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // This empties all of the provided directories to clean old build files.
const buildDirectory = "dist";
const outputDirectory = buildDirectory + "/client";
module.exports = {
  mode: "development",
  entry: "./src/client/index.js", // tells webpack where the starting point of our application is.
  // how our bundle is called and where it should be saved
  output: {
    /*
      The publicPath property tells webpack to prefix the bundle URL to an absolute path, instead of a relative path. When this property is not included, the browser cannot download the bundle when visiting the sub-directories of our application, as we are implementing client-side routing.
    */
    path: path.join(__dirname, outputDirectory),
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
    ],
  },
  devServer: {
    // enables us to run the code directly. It includes hot reloading code in the browser without rerunning a build or refreshing the  browser tab.
    // The historyApiFallback field tells the devServer to serve the index.html file, not only for the root path, http://localhost:3000/,
    // but also when it would typically receive a 404 error.
    port: 3000,
    historyApiFallback: true,
    open: true,
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.join(__dirname, buildDirectory)],
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
