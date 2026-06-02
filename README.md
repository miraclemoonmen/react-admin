# WinRide-Console

`WinRide-Console` 是 WinRide 的管理端前端项目，当前以 React Router、React 19、TypeScript、Vite 和 Tailwind CSS 为基础。

开始任何实现类协作前，默认先查阅 `AGENTS.md`、`docs/PROJECT_RULES.md`、`docs/COLLAB_RULES.md`、`docs/WORKING_LOG.md` 以及相关 `docs/req/*.md`。

## 当前事实

- 项目定位：WinRide 管理后台前端
- 当前状态：仍接近 React Router 初始模板，适合按管理后台规范重新建设
- 配套后端：`/Users/heliang/private/WinRide-API`
- 配套用户端：`/Users/heliang/private/WinRide`
- 预期模块：登录、菜单、用户、角色、权限、内容审核、文件管理、操作日志等

## 快速开始

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

常用校验：

```bash
npm run typecheck
npm run build
```

## 文档入口

- `AGENTS.md`：AI 协作入口和现场执行规则
- `docs/PROJECT_RULES.md`：长期工程规则、后台页面约束、接口接入和质量门槛
- `docs/COLLAB_RULES.md`：AI 协作、外部材料和跨仓库协作口径
- `docs/WORKING_LOG.md`：当前状态摘要、关键决定和活跃需求索引
- `docs/req/INDEX.md`：需求记录目录
- `docs/req/REQ_TEMPLATE.md`：单需求记录模板

若文档之间出现冲突，长期工程规则以 `docs/PROJECT_RULES.md` 为准，当前状态以 `docs/WORKING_LOG.md` 为准，单需求细节以对应 `docs/req/*.md` 为准。
