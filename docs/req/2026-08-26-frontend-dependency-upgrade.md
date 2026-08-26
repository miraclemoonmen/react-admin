# 2026-08-26 管理端依赖与构建工具链升级

## 状态与目标

- 状态：依赖迁移、静态门禁及隔离运行回归完成；真实业务与 Linux 容器验收待补。用户已授权按下述分组提交并推送，不执行部署。
- 风险等级：重流程，涉及路由主干、编译器、构建和 UI 库兼容。
- 目标：参考用户端 `REQ-20260826-02` 的已验证组合，升级 Console 的兼容稳定依赖，保留管理后台现有功能和检查强度。
- 范围：仅管理端依赖、锁文件、Node 环境声明、构建/类型配置、必要的最小兼容修改与相关文档。

## 非范围与接口影响

- 不修改用户端或后端，不调整认证、401/403 分流、权限模型、菜单契约、请求封装或角色缓存边界。
- 保持 `ssr: false` 的 SPA 模式，不引入 SSR/RSC，不恢复已作废的超级管理员方案。
- 保留 React Compiler 仅编译业务源码、按需分析报告及既有分包行为；不搭车改版页面。
- 不使用预发布版本、强制 peer 安装或关闭类型/Lint 检查；临时测试、模拟接口和截图放在仓库外。
- 开始前已有工作摘要、需求索引及作废权限方案文档的本地改动，原样保留，不纳入本次业务修改。

## 实施顺序

1. 保存旧依赖/锁文件及本地文档差异，执行旧版检查并记录构建和运行基线。
2. 统一项目 Node 24/npm 11，同主版本基础依赖更新，重建锁文件。
3. 在 Router 7.18.2 核对 future 行为后，全套迁移 Router 8；保留客户端数据加载语义。
4. 迁移 TypeScript 6 配置，再采用 TS 7 原生检查器与 TS 6 Compiler API 兼容包。
5. 升级 Vite 8 及相关插件，移除 `vite-tsconfig-paths`，使用明确的源码 alias。
6. 升级 Motion、Ant Design、Day.js，并补齐图标等直接依赖声明。

## 验收要求

- 全新 `npm ci`、完整依赖树、审计、typecheck、lint、build 及差异检查。
- 开发及生产启动、深层路由直接访问/刷新、导航和错误边界。
- 登录/退出、401/403、菜单，表格查询/重置/分页/历史，以及表单、日期、抽屉、弹窗、图标、文件页动画与上传。
- 真实服务、登录态或容器不可用时明确记录未覆盖项；隔离测试不能替代真实业务联调。
- 不以单次耗时或不同 Node 环境的对比宣称稳定性能提升。

## 实际改动与验证

### 已落地版本与兼容修改

| 项目 | 实际版本/处理 |
| --- | --- |
| Node / npm | 项目声明 24.x / 11.x；本次运行 24.19.0 / 11.17.0，未修改全局 Node 25 默认值 |
| React / React DOM | 19.2.8 |
| React Router | react-router、dev、node 均为 8.3.0；先在 7.18.2 核对五项 future 行为，最终移除迁移开关 |
| TypeScript | TS 7.0.2 原生检查器；`typescript` 别名指向 @typescript/typescript6 6.0.2（Compiler API / tsc6 为 6.0.3） |
| Vite / Tailwind | 8.2.2 / 4.3.3 |
| Motion / Ant Design / Day.js | 13.1.1 / 6.6.1 / 1.11.23 |
| 图标 / 静态服务 | @ant-design/icons 6.3.2 显式声明；serve 14.2.6 替代 @react-router/serve |
| ESLint / Babel | 9.39.5 / 7.29.7；保留全部原有规则 |

- 删除旧 lock 后重新安装，最终 package 与 lock 配套；Router 主版本更新曾遇到旧树解析冲突，通过清理生成的依赖树与重建 lock 正常解决，未使用强制 peer 安装。
- TS 6 与 TS 7 检查均通过；移除 baseUrl 和 vite-tsconfig-paths，`~` 使用 Vite 明确源码 alias。
- Console 保持 SPA/clientLoader/clientAction；仅修正登录 action 和用户 loader 的客户端类型，不引入用户端 SSR 的请求上下文或 URL 处理。
- 新版 Babel 插件默认 include 只包含 JS，必须显式匹配本项目 JS/TS 源码，同时保留忽略带 query 模块的边界。React Compiler 保持启用，不处理 node_modules。
- Vite 保留原 JS 目标 Chrome/Edge 107、Firefox 104、Safari 16；不将其描述为全部 CSS/API 的兼容保证。不新增强制 vendor 分包。
- 新版 Hooks Lint 发现两个角色弹窗同步清空错误提示的问题：改为打开状态/角色变化时有条件地重置本组件提示，权限请求、勾选、回填、提交和缓存失效逻辑不变。
- 用户明确要求不保留旧字体栈：撤销曾试验的字体覆盖，`app/app.css` 最终与基准无差异，采用 Tailwind 新版默认字体。
- 升级前 `npm start` 已因 SPA 不产出 server 入口而失败；改为 `serve -s build/client --no-clipboard`，保留 PORT 配置。生产 API 仍需外部反向代理，本轮不改代理/认证边界。

### 已完成的静态与安装验证

- 旧版 typecheck、lint、build 均通过；旧版全部客户端 JS 为 36 文件，原始 1,632,743 字节，逐文件 gzip 535,681 字节。
- 基础依赖、Router 7 future、Router 8 实际安装、TS 7、Vite 8、最终 UI 依赖的分批 typecheck/lint/build 均通过。安装失败后的旧树检查不计入 Router 8 验收。
- 全新 npm ci、完整 npm ls --all、package/lock 根声明一致性检查通过；npm audit 为 0 项已知漏洞（仅当前时间点）。
- npm outdated 仅剩计划内的 Babel 7、ESLint 9、Node 24 类型。typescript-eslint 要求 TS <6.1；React 插件尚不支持 ESLint 10；Babel 插件要求 Babel 7。
- npm 11.17 提示可选 fsevents 安装脚本未授权；未修改用户脚本批准配置，安装与构建仍成功。
- 仓库外仅生产依赖 `npm ci --omit=dev` 成功，真实构建使用 `npm start` 成功启动并接受 PORT=4182；深层文档和尾斜杠回退成功。SPA 静态服务的未知路径 HTTP 200 不代表路由存在，错误页面由客户端处理。
- 原生开发服务启动通过，登录及深层路由文档 200，未知开发路由 404。
- ANALYZE 构建通过并生成报告，报告移至仓库外，默认构建不生成报告。

### 最终运行态与差异验收（2026-08-26）

- 用户确认使用新版默认字体后重新执行 typecheck、lint、build，最终均通过。没有放宽超时或检查规则。
- 1440×900 登录页的 7 个关键节点几何与旧构建一致、无横向溢出；字体按用户要求采用新版默认值。必填校验、密码显示、隔离登录跳转与退出通过。
- 真实生产静态服务（仅生产依赖）能加载登录页及其 12 项 HTML 引用资源；深层路由回退成功，未知路由由客户端显示中文 404。开发服务器启动和深层页面文档响应通过。
- 隔离 API 回归：用户列表搜索与日期区间更新 URL，重置清空字段及参数，分页、前进后退、刷新保留页码与对应数据。原有首次设置 page size 时回到第一页的行为与旧版一致，未修改查询 Hook。
- 用户新增抽屉必填校验通过；角色创建/编辑弹窗分别经历权限加载失败、关闭重开、慢请求，旧错误立即消失，随后列表/角色值/勾选正确回填；取消修改不提交角色或用户数据。
- 文件页用仓库外生成的 68 字节文本分别验证成功和失败：准备上传、XHR PUT、本地确认和列表刷新链路正确，Motion 卡片呈现进度与对应结果；失败 PUT 后未调用完成确认。测试接收方仅为本机隔离服务，不访问真实存储。
- 六个模块的菜单导航通过；日志、审核、举报和内容列表空态正常，内容帖子/评论切换正常；侧栏折叠/展开通过。
- 401 返回登录，403 显示中文无权限页面；最终浏览器记录未见 console error/warn。请求记录共 43 条，没有混入 `_routes` 或 `.data`；除隔离登录、退出和样例上传外没有业务写请求。
- 最终客户端 JS 55 文件、原始 1,586,856 字节、逐文件 gzip 529,840 字节；相较旧版总压缩体积未增长。这是全部 JS 合计，不代表首屏大小或运行性能提升；不同 Node 环境和主机负载下的单次耗时不作性能结论。
- 最终审查确认 services、hooks、layouts、types、路由表、SPA 配置、ESLint 配置和 app.css 均未改变；原有未提交文档内容保留。未新增业务 mock、调试代码、测试脚本或统计产物到正式路径。

### 未覆盖与已知边界

- 一次重建出现 SPA 预渲染超时，当时主机 load average 约 54；未改配置重跑后全部门禁通过，尚不能仅凭负载观察断定原因。保留为需在正常负载/CI 环境继续观察的风险，未扩大超时或关闭检查。
- 浏览器验证使用真实页面与构建、隔离 API 和合成数据，不等同真实登录权限、审核处置、内容恢复、真实存储上传及全部业务操作验收。
- 真实后端未运行，Docker 命令不可用：真实业务/存储/权限联调及 Linux Alpine 容器构建未覆盖。
- ESLint 9 已停止上游支持，是保留的兼容债务。

## 提交分组与范围

1. 运行环境：`.nvmrc` 与 Docker Node 24 基础镜像。
2. 依赖及必要兼容：package/lock、TypeScript/Vite 配置、客户端路由类型、角色弹窗提示状态调整一并提交，避免依赖与消费者不兼容。
3. 工程文档：README、AGENTS、升级需求记录，以及工作摘要/索引中仅属于本次升级的条目。

提交前再次执行 typecheck、lint、build、完整依赖树和差异检查，均通过。

测试脚本、隔离接口、合成数据、截图、分析报告、构建产物和本地环境文件不纳入提交。开始前已有的作废权限方案文档及其工作摘要/索引条目保留在工作区，不混入本轮提交。

## 回退方式

- 开始基准提交：`f047f81d271fba7843be3b0a2fd5e30e25c490d5`，同时保留开始时的本地文档改动。
- 环境配置、package/lock 与对应兼容代码配套恢复，不能只回退版本声明或删除新锁文件。
- 不通过整仓 reset 覆盖用户原有改动。

## 参考依据

- 用户端需求记录：`WinRide/docs/req/REQ-20260826-02-frontend-dependency-upgrade.md`。
- [React Router 7 到 8 迁移](https://reactrouter.com/upgrading/v7)
- [React Router SPA 部署](https://reactrouter.com/how-to/spa)
- [TypeScript 7 与 TS 6 兼容包](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
- [Vite 8 迁移](https://vite.dev/guide/migration)
