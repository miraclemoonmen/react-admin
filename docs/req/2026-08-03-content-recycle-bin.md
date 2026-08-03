# 2026-08-03 内容软删除与恢复

## 目标

- 在管理台统一处理帖子与评论的软删除和恢复。
- 删除要求二次确认和必填原因；恢复使用独立确认，不提供批量操作。

## 实现

- 新增路由 `/sys/content` 和动态菜单默认参数。
- 帖子、评论使用 Tab 切换，支持正常/已删除、审核状态、关键词和创建时间筛选。
- 列表支持详情、删除和恢复；详情展示图片、地点、作者、删除来源、原因、时间与操作人。
- 作者主动删除不显示恢复；历史无批次内容提示不可自动恢复；一级评论级联删除的回复提示从一级评论恢复。
- 接口封装集中在 `app/services/content.ts`，类型集中在 `app/types/api.ts`。

## 接口

- 列表与详情：`GET /console/content/{posts|comments}`。
- 删除：`POST /console/content/{posts|comments}/{id}/delete`，请求体 `{ reason }`。
- 恢复：`POST /console/content/{posts|comments}/{id}/restore`。

## 验证

- `npm run lint`、`npm run typecheck`、`npm run build` 均通过。
- 后端数据库迁移尚未在非本地数据库执行，因此当前未做真实登录态点击联调。
