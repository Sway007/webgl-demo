const { merge } = require("webpack-merge");
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const chalk = require("chalk");

const configCommin = require("./config/webpack.common");
const configDev = require("./config/webpack.dev");

const config = merge({ mode: "development" }, configCommin, configDev);
const webpackCompiler = webpack(config);
const app = express();
let port = process.env.PORT || 8080;

app.use(webpackDevMiddleware(webpackCompiler, configDev.devServer));

const hostname = "localhost";
let count = 1; // 最大重试次数
const cbOK = () => {
  console.log(
    "server address: " + `http://${chalk.green(hostname)}:${chalk.yellow(port)}`
  );
};
const cbError = (e) => {
  if (e && e.code === "EADDRINUSE") {
    if (count >= 10) {
      console.log(
        chalk.bgRedBright(`Server closed after retried ${count} times`)
      );
      process.exit(0);
    }
    console.log(`Port ${chalk.red(port)} in use, retring ... ${count}`);
    count += 1;
    port += 1;
    setTimeout(() => {
      app.listen(port, hostname, cbOK).on("error", cbError);
    }, 500);
  }
};
app.listen(port, hostname, cbOK).on("error", cbError);

// File Watch 使用nodemon实现，Hot Relaod 暂未实现
