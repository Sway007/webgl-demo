const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  devtool: false,
  plugins: [new CleanWebpackPlugin()],
};
