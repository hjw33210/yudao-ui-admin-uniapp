# unibest 上游合并总览

## 背景

- 截图起始提交：`05cb9eba9c4886fa059315758eb468418fffee2f`
- 当前项目分支：`master`
- 合并计划创建时 HEAD：`d50300dd`
- 2026-05 低风险项实施前 HEAD：`880d31f4`
- 当前项目与 `origin/main`（`codercup/unibest`）的 merge-base：`05cb9eba9c4886fa059315758eb468418fffee2f`
- 按要求克隆过的仓库：`https://github.com/uni-run/unibest.git`
- 原临时克隆目录：`/tmp/unibest.JX5Sbf/unibest`，当前已不是 git repo，不能作为后续实施依据

重要结论：`05cb9eba` 不在新 `uni-run/unibest` 当前 refs 中，但存在于当前项目已有的 `origin/main`（`codercup/unibest`）历史里。截图提交线更像是旧 `codercup/unibest` 远端历史；2026-05 之后的新提交来自 `uni-run/unibest`。

## 实施前置条件

- 当前仓库已配置 `uni-run/unibest` remote。
- 已执行 `git fetch unibest main`，2026-05 提交（`03e115f6` 到 `1a1e2531`）已经在当前 object store。
- 后续继续实施新月份前，仍建议先执行类似命令刷新上游：

```bash
git fetch unibest main
```

- 当前工作区存在其他已暂存文件，例如 `.playwright-cli/**`、`AGENTS.md`、`tmp/**` 和若干 changelog 文件；实施时不要混入本次上游合并提交。

## 总体策略

不建议整段 merge 或 cherry-pick。建议按月份推进，但每个月内部仍按“完全合并 / 部分合并 / 忽略”处理。

优先级建议：

- 先做低风险小改：微信小程序 baseUrl、devtools CLI path、`tabBar` fallback、import-sort、native plugin copy 日志。
- `b9ef57a5` 作为一个 2026-02 统一提取包处理，不拆到多个批次。
- tabbar 同步修复单独做专项；它不是低风险项。
- CLI、demo、模板文档、changesets、版本号类改动默认忽略。

## 月度文档

| 月份 | 文档 | 结论 |
| --- | --- | --- |
| 2025-12 | [2025-12.md](./2025-12.md) | 已合并依赖、Vite 配置和初始化脚本低风险项；tabbar 暂不合并。 |
| 2026-01 | [2026-01.md](./2026-01.md) | 已合并 dev-tools 输出目录选择和 router 路由不存在判断修复。 |
| 2026-02 | [2026-02.md](./2026-02.md) | 已部分合并 `b9ef57a5` 的 token 响应式和 `SKIP_OPEN_DEVTOOLS`；未引入 CLI、demo、upload 和依赖升级。 |
| 2026-03 | [2026-03.md](./2026-03.md) | 已部分合并 `7ccd1640` 的 `bump-version` 和 H5 dev Eruda；角色 tabbar 单独立需求。 |
| 2026-04 | [2026-04.md](./2026-04.md) | 已合并 `UniOptimization` 平台限制和 VS Code TypeScript SDK 配置；CLI Wot UI 2 提交跳过。 |
| 2026-05 | [2026-05.md](./2026-05.md) | 已合并低风险配置修复；tabbar 同步单独专项。 |

## 建议分支

- 2026-05 低风险项：`codex/unibest-2026-05-low-risk`
- 2026-05 tabbar 专项：`codex/unibest-2026-05-tabbar-sync`
- 2026-02：`codex/unibest-2026-02-runtime-devtools`
- 2026-03：`codex/unibest-2026-03-tools`

## 基础验证要求

每个实施分支至少验证：

- `pnpm type-check`
- `pnpm lint`，如果已有历史 lint 问题，记录问题范围
- H5：`pnpm dev:h5` 后验证登录、首页、tabbar 五个入口、BPM 相关入口
- 微信小程序：`pnpm dev:mp-weixin` 或至少 `pnpm build:mp:prod`
- 如果改了 token：验证 access token 过期、refresh 成功、refresh 失败三条路径
- 如果改了 tabbar：验证 H5 和微信小程序两个端

## 已确认风险

- `b9ef57a5` dry-run cherry-pick 会在 `README.md`、`package.json`、`pnpm-lock.yaml`、`src/App.vue`、`src/http/interceptor.ts`、`src/pages/index/index.vue`、`src/router/interceptor.ts`、`src/store/token.ts`、`src/tabbar/config.ts`、`src/tabbar/index.vue`、`src/tabbar/store.ts`、`uno.config.ts`、`vite.config.ts` 产生冲突。
- 2026-05 tabbar 上游实现已经把 `tabbarList` 改成角色过滤的 `computed`，当前项目还是 `reactive` 数组；不能直接套 diff。
- 上游 tabbar 的 `setCurIdx` 没有当前项目登录态和白名单/黑名单 guard；移植时必须保留当前权限判断。
