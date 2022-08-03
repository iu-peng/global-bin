/**
 * 错误 log 输出
 * @param {string} msg 错误信息
 */
export declare function errlog(msg: any): void;
/**
 * 错误 log 输出 并退出
 * @param {string} msg 错误信息
 */
export declare function errlogExit(msg: any): void;
/**
 * info log 输出 并退出
 * @param {string} msg 错误信息
 */
export declare function infologExit(msg: any): void;
/**
 * 成功的log
 * @param {string} msg 成功信息
 */
export declare function successlog(msg: any): void;
export declare function toPromise(func: any): (...arg: any[]) => Promise<unknown>;
/**
 * inquirer 命令行选择
 * @param {array} options inquirer 参数
 */
export declare function inquirerQuestion(options: any): Promise<any>;
export declare function inquirerAddCloseoption(option?: never[]): never[];
