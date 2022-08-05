import { preserveShebangs } from "rollup-plugin-preserve-shebangs";
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";
import path from "path";

module.exports = {
  input: "./src/global.js",
  output: {
    // file: "bundle.js",
    format: "esm",
    dir: "dist",
  },
  plugins: [
    // copy({
    //   targets: [{ src: "src/workspace.json", dest: "dist/" }],
    // }),
    preserveShebangs(),
    json(),
  ],
  // external: [path.resolve("./src/workspace.json")],
};
