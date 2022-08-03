var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from "chalk";
import inquirer from "inquirer";
/**
 * 错误 log 输出
 * @param {string} msg 错误信息
 */
export function errlog(msg) {
    console.log(chalk.red("❌ " + msg));
}
/**
 * 错误 log 输出 并退出
 * @param {string} msg 错误信息
 */
export function errlogExit(msg) {
    console.log(chalk.red("❌ " + msg));
    process.exit();
}
/**
 * info log 输出 并退出
 * @param {string} msg 错误信息
 */
export function infologExit(msg) {
    console.log(chalk.yellow("❕ " + msg));
    process.exit();
}
/**
 * 成功的log
 * @param {string} msg 成功信息
 */
export function successlog(msg) {
    console.log(chalk.greenBright("✅ " + msg));
}
// node函数封装为promise风格
export function toPromise(func) {
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
/**
 * inquirer 命令行选择
 * @param {array} options inquirer 参数
 */
export function inquirerQuestion(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const inquirerResult = yield inquirer.prompt(options);
        return inquirerResult;
    });
}
export function inquirerAddCloseoption(option = []) {
    option.push({
        name: "❌ 关闭",
        value: "",
    });
    option.forEach((i, d) => option.splice(d * 2 + 0, 0, new inquirer.Separator("〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️")));
    return option;
}
