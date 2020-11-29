const { merge } = require("webpack-merge");
const baseConfig = require("./config/webpack.common");
const devConfig = require("./config/webpack.dev");
const prodConfig = require("./config/webpack.prod");
const chalk = require("chalk");

module.exports = (env, argv) => {
  const mode = argv.mode || "development";
  console.log(chalk.blue("Mode: ") + chalk.bold.green(mode));

  switch (mode) {
    case "production":
      return merge({ mode }, baseConfig, prodConfig);
    case "development":
      return merge({ mode }, baseConfig, devConfig);
    default:
      throw new Error(`No matching mode: ${mode} configuration was found!`);
  }
};
