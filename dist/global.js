#!/usr/bin/env node
import { program } from 'commander';
import path from 'path';
import { $, fs, chalk as chalk$1 } from 'zx';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { exit } from 'process';

/**
 * 错误 log 输出
 * @param {string} msg 错误信息
 */
function errlog(msg) {
  console.log(chalk.red("❌ " + msg));
}

/**
 * 错误 log 输出 并退出
 * @param {string} msg 错误信息
 */
function errlogExit(msg) {
  console.log(chalk.red("❌ " + msg));
  process.exit();
}

/**
 * info log 输出 并退出
 * @param {string} msg 错误信息
 */
function infologExit(msg) {
  console.log(chalk.yellow("❕ " + msg));
  process.exit();
}

/**
 * 成功的log
 * @param {string} msg 成功信息
 */
function successlog(msg) {
  console.log(chalk.greenBright("✅ " + msg));
}

// node函数封装为promise风格
function toPromise(func) {
  return (...arg) => {
    return new Promise((resolve, reject) => {
      func(...arg, (err, data) => {
        if (!err) resolve({ result: true, data });
        else resolve({ result: false, err });
      });
    });
  };
}

/**
 * inquirer 命令行选择
 * @param {array} options inquirer 参数
 */
async function inquirerQuestion(options) {
  const inquirerResult = await inquirer.prompt(options);
  return inquirerResult;
}

function inquirerAddCloseoption(option = []) {
  option.push({
    name: "❌ 关闭",
    value: "",
  });
  option.forEach((i, d) =>
    option.splice(d * 2 + 0, 0, new inquirer.Separator("〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️"))
  );

  return option;
}

var commonPath = "/Users/doge/Documents/work";
var workJson = {
	commonPath: commonPath,
	"Duty 项目": {
	path: "",
	key: "duty"
},
	"抽奖 项目": {
	path: "/Users/doge/Documents/work/lottery",
	key: "lottery"
}
};

// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// const workJson = require("../workspace.json");

/**
 * vsCode 通过 workspace.json 中指定的 key 打开项目
 * 功能：
 * 1. q code <name> 打开 workspace.json 中 commonPath下的目录
 * 2. q code <key> 打开 workspace.json 中 指定的项目
 * 3. q code 提供选择项目，然后打开
 * @param {string} projectKey 打开的项目列表的key
 */
async function vsCode(projectKey) {
  if (projectKey === "") return infologExit("别怂，找不到就退出");
  // 没有指定项目 就通过选择进入
  if (!projectKey) {
    const choiceResult = await inquirerChoice();
    vsCode(choiceResult.project);
    return;
  }

  // 通过指定的json数据中获取对应项目信息
  const projectData = await getProjectData(projectKey);
  // 找到了目标对象 ||  如果是数组 & 数组有值
  if (!projectData || (Array.isArray(projectData) && !projectData.length)) {
    errlogExit("未找到该项目，你再好好想想，输的对吗！");
  }

  // 模糊结果
  if (projectData.length) {
    const blurResult = await repeatChoice(projectData);
    vsCode(blurResult.project);
    return;
  }

  // 是否有指定的路径
  const targetHasPath = projectData.path;

  if (targetHasPath) {
    await $`code ${targetHasPath}`;
    successlog(`${projectKey} 打开成功`);
  } else {
    // 项目在同一个文件夹下的公共目录位置
    const workDir = workJson.commonPath;
    const projectDir = path.resolve(workDir, projectKey);
    await $`code ${projectDir}`;
    successlog(`${projectKey} 打开成功`);
  }
}

// 获取json数据中对应项目的信息
async function getProjectData(key) {
  const commonAndJsonProjectDatas = await combineCommonpathAndworkspaceJson();
  // 模糊查询
  const blurTargets = [];

  for (const projectKey in commonAndJsonProjectDatas) {
    if (
      Object.hasOwnProperty.call(commonAndJsonProjectDatas, projectKey) &&
      typeof commonAndJsonProjectDatas[projectKey] === "object"
    ) {
      const target = commonAndJsonProjectDatas[projectKey];
      if (target.key === key) {
        return target;
      }
      if (target.key?.includes(key) || projectKey.includes(key)) {
        blurTargets.push(target);
      }
    }
  }
  return blurTargets;
}

// 主面板 - 选择项目
async function inquirerChoice() {
  const commonAndJsonProjectDatas = await combineCommonpathAndworkspaceJson();

  const option = {
    type: "list",
    name: "project",
    message: "选择需要打开的项目",
    loop: true,
    pageSize: 10,
  };

  const choices = [];
  for (const key in commonAndJsonProjectDatas) {
    if (
      Object.hasOwnProperty.call(commonAndJsonProjectDatas, key) &&
      typeof commonAndJsonProjectDatas[key] === "object"
    ) {
      const target = commonAndJsonProjectDatas[key];
      choices.push({
        name: key,
        value: target.key,
      });
    }
  }
  option.choices = inquirerAddCloseoption(choices);

  return inquirerQuestion([option]);
}
// 提示 - 选择项目
async function repeatChoice(data) {
  const option = {
    type: "list",
    name: "project",
    message: "你是要打开哪个项目",
    loop: true,
    pageSize: 10,
  };

  const choices = data.map((i) => ({
    name: i.key,
    value: i.key,
  }));
  option.choices = inquirerAddCloseoption(choices);

  return inquirerQuestion([option]);
}

/**
 * 获取 workspace.json 下的 commonPath 中的所有标准项目
 */
async function getCommonPathProjects() {
  const projectDatas = {};
  const workDir = workJson.commonPath;
  const dirDatas = await toPromise(fs.readdir)(workDir);
  // 异步问题 此处可以用 for of等待
  for (const item of dirDatas.data) {
    const statInfo = await toPromise(fs.stat)(path.resolve(workDir, item));
    // 是否是文件夹格式
    if (statInfo.result && statInfo.data.isDirectory()) {
      const hasPackageJson = await toPromise(fs.access)(
        path.resolve(workDir, item, "package.json")
      );
      // 文件夹下是否有package.json文件
      if (hasPackageJson.result) {
        projectDatas[item] = {
          key: item,
          path: path.resolve(workDir, item),
        };
      }
    }
  }
  return projectDatas;
}

async function combineCommonpathAndworkspaceJson() {
  const commonPathProjectDatas = await getCommonPathProjects();
  const commonAndJsonProjectDatas = {
    ...workJson,
    ...commonPathProjectDatas,
  };
  return commonAndJsonProjectDatas;
}

// 当前文件的绝对路径
const dirname = import.meta.url.replace("file:", "");

async function choiceEntry() {
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
      console.log(chalk$1.yellow("vscode 打开笔记!"));
      await $`${path.join(dirname, "../../mark/markdown.mjs")} code`;
      break;
    default: // wsp-log
      exit();
      break;
  }
}

var name = "@sroc/custom-bin";
var version = "0.1.0";
var description = "Customize the global package command";
var main = "index.js";
var scripts = {
	test: "echo \"Error: no test specified\" && exit 1"
};
var bin = {
	q: "./src/global.js"
};
var type = "module";
var keywords = [
	"global bin",
	"custom bin",
	"package.json bin",
	"全局命令"
];
var homepage = "https://github.com/iu-peng/global-bin";
var author = "";
var license = "ISC";
var dependencies = {
	chalk: "^5.0.1",
	commander: "^9.4.0",
	inquirer: "^9.0.2",
	zx: "^7.0.7"
};
var devDependencies = {
	"@rollup/plugin-json": "^4.1.0",
	rollup: "^2.77.2",
	"rollup-plugin-copy": "^3.4.0",
	"rollup-plugin-preserve-shebangs": "^0.2.0"
};
var packageJson = {
	name: name,
	version: version,
	description: description,
	main: main,
	scripts: scripts,
	bin: bin,
	type: type,
	keywords: keywords,
	homepage: homepage,
	author: author,
	license: license,
	dependencies: dependencies,
	devDependencies: devDependencies
};

program
  .version(packageJson.version, "-v, -V, --version")
  .command("code [name]")
  .description("[name]: 需要通过 Vscode 打开 work 目录下的工程名字")
  .action(vsCode)
  .exitOverride((err) => errlog("工程名称必填"));

if (process.argv.length < 3) {
  choiceEntry();
} else {
  program.parse(process.argv);
}
