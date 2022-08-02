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
exports.inquirerAddCloseoption = exports.inquirerQuestion = exports.toPromise = exports.successlog = exports.infologExit = exports.errlogExit = exports.errlog = void 0;
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
/**
 * 错误 log 输出
 * @param {string} msg 错误信息
 */
function errlog(msg) {
    console.log(chalk_1.default.red("❌ " + msg));
}
exports.errlog = errlog;
/**
 * 错误 log 输出 并退出
 * @param {string} msg 错误信息
 */
function errlogExit(msg) {
    console.log(chalk_1.default.red("❌ " + msg));
    process.exit();
}
exports.errlogExit = errlogExit;
/**
 * info log 输出 并退出
 * @param {string} msg 错误信息
 */
function infologExit(msg) {
    console.log(chalk_1.default.yellow("❕ " + msg));
    process.exit();
}
exports.infologExit = infologExit;
/**
 * 成功的log
 * @param {string} msg 成功信息
 */
function successlog(msg) {
    console.log(chalk_1.default.greenBright("✅ " + msg));
}
exports.successlog = successlog;
// node函数封装为promise风格
function toPromise(func) {
    return (...arg) => {
        return new Promise((resolve, reject) => {
            func(...arg, (err, data) => {
                if (!err)
                    resolve({ result: true, data });
                else
                    resolve({ result: false, err });
            });
        });
    };
}
exports.toPromise = toPromise;
/**
 * inquirer 命令行选择
 * @param {array} options inquirer 参数
 */
function inquirerQuestion(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const inquirerResult = yield inquirer_1.default.prompt(options);
        return inquirerResult;
    });
}
exports.inquirerQuestion = inquirerQuestion;
function inquirerAddCloseoption(option = []) {
    option.push({
        name: "❌ 关闭",
        value: "",
    });
    option.forEach((i, d) => option.splice(d * 2 + 0, 0, new inquirer_1.default.Separator("〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️")));
    return option;
}
exports.inquirerAddCloseoption = inquirerAddCloseoption;
