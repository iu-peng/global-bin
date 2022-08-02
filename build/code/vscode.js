"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vsCode = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// import { $, fs } from "zx";
const utils_js_1 = require("../utils/utils.js");
// import workJson from "./workspace.json" assert { type: "json" };
const workJson = require("./workspace.json");
/**
 * vsCode 通过 workspace.json 中指定的 key 打开项目
 * 功能：
 * 1. q code <name> 打开 workspace.json 中 commonPath下的目录
 * 2. q code <key> 打开 workspace.json 中 指定的项目
 * 3. q code 提供选择项目，然后打开
 * @param {string} projectKey 打开的项目列表的key
 */
function vsCode(projectKey) {
    return __awaiter(this, void 0, void 0, function* () {
        if (projectKey === "")
            return (0, utils_js_1.infologExit)("别怂，找不到就退出");
        // 没有指定项目 就通过选择进入
        if (!projectKey) {
            const choiceResult = yield inquirerChoice();
            vsCode(choiceResult.project);
            return;
        }
        // 通过指定的json数据中获取对应项目信息
        const projectData = yield getProjectData(projectKey);
        // 找到了目标对象 ||  如果是数组 & 数组有值
        if (!projectData || (Array.isArray(projectData) && !projectData.length)) {
            (0, utils_js_1.errlogExit)("未找到该项目，你再好好想想，输的对吗！");
        }
        // 模糊结果
        if (projectData.length) {
            const blurResult = yield repeatChoice(projectData);
            vsCode(blurResult.project);
            return;
        }
        // 是否有指定的路径
        const targetHasPath = projectData.path;
        if (targetHasPath) {
            // await $`code ${targetHasPath}`;
            (0, utils_js_1.successlog)(`${projectKey} 打开成功`);
        }
        else {
            // 项目在同一个文件夹下的公共目录位置
            const workDir = workJson.commonPath;
            const projectDir = path_1.default.resolve(workDir, projectKey);
            // await $`code ${projectDir}`;
            (0, utils_js_1.successlog)(`${projectKey} 打开成功`);
        }
    });
}
exports.vsCode = vsCode;
// 获取json数据中对应项目的信息
function getProjectData(key) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const commonAndJsonProjectDatas = yield combineCommonpathAndworkspaceJson();
        // 模糊查询
        const blurTargets = [];
        for (const projectKey in commonAndJsonProjectDatas) {
            if (Object.hasOwnProperty.call(commonAndJsonProjectDatas, projectKey) &&
                typeof commonAndJsonProjectDatas[projectKey] === "object") {
                const target = commonAndJsonProjectDatas[projectKey];
                if (target.key === key) {
                    return target;
                }
                if (((_a = target.key) === null || _a === void 0 ? void 0 : _a.includes(key)) || projectKey.includes(key)) {
                    blurTargets.push(target);
                }
            }
        }
        return blurTargets;
    });
}
// 主面板 - 选择项目
function inquirerChoice() {
    return __awaiter(this, void 0, void 0, function* () {
        const commonAndJsonProjectDatas = yield combineCommonpathAndworkspaceJson();
        const option = {
            type: "list",
            name: "project",
            message: "选择需要打开的项目",
            loop: true,
            pageSize: 50,
        };
        const choices = [];
        for (const key in commonAndJsonProjectDatas) {
            if (Object.hasOwnProperty.call(commonAndJsonProjectDatas, key) &&
                typeof commonAndJsonProjectDatas[key] === "object") {
                const target = commonAndJsonProjectDatas[key];
                choices.push({
                    name: key,
                    value: target.key,
                });
            }
        }
        option.choices = (0, utils_js_1.inquirerAddCloseoption)(choices);
        return (0, utils_js_1.inquirerQuestion)([option]);
    });
}
// 提示 - 选择项目
function repeatChoice(data) {
    return __awaiter(this, void 0, void 0, function* () {
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
        option.choices = (0, utils_js_1.inquirerAddCloseoption)(choices);
        return (0, utils_js_1.inquirerQuestion)([option]);
    });
}
/**
 * 获取 workspace.json 下的 commonPath 中的所有标准项目
 */
function getCommonPathProjects() {
    return __awaiter(this, void 0, void 0, function* () {
        const projectDatas = {};
        const workDir = workJson.commonPath;
        const dirDatas = yield (0, utils_js_1.toPromise)(fs_1.default.readdir)(workDir);
        // 异步问题 此处可以用 for of等待
        for (const item of dirDatas.data) {
            const statInfo = yield (0, utils_js_1.toPromise)(fs_1.default.stat)(path_1.default.resolve(workDir, item));
            // 是否是文件夹格式
            if (statInfo.result && statInfo.data.isDirectory()) {
                const hasPackageJson = yield (0, utils_js_1.toPromise)(fs_1.default.access)(path_1.default.resolve(workDir, item, "package.json"));
                // 文件夹下是否有package.json文件
                if (hasPackageJson.result) {
                    projectDatas[item] = {
                        key: item,
                        path: path_1.default.resolve(workDir, item),
                    };
                }
            }
        }
        return projectDatas;
    });
}
function combineCommonpathAndworkspaceJson() {
    return __awaiter(this, void 0, void 0, function* () {
        const commonPathProjectDatas = yield getCommonPathProjects();
        const commonAndJsonProjectDatas = Object.assign(Object.assign({}, workJson), commonPathProjectDatas);
        return commonAndJsonProjectDatas;
    });
}
