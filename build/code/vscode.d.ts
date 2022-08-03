/**
 * vsCode 通过 workspace.json 中指定的 key 打开项目
 * 功能：
 * 1. q code <name> 打开 workspace.json 中 commonPath下的目录
 * 2. q code <key> 打开 workspace.json 中 指定的项目
 * 3. q code 提供选择项目，然后打开
 * @param {string} projectKey 打开的项目列表的key
 */
export declare function vsCode(projectKey: any): Promise<void>;
