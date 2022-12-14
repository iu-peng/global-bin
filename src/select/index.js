import { $, chalk } from "zx";
import { exit } from "process";
import path from "path";
import { vsCode } from "../code/vscode.js";
import { inquirerAddCloseoption, inquirerQuestion } from "../utils/utils.js";

// 当前文件的绝对路径
const dirname = import.meta.url.replace("file:", "");

export async function choiceEntry() {
  let choices = [
    {
      name: "🆚 vsCode 打开项目",
      value: "vscode",
    },
    {
      name: "🌐 打开 chrome 调试",
      value: "chrome",
    },
    {
      name: "🖌 vsCode 打开 个人markdown",
      value: "codem",
    },
    {
      name: "💭 启动 个人markdown 服务",
      value: "markserve",
    },
  ];
  choices = inquirerAddCloseoption(choices);
  const opitons = [
    {
      type: "list",
      name: "type",
      message: "你想干嘛",
      choices,
      pageSize: 20,
    },
  ];
  const inquirerResult = await inquirerQuestion(opitons);

  switch (inquirerResult.type) {
    case "vscode":
      vsCode();
      break;
    case "chrome":
      // node bin/index.js 与 zx bin/index.js打印的 process.argv不一样，后者会是 node zx bin/index 多了zx
      await $`${path.join(dirname, "../../chrome.js")}`;
      break;
    case "markserve":
      await $`${path.join(dirname, "../../mark/markdown.mjs")}`;
      break;
    case "codem":
      console.log(chalk.yellow("vscode 打开笔记!"));
      await $`${path.join(dirname, "../../mark/markdown.mjs")} code`;
      break;
    default: // wsp-log
      exit();
      break;
  }
}
