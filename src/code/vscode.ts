import path from "path";
import fs from "fs";
// import { $, fs } from "zx";
import {
  successlog,
  errlogExit,
  infologExit,
  inquirerQuestion,
  inquirerAddCloseoption,
  toPromise,
} from "../utils/utils.js";

// import workJson from "./workspace.json" assert { type: "json" };

// const workJson = require("./workspace.json");
import workJson from "./workspace.json" assert { type: "json" };

/**
 * vsCode 通过 workspace.json 中指定的 key 打开项目
 * 功能：
 * 1. q code <name> 打开 workspace.json 中 commonPath下的目录
 * 2. q code <key> 打开 workspace.json 中 指定的项目
 * 3. q code 提供选择项目，然后打开
 * @param {string} projectKey 打开的项目列表的key
 */
export async function vsCode(projectKey) {
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
    // await $`code ${targetHasPath}`;
    successlog(`${projectKey} 打开成功`);
  } else {
    // 项目在同一个文件夹下的公共目录位置
    const workDir = workJson.commonPath;
    const projectDir = path.resolve(workDir, projectKey);
    // await $`code ${projectDir}`;
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
    pageSize: 50,
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
    pageSize: 50,
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
