# 2026-08-13 前端性能与代码质量优化

## 目标

- 排查前端构建、查询、上传和公共状态链路中的性能问题。
- 统一重复的数据来源、格式化逻辑和接口命名，提高可读性与可维护性。
- 保持现有业务功能和接口契约不变。

## 实现

- React Compiler 仅处理项目源码，停止重复编译 `node_modules`；移除强制合并全部 Ant Design 模块的单一 vendor chunk。
- 表格查询改用原生 `URLSearchParams`，统一日期、数字、分页、防抖、重置和浏览器历史同步。
- 并发上传完成后的列表刷新合并执行，并补充 XHR 取消能力和 Blob URL 回收。
- 角色列表改为单一缓存来源并对并发请求去重，移除未产生响应式收益的 Zustand Store。
- 统一内容状态、删除来源、日期和文件大小格式化，整理含义模糊的接口方法名。
- 修复合法 falsy 请求体无法发送和 HTTP 错误状态被统一覆盖为 500 的问题。
- 移除未再使用的 `ahooks`、`qs` 和 `zustand`，统一 React Router 相关包版本并完成依赖安全更新。

## 验证

- `npm run typecheck`：通过。
- `npm run lint`：通过。
- `npm run build`：通过。
- `git diff --check`：通过。
- `npm audit`：0 vulnerabilities。

## 遗留事项

- 项目未配置单元测试脚本，本轮未覆盖自动化交互测试。
- 生产构建提示 React Router 8 的未来行为开关，当前未提前启用，避免在本轮引入行为变化。
