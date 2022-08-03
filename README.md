# 自定义全局快捷命令

> 自己定义的工作常用快捷命令
>
> 功能如下：
> 1\. 直接输入 q 命令，提供命令行选择功能菜单
> 2\. 命令 q code，来选择vscode命令打开选择项目
> 3\. 命令 q code aa，如果有该项目，则打开，否则会模糊搜索

## install

推荐glone下来，修改完`src/code/workspace.json`，然后项目中执行npm link 链接到全局使用，然后就可以自定义自己的命令了



由于是我自己的配置，所以本人直接可以

```bash
yarn global add @sroc/custom-bin
```

之后就可以在terminal中输入`q` 命令了



`code`命令打开的项目是 `src/code/workspace.json`中定义的`commonPath`下的文件夹（带`package.json`）项目，和同级的项目列表合集。



## 效果如下

![](image/image_mi8j3EjWmM.png)

![](image/image_vSmL_JVqUT.png)