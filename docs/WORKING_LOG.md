# WORKING_LOG

## 当前状态

- 当前主线：前端性能与代码质量优化已完成，准备将 `dev` 完整合并至 `main`。
- `/sys/content` 已支持帖子/评论、正常/已删除筛选、搜索、详情、删除原因确认和恢复确认。
- 作者主动删除、历史无批次内容和一级评论级联删除的回复不提供恢复操作。
- 当前下一步：完成分支归并；后端迁移部署后，以包含 `sys:content:view/delete/restore` 的管理账号做登录态联调。

## 验证

- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `npm run build`：通过，已消除既有 Ant Design 单一 vendor 大块提示。
- `npm audit`：0 vulnerabilities。

## 活跃需求

- [2026-08-03 内容软删除与恢复](./req/2026-08-03-content-recycle-bin.md)
- [2026-08-13 前端性能与代码质量优化](./req/2026-08-13-frontend-performance.md)
