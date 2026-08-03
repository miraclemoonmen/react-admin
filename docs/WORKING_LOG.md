# WORKING_LOG

## 当前状态

- 当前主线：内容软删除与恢复工作台。
- `/sys/content` 已支持帖子/评论、正常/已删除筛选、搜索、详情、删除原因确认和恢复确认。
- 作者主动删除、历史无批次内容和一级评论级联删除的回复不提供恢复操作。
- 当前下一步：后端迁移部署后，以包含 `sys:content:view/delete/restore` 的管理账号做登录态联调。

## 验证

- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `npm run build`：通过；保留既有 Ant Design vendor chunk 体积提示。

## 活跃需求

- [2026-08-03 内容软删除与恢复](./req/2026-08-03-content-recycle-bin.md)
