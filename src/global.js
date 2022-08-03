#!/usr/bin/env node

import { program } from "commander";

import { vsCode } from "./code/vscode.js";
import { errlog } from "./utils/utils.js";
import { choiceEntry } from "./select/index.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const packageJson = require("../package.json");

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
