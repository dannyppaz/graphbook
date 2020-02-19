const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // This automatically generates an HTML file that includes all of the webpack bundles.
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // This empties all of the provided directories to clean old build files.
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // Goes through the complete CSS code, merges it in a separate file, and removes the import statements from the bundle.js we generate in parallel
const buildDirectory = "dist";
const outputDirectory = buildDirectory + "/client";
module.exports = {
  mode: "production",
  entry: "./src/client/index.js", // tells webpack where the starting point of our application is.
  // how our bundle is called and where it should be saved
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../"
            }
          },
          "css-loader"
        ]
      }
    ]
  },
  devServer: {
    // enables us to run the code directly. It includes hot reloading code in the browser without rerunning a build or refreshing the  browser tab
    port: 3000,
    open: true
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.join(__dirname, buildDirectory)]
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "bundle.css"
    })
  ]
};
