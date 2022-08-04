# 自定义全局快捷命令

自定义 package.json bin 命令

> 自己定义的工作常用快捷命令
>
> 功能如下：
> 1\. 直接输入 q 命令，提供命令行选择功能菜单
> 2\. 命令 q code，来选择 vscode 命令打开选择项目
> 3\. 命令 q code aa，如果有该项目，则打开，否则会模糊搜索

## install

推荐 glone 下来，修改完`src/workspace.json`，然后项目中执行 npm link 链接到全局使用，然后就可以自定义自己的命令了

由于是我自己的配置，所以本人直接可以

```bash
yarn global add @sroc/custom-bin
```

之后就可以在 terminal 中输入`q` 命令了

`code`命令打开的项目是 `src/workspace.json`中定义的`commonPath`下的文件夹（带`package.json`）项目，和同级的项目列表合集。

## 扩展 bin

如果想添加其他全局命令，可以在项目 bin 目录下新建文件，`package.json` 的 `bin` 采用对象形式，value 必须是指向 bin 目录内的文件，否则会不生效

## 效果如下

![](https://github.com/iu-peng/global-bin/blob/main/image/image_mi8j3EjWmM.png)

![](https://github.com/iu-peng/global-bin/blob/main/image/image_vSmL_JVqUT.png)
