# T3 Code — Simplified Chinese, stable upstream

This unofficial fork adds a Simplified Chinese interface to **official stable T3 Code releases**. The current source includes upstream **v0.1.1** (`fe27e8e3dc12dcbb108e9a28fd9b8cb65f34ae92`) and the Chinese community maintenance branch from [ZhiweiXiao98/t3code](https://github.com/ZhiweiXiao98/t3code).

[简体中文说明](./README.zh-CN.md) · [Releases](https://github.com/Michaelihc/t3code-zh-cn/releases) · [Validation](https://github.com/Michaelihc/t3code-zh-cn/actions/workflows/client-release.yml)

## Use the localized client

Choose **Settings → General → Language → 简体中文**. English and system-language selection are also available. Model names, commands, paths, terminal output, and agent replies keep their original text.

This repository currently provides source code; there are no installers published here yet. Installers and `npx t3` from the official T3 website install the official English version. Chinese desktop builds use manual downloads and have no automatic update feed.

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
