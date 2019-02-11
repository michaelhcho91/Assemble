const path = require("path");

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "app", "assets", "javascripts"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: [/\.js?$/],
        exclude: /(node_modules)/
      }
    ]
  },
  devtool: "source-map",
  resolve: {
    extensions: [".js", "*"]
  }
};