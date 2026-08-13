# WORKING_LOG.md

## 当前状态

- 当前主线：将原 `dev` 的全部管理后台功能和性能优化归并至 `main`，后续以 `main` 为唯一开发主线。
- 管理台已覆盖登录、后台壳体、菜单、用户、角色权限、文件、日志、内容审核、举报和内容回收站。
- `/sys/content` 已支持帖子/评论、正常/已删除筛选、搜索、详情、删除原因确认和恢复确认。
- 当前下一步：后端迁移部署后，以包含 `sys:content:view/delete/restore` 的管理账号做登录态联调。
- 当前阻塞：后端数据库迁移尚未在非本地数据库执行。

## 已确认事项

- `WinRide-Console` 是 WinRide 的管理端前端项目。
- 配套后端为 `WinRide-API`，管理端接口优先参考后端 `com.winride.console` 模块。
- 原 `dev` 分支的全部提交已纳入 `main`，后续不再作为开发主线。

## 关键决定

- 管理端功能应围绕真实接口和权限模型分阶段推进。
- `docs/PROJECT_RULES.md` 是长期工程规则来源。
- `docs/WORKING_LOG.md` 只记录当前摘要和活跃索引。
- 单需求详细过程统一写入 `docs/req/*.md`。

## 验证

- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `npm run build`：通过。
- `git diff --check`：通过。
- `npm audit`：0 vulnerabilities。

## 活跃需求索引

- [2026-08-03 内容软删除与恢复](./req/2026-08-03-content-recycle-bin.md)
- [2026-08-13 前端性能与代码质量优化](./req/2026-08-13-frontend-performance.md)
- [2026-08-13 dev 完整归并 main](./req/2026-08-13-dev-merge-main.md)

## 历史需求索引

全量需求目录见 [`docs/req/INDEX.md`](./req/INDEX.md)。
