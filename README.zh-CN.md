# T3 Code 简体中文稳定版分支

这是由 Michaelihc 维护的非官方简体中文分支，基于 [T3 Code 官方稳定版](https://github.com/pingdotgg/t3code)及 [ZhiweiXiao98 的汉化实现](https://github.com/ZhiweiXiao98/t3code)，与官方团队没有隶属关系。

当前源码基于上游 **v0.1.1**，包含其完整提交 `fe27e8e3dc12dcbb108e9a28fd9b8cb65f34ae92`。`main` 跟进官方稳定发布。

## 下载与运行

- [Windows x64 安装程序（0.1.1-zh.1）](https://github.com/Michaelihc/t3code-zh-cn/releases/download/v0.1.1-zh.1/T3-Code-0.1.1-zh.1-x64.exe) · [发布说明与校验值](https://github.com/Michaelihc/t3code-zh-cn/releases/tag/v0.1.1-zh.1)
- [源码验证结果](https://github.com/Michaelihc/t3code-zh-cn/actions/workflows/client-release.yml)

此 Windows 安装包是基于官方稳定版 v0.1.1 的未签名社区预发布，应用名称沿用上游的 **T3 Code (Beta)**。官方网页上的安装程序及 `npx t3` 安装的是官方英文版。汉化桌面版使用手动下载，不提供自动更新源。

从 nightly 切换前，请先关闭其他 T3 桌面应用并备份现有数据。安装包沿用上游的应用标识和 Electron 配置目录。若要隔离服务端数据，请每次启动时指定独立的 `T3CODE_HOME`。例如，在 PowerShell 中将下列程序路径替换为实际安装路径：

```powershell
$env:T3CODE_HOME = "$env:USERPROFILE\.t3-zh-cn"
& "C:\path\to\T3 Code (Beta).exe"
```

该环境变量仅对当前 PowerShell 会话生效，每次启动汉化版时都需要指定。它隔离的是服务端数据；Electron 配置目录仍然共用，因此启动前请关闭其他 T3 桌面应用。

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
