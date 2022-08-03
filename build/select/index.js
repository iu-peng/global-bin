var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { $, chalk } from "zx";
import { exit } from "process";
import { vsCode } from "../code/vscode.js";
import { inquirerAddCloseoption, inquirerQuestion } from "../utils/utils.js";
export function choiceEntry() {
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
        choices = inquirerAddCloseoption(choices);
        const opitons = [
            {
                type: "list",
                name: "type",
                message: "你想干嘛",
                choices,
                pageSize: 20,
            },
        ];
        const inquirerResult = yield inquirerQuestion(opitons);
        switch (inquirerResult.type) {
            case "vscode":
                vsCode();
                break;
            case "chrome":
                // node bin/index.js 与 zx bin/index.js打印的 process.argv不一样，后者会是 node zx bin/index 多了zx
                yield $ `../chrome.js`;
                break;
            case "markserve":
                yield $ `../mark/markdown.mjs`;
                break;
            case "codem":
                console.log(chalk.yellow("vscode 打开笔记!"));
                yield $ `../mark/markdown.mjs code`;
                break;
            default:
                exit();
                break;
        }
    });
}
