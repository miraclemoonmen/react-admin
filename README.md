# WinRide-Console

`WinRide-Console` 是 WinRide 的管理端前端项目，使用 React 19、React Router 8、TypeScript 7、Vite 8、Tailwind CSS 4 和 Ant Design 6，保持 SPA 模式。

开始任何实现类协作前，默认先查阅 `AGENTS.md`、`docs/PROJECT_RULES.md`、`docs/COLLAB_RULES.md`、`docs/WORKING_LOG.md` 以及相关 `docs/req/*.md`。

## 当前事实

- 项目定位：WinRide 管理后台前端
- 当前状态：已有可运行的管理后台功能，以保留业务行为和接口契约的小步维护为主
- 配套后端：`/Users/heliang/private/WinRide-API`
- 配套用户端：`/Users/heliang/private/WinRide`
- 已有模块：登录、菜单、用户、角色权限、内容审核、举报、内容回收站、文件管理和操作日志

## 快速开始

使用 Node 24.x 和 npm 11.x；`.nvmrc` 为项目版本声明，不修改全局默认 Node。安装锁定依赖：

```bash
npm ci
```

启动开发环境：

```bash
npm run dev
```

常用校验：

```bash
npm run typecheck
npm run lint
npm run build
```

## 生产运行与构建约束

```bash
npm run build
npm start
```

- `ssr: false`，正式产物为 `build/client`；`npm start` 使用 `serve` 提供静态文件及 SPA 回退，默认端口 3000，可通过 `PORT` 修改。
- `/console` API 必须由部署入口的反向代理转发至后端。开发时 Vite 的代理不会自动带入生产静态服务；不要将 API 请求回退成 `index.html`。
- Docker 各阶段使用 Node 24；运行阶段不依赖开发依赖。Linux Alpine 容器仍需在具备 Docker 的环境实际验收。
- 类型检查由 TS 7 原生 `tsc` 执行；`typescript` 是 TS 6 Compiler API 兼容包别名，供 ESLint 等工具使用，额外的 `tsc6` 可用于兼容检查。业务代码仍由 Vite 构建。
- 保留 React Compiler 仅编译项目源码；`ANALYZE=true npm run build` 可生成本地 `stats.html` 分析报告，不提交该产物。
- Babel 暂留 7.x；React 插件尚未声明支持 ESLint 10，因此暂留已停止上游支持的 ESLint 9.x，后续需跟进兼容升级，不关闭现有检查规则。
- Tailwind 使用新版默认字体栈，不添加旧字体覆盖。

## 文档入口

- `AGENTS.md`：AI 协作入口和现场执行规则
- `docs/PROJECT_RULES.md`：长期工程规则、后台页面约束、接口接入和质量门槛
- `docs/COLLAB_RULES.md`：AI 协作、外部材料和跨仓库协作口径
- `docs/WORKING_LOG.md`：当前状态摘要、关键决定和活跃需求索引
- `docs/req/INDEX.md`：需求记录目录
- `docs/req/REQ_TEMPLATE.md`：单需求记录模板
- [管理端依赖与构建工具链升级](./docs/req/2026-08-26-frontend-dependency-upgrade.md)：版本、兼容修改、验证结果与未覆盖项

若文档之间出现冲突，长期工程规则以 `docs/PROJECT_RULES.md` 为准，当前状态以 `docs/WORKING_LOG.md` 为准，单需求细节以对应 `docs/req/*.md` 为准。
