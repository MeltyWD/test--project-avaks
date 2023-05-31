const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "umd",
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
    fallback: {
      string_decoder: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts)?$/,
        use: ["ts-loader"],
        exclude: /node_modules/,
      },
    ],
  },
};
