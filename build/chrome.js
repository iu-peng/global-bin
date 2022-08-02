#!/usr/bin/env node
"use strict";
/**
 * 打开调试
 */
const achild_process = require("child_process");
const user = "doge";
console.log("user---", process.argv);
// achild_process.exec(
//   `open -n /Applications/Google\\ Chrome.app/ --args -u http://localhost:8081/debugger-ui/ --disable-web-security --user-data-dir=/Users/${user}/data`,
//   (err, stdout, stderr) => {
//     console.log("** --- 执行结果 --- **", err, stdout, stderr) // wsp-log
//   },
// )
achild_process.exec(`open -n /Applications/Microsoft\\ Edge.app/ --args -u http://localhost:8081/debugger-ui/ --disable-web-security --user-data-dir=/Users/${user}/data`, (err, stdout, stderr) => {
    console.log("** --- 执行结果 --- **", err ? "失败" : "成功", stdout, stderr); // wsp-log
});
