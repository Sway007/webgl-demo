const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  devtool: "inline-source-map",
  devServer: {
    liveReload: true,
    writeToDisk: true,
  },
  plugins: [new CleanWebpackPlugin()],
};
