#!/usr/bin/env node

import { $, chalk } from "zx";
import inquirer from "inquirer";
import { exit } from "process";

const inquirerResult = await inquirer.prompt([
  {
    type: "list",
    name: "type",
    message: "你想干嘛",
    choices: [
      {
        name: "打开 chrome 调试",
        value: "chrome",
      },
      {
        name: "vsCode 打开 个人markdown",
        value: "codem",
      },
      {
        name: "启动 个人markdown 服务",
        value: "markserve",
      },
      {
        name: "关闭",
        value: "",
      },
    ],
  },
]);

switch (inquirerResult.type) {
  case "chrome":
    // node bin/index.js 与 zx bin/index.js打印的 process.argv不一样，后者会是 node zx bin/index 多了zx
    await $`bin/index.js`;
    break;
  case "markserve":
    await $`bin/mark/markdown.mjs`;
    break;
  case "codem":
    console.log(chalk.yellow("vscode 打开笔记!"));
    await $`bin/mark/markdown.mjs code`;
    break;
  default:
    exit();
    break;
}
