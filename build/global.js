#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const vscode_1 = require("./code/vscode");
const utils_js_1 = require("./utils/utils.js");
const index_js_1 = require("./select/index.js");
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
const packageJson = require("../package.json");
commander_1.program
    .version(packageJson.version, "-v, -V, --version")
    .command("code [name]")
    .description("[name]: 需要通过 Vscode 打开 work 目录下的工程名字")
    .action(vscode_1.vsCode)
    .exitOverride((err) => (0, utils_js_1.errlog)("工程名称必填"));
if (process.argv.length < 3) {
    (0, index_js_1.choiceEntry)();
}
else {
    // console.log("program", program.opts(), program.args, process.argv);
    commander_1.program.parse(process.argv);
}
