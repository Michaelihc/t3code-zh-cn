# Stable localization maintenance

This repository tracks official stable releases of `pingdotgg/t3code`. Chinese localization comes from `ZhiweiXiao98/t3code`; preserve attribution and history when importing improvements.

## Update source

1. Fetch the official stable tag and merge it in a task worktree. Keep new work on a task branch until ready.
2. Adapt Chinese translations and callers in web, desktop, and mobile. Run focused localization tests and typechecks for affected clients.
3. Update `UPSTREAM_VERSION` and `CLIENT_VERSION` in `.github/workflows/client-release.yml`, the version references in `.github/workflows/publish-client-candidate.yml`, and the READMEs. Use an official stable base such as `v0.1.1` and a Chinese version such as `0.1.1-zh.1`.
4. Push the task branch without tags. The client workflow validates `chore/**`, `fix/**`, and `feat/**` branches as well as `main`, running lint, typechecks, and tests. Its source gate requires the stable tag to be an ancestor of the selected commit. Merge ready, validated changes into clean, committed `main`.

Only `client-release.yml` and `publish-client-candidate.yml` are enabled in this repository. Keep inherited upstream nightly, deployment, and publication workflows disabled in GitHub Actions settings.

## Build and publish separately

Source validation does not create client artifacts. For a release pass, dispatch **简体中文客户端验证与构建** on `main`, set `expected_sha` to its full committed SHA, and enable `build_clients`. Set `client_targets` to `windows` for a Windows x64 installer with the embedded WSL runtime, or `all` for every client candidate. Candidate artifacts include unsigned desktop packages and an unsigned, non-installable Android candidate. Inspect the actual packages before publication.

Dispatch **发布已验证的简体中文客户端** only when publishing is requested. It requires the successful candidate run, its exact source SHA, and artifact review. Select the same `client_targets` value as the reviewed build. It verifies provenance and publishes those existing desktop artifacts without rebuilding. Android publication remains separate and requires a signing identity.

Chinese desktop versions have no automatic update feed. Downloads and provenance belong to `Michaelihc/t3code-zh-cn`; the original Chinese repository and official T3 Code releases are upstream sources, not this fork's update channel.
