#!/usr/bin/env zx
import chalk from "chalk";

const isCode = process.argv.slice(-1)[0] === "code";

if (isCode) {
  await $`code ~/Documents/work/oc/markdown-notes/markdown`;
} else {
  console.log(chalk.yellow("笔记 Server 启动中!"));
  const res =
    await $`cd ~/Documents/work/oc/markdown-notes/markdown && yarn start -p 3333`;
  console.log(
    res.stderr
      ? chalk.red(`笔记 Server 启动失败! \n${res.stderr}`)
      : chalk.yellow("笔记 Server 启动成功!")
  );
}
