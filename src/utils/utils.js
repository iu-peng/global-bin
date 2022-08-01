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
export async function inquirerQuestion(options) {
  const inquirerResult = await inquirer.prompt(options);
  return inquirerResult;
}
