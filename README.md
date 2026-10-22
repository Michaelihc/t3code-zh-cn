# T3 Code — Simplified Chinese, stable upstream

This unofficial fork adds a Simplified Chinese interface to **official stable T3 Code releases**. The current source includes upstream **v0.1.1** (`fe27e8e3dc12dcbb108e9a28fd9b8cb65f34ae92`) and the Chinese community maintenance branch from [ZhiweiXiao98/t3code](https://github.com/ZhiweiXiao98/t3code).

[简体中文说明](./README.zh-CN.md) · [Releases](https://github.com/Michaelihc/t3code-zh-cn/releases) · [Validation](https://github.com/Michaelihc/t3code-zh-cn/actions/workflows/client-release.yml)

## Use the localized client

Choose **Settings → General → Language → 简体中文**. English and system-language selection are also available. Model names, commands, paths, terminal output, and agent replies keep their original text.

Download the [Windows x64 installer (0.1.1-zh.1)](https://github.com/Michaelihc/t3code-zh-cn/releases/download/v0.1.1-zh.1/T3-Code-0.1.1-zh.1-x64.exe), or read the [release notes and checksums](https://github.com/Michaelihc/t3code-zh-cn/releases/tag/v0.1.1-zh.1). This is an unsigned community prerelease based on official stable v0.1.1. The Windows application name remains **T3 Code (Beta)**. Updates use manual downloads.

Installers and `npx t3` from the official T3 website install the official English version.

Close other T3 desktop apps and back up existing data before switching from nightly. This installer retains upstream's application identity and Electron profile. To keep server data separate, set `T3CODE_HOME` to a dedicated directory whenever launching this build. For example, in PowerShell, replace the executable path with your installed app:

```powershell
$env:T3CODE_HOME = "$env:USERPROFILE\.t3-zh-cn"
& "C:\path\to\T3 Code (Beta).exe"
```

The environment setting applies to that PowerShell session; use it each time you launch the localized app. It isolates server data; close other T3 desktop apps before launch because the Electron profile is shared.

Desktop and locally served web clients are localized. The inherited Android source is localized, but this repository has no signed Android release. The official iOS app is English-only.

## Run from source

Use Node.js `^24.13.1` and [Vite+](https://viteplus.dev/), with the package manager pinned in `package.json`:

```sh
vp install --frozen-lockfile
vp run dev --home-dir ./.t3
```

Open the full pairing URL printed by the development server. The explicit home directory keeps development data inside the checkout.

## Maintain this fork

`main` tracks stable releases. [Stable localization maintenance](./docs/operations/stable-localization.md) explains validation and the separate candidate-build and publication workflows. A source update does not publish or install a desktop release.

For general T3 Code guidance, see the [upstream project](https://github.com/pingdotgg/t3code) and [documentation](./docs/README.md).

## Credits and license

T3 Code is developed by [T3 Tools and its contributors](https://github.com/pingdotgg/t3code). Simplified Chinese localization originates from [ZhiweiXiao98/t3code](https://github.com/ZhiweiXiao98/t3code). This fork preserves their commit history and [MIT license](./LICENSE).
