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
Object.defineProperty(exports, "__esModule", { value: true });
exports.choiceEntry = void 0;
const zx_1 = require("zx");
const process_1 = require("process");
const vscode_js_1 = require("../code/vscode.js");
const utils_js_1 = require("../utils/utils.js");
function choiceEntry() {
    return __awaiter(this, void 0, void 0, function* () {
        let choices = [
            {
                name: "🆚 vsCode 打开项目",
                value: "vscode",
            },
            {
                name: "🌐 打开 chrome 调试",
                value: "chrome",
            },
            {
                name: "🖌 vsCode 打开 个人markdown",
                value: "codem",
            },
            {
                name: "💭 启动 个人markdown 服务",
                value: "markserve",
            },
        ];
        choices = (0, utils_js_1.inquirerAddCloseoption)(choices);
        const opitons = [
            {
                type: "list",
                name: "type",
                message: "你想干嘛",
                choices,
                pageSize: 20,
            },
        ];
        const inquirerResult = yield (0, utils_js_1.inquirerQuestion)(opitons);
        switch (inquirerResult.type) {
            case "vscode":
                (0, vscode_js_1.vsCode)();
                break;
            case "chrome":
                // node bin/index.js 与 zx bin/index.js打印的 process.argv不一样，后者会是 node zx bin/index 多了zx
                yield (0, zx_1.$) `../chrome.js`;
                break;
            case "markserve":
                yield (0, zx_1.$) `../mark/markdown.mjs`;
                break;
            case "codem":
                console.log(zx_1.chalk.yellow("vscode 打开笔记!"));
                yield (0, zx_1.$) `../mark/markdown.mjs code`;
                break;
            default:
                (0, process_1.exit)();
                break;
        }
    });
}
exports.choiceEntry = choiceEntry;
