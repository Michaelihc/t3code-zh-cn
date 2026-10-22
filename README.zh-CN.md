# T3 Code 简体中文稳定版分支

这是由 Michaelihc 维护的非官方简体中文分支，基于 [T3 Code 官方稳定版](https://github.com/pingdotgg/t3code)及 [ZhiweiXiao98 的汉化实现](https://github.com/ZhiweiXiao98/t3code)，与官方团队没有隶属关系。

当前源码基于上游 **v0.1.1**，包含其完整提交 `fe27e8e3dc12dcbb108e9a28fd9b8cb65f34ae92`。`main` 跟进官方稳定发布。

## 下载与运行

- [本分支 Releases](https://github.com/Michaelihc/t3code-zh-cn/releases)：当前尚未发布安装包。
- [源码验证结果](https://github.com/Michaelihc/t3code-zh-cn/actions/workflows/client-release.yml)

官方网页上的安装程序及 `npx t3` 安装的是官方英文版。汉化桌面版使用手动下载，不提供自动更新源。

从源码运行需要 Node.js `^24.13.1` 和 [Vite+](https://viteplus.dev/)，依赖版本由仓库锁定：

```sh
vp install --frozen-lockfile
vp run dev --home-dir ./.t3
```

请打开启动日志中的完整配对地址。这里显式指定了工作目录内的数据路径。

## 切换语言

打开 `Settings → General → Language`，选择 `简体中文`、`English` 或 `跟随系统`。

网页及桌面界面已汉化，包括设置、任务、项目、Pull Request、用量统计、常用弹窗和桌面原生菜单。模型名称、命令、快捷键、路径、URL、终端输出、Agent 回复和第三方原始错误保留原文。Windows 托盘菜单在启动时读取语言，切换语言后重启应用即可同步。

Android 源码继承了社区汉化，但本仓库尚无经过签名的 Android 安装包。官方 iOS 应用为英文版。

## 维护与反馈

- 仓库：[Michaelihc/t3code-zh-cn](https://github.com/Michaelihc/t3code-zh-cn)
- 问题反馈：[Issues](https://github.com/Michaelihc/t3code-zh-cn/issues)
- 维护说明：[Stable localization maintenance](./docs/operations/stable-localization.md)

源码更新与客户端发布分开执行。只有已提交到 `main` 并经过验证的源码可以进入客户端候选构建；发布使用独立工作流。

## 许可证

本项目保留上游和原汉化分支的提交历史，沿用 [MIT License](./LICENSE)。原始汉化作者：肖志伟。
