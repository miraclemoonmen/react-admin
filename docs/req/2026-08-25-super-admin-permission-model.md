# 2026-08-25 超级管理员全权限与角色授权模型

## 状态

- 当前阶段：已作废，不得作为实施依据
- 作废时间：2026-08-25
- 作废原因：跨仓方案范围明显超过当前管理员角色编辑需求；用户已确认回滚全部实施代码，另行制定精简方案
- 后续方案：以 `WinRide-API/docs/req/2026-08-25-the-one-super-admin.md` 为准，后端已完成用户级 `is_super_admin` 与统一 Console 方法授权并推送代码；本管理端未实施下文权限重构。下文仅保留作废方案的审查历史。
- 风险等级：重流程（认证、权限、路由、全局状态、跨仓接口）
- 后端及跨仓权威需求：`/Users/heliang/private/WinRide-API/docs/req/2026-08-25-super-admin-permission-model.md`

## Console 目标

1. 从 `GET /console/session` 一次获取当前登录主体、`superAdmin`、精确权限集合、导航菜单和 `authorizationRevision`，不再单独请求 `/console/menu`。
2. 根路由建立唯一权限上下文，菜单、路由和操作按钮不再各自推断权限。
3. 提供统一 `can(permission)` / `Can` 能力，并迁移全部现有写操作入口。
4. 超级管理员角色显示为系统全权限，权限全选只读且不提供删除入口。
5. 普通角色只读取、展示和提交启用的 `C/F` 权限 ID，不保存隐藏 `M` 目录 ID。
6. 角色更新提交 `expectedAuthVersion`，并发冲突提示用户刷新后重试。
7. 继续由 API 承担最终授权，Console 权限门控只用于一致体验，不构成安全边界。

## 接口与类型

以权威需求文档为准，至少新增或调整：

- `ConsoleSession`（来自 `/console/session`）
- `Role.superAdmin`
- `Role.permissionMode`
- `Role.authVersion`
- `RolePermissionDetail.selectedPermissionIds`
- `RoleUpdateInput.expectedAuthVersion`
- `RoleUpdateInput.permissionIds`
- `ConsoleUser.authVersion`
- `ConsoleUser.superAdmin`
- `UserMutationInput.expectedAuthVersion`

所有 `authVersion` / `expectedAuthVersion` TypeScript 类型固定为 `string`，原样传输后端十进制 `bigint`；禁止 `Number()`、算术递增或使用 JSON number。契约测试覆盖大于 `2^53 - 1` 的版本值。

现有角色和权限接口原位升级。旧的 `getMenuIdsByRoleId(): number[]`、旧 `permissions` 写字段及相关类型必须删除，不能在页面层兼容猜测两种结构，也不保留版本化或双轨 service。

Console 只使用 API 设置的 `Console-Ticket`（Cookie Path `/console`）和 `aud=console` 会话；用户端 `Ticket` 不能建立后台登录态。`POST /console/login` 成功后再请求 `/console/session`，`POST /console/logout` 只退出后台会话，不影响同浏览器中的用户端会话。所有非 GET/HEAD/OPTIONS 请求（含 login/logout）必须携带 `X-WinRide-Request`，并继续使用 `credentials: include`；前端不得读取、复制或持久化 HttpOnly Cookie/JWT。

权限 key 的唯一机器源是相邻 API 仓 `contracts/console-permissions.json`，并由同目录 JSON Schema 校验 key、kind、menuType、handlerPolicies（含 allOf/anyOf）、serviceMutations、frontendRoutes、frontendActions 的枚举、必填、唯一和排序规则。固定 Maven 子模块/版本锁定的 Java 生成器产出本仓 `app/generated/consolePermissions.ts` 完整 consumer contract；固定手写绑定文件为 `app/security/authorizationManifest.ts`，只能用生成常量把实际 route/action/service 引用接入 contract，`can()` 和 `Can` 也只能引用生成字面量。生成文件禁止手改。`permissions:check` 通过 API 仓统一 wrapper 运行并强制接入 `pretypecheck`、`prebuild`，校验 schema、源/生成 SHA 和 manifest 双向覆盖；路径由仓库根/显式 `--console-dir` 解析，不包含开发者用户目录。重复、缺字段、未知分类、伪造 SHA、遗漏或多余 consumer 均使构建失败。

## 权限上下文范围

统一迁移现有写操作入口：

- 用户新增、编辑、删除
- 角色新增、编辑、删除
- 文件上传、删除
- 帖子/评论审核决策
- 举报处理
- 内容删除、恢复

页面不得再通过菜单树、角色名称或按钮点击后的 403 推断权限。

固定 route/action 权限矩阵：

| 页面/模块 | 查看权限 | 写操作权限 |
| --- | --- | --- |
| `/sys/user` | `sys:user:view` | 用户 `sys:user:add/edit/delete`；角色 `sys:role:add/edit/delete` |
| `/sys/file` | `sys:file:view` | `sys:file:add/delete` |
| `/sys/audit` | `sys:audit:view`，详情 `sys:audit:detail` | `sys:audit:approve` |
| `/sys/report` | `sys:report:view` | `sys:report:handle` |
| `/sys/content` | `sys:content:view` | `sys:content:delete/restore` |
| `/sys/log` | `sys:log:view` | 无 |

- 新增集中 route/action manifest，路由守卫、`Can` 和 service 写入口映射共享它；Dashboard 使用 `console:access`，超级账号晋升/降级使用 `sys:user:edit + superAdmin` 独立 action。
- 自动化扫描全部 route/action、全部 Console service mutation，并与 API 的全部 `/console/**` HandlerMethod 权限清单和集中注册表做双向差集；新增任何未映射 handler、service mutation 或可点击写入口都必须使测试失败，不能维护“已知入口”白名单后默认放行未知入口。
- 彻底删除根路由当前的 `shouldRevalidate` 导出，恢复 React Router 默认重验证。根 loader 调用主体隔离 `authorizationContextResource`，TTL/single-flight 由资源层实现；显式失效后再调用 `revalidate()`。首次进入、TTL 过期导航、action、窗口聚焦、可见性恢复、`X-WinRide-Auth-Revision` 变化、403 或版本冲突时强制重验证，TTL 内普通导航不得重复请求。
- 中心 `http()` 读取所有已认证响应（含 400/403/409）的 revision 并交给唯一 observer；bootstrap body/header revision 必须一致，变化只调度一次异步失效，禁止请求内递归刷新。
- 资源键固定为 `userId + sessionGeneration`。登录成功、退出、401、主体切换时递增 generation、取消旧请求并清空全部权限资源；响应提交前校验 generation 与 userId，禁止相同 revision 的不同账号或旧 in-flight 请求覆盖新上下文。
- 每个 generation 分离两个水位：普通业务响应的 `observerRequestSequence` 只控制 revision header 接受顺序；权限资源自己的 `authorizationRequestSequence` 只由 `/console/session` fetch 递增。子路由并行请求不得推进 bootstrap 水位。每次 invalidate 递增 `authorizationEpoch` 并 abort 旧 bootstrap，新结果提交前校验 generation、epoch、userId 和资源序号；bootstrap body 提交时同步 observer revision，不受无关业务请求序号阻塞。被 epoch/abort 拒绝且无更新请求时 single-flight 自动重试一次。revision 保持不透明，不比较字符串大小；同账号 slow-old/fast-new 和根/子 loader 快慢交错都不能覆盖新状态或永久丢失根上下文。
- 登录页调用精确的 `POST /console/login`，不能退回用户端登录接口或在前端复用用户端 token；退出只调用 `POST /console/logout`。登录失败不得预建权限资源，登录成功后的 bootstrap 失败按后台未建立可用会话处理并清空本地主体状态。
- 即使当前账号已被停用或撤销最后一个后台角色，logout 仍可作为纯会话清理成功并清除 Cookie；前端不能因为 bootstrap 401/403 而跳过 logout/清理流程，也不能把该端点当作业务认证恢复入口。
- 直接访问无权 URL 时，在业务组件挂载前显示 403。

## 角色交互

- 超级管理员角色卡显示“系统全权限”。
- 超级管理员权限复选框展示全部启用 `C/F` 并只读。
- 超级管理员允许编辑名称和标识，但提交 `permissionIds: null`。
- 普通角色只提交模板中存在的选中 ID。
- 每次打开、关闭、切换角色都重置加载错误、表单、选择集合和提交状态，防止跨角色污染。
- 加载权限模板与角色详情任一失败时禁止提交。
- 保存成功后同时失效角色列表缓存并重新验证路由数据。
- 并发冲突、权限不足、参数错误使用可区分中文反馈。
- 普通角色选择器排除超级管理员角色；超级账号晋升/降级使用独立二次确认入口，不能复用通用角色多选。
- 账号列表携带真实 `authVersion`；编辑、删除、超级账号降级均原样提交，冲突后重新加载，不在前端递增或猜测。
- 编辑超级管理员账号时，普通角色多选仍不显示系统角色；请求只替换普通角色，API 必须保留超级关系。普通管理员不能进入该编辑流程；停用、删除和超级身份变更不能由普通角色多选隐式完成。
- 删除模块级全局 `roleCache`；角色列表按当前路由请求，mutation 后重验证，不跨主体或 revision 缓存。
- `http` 层在非 2xx 时仍解析合法 `ApiResult`：401 跳登录，403 展示权限反馈，400 展示参数错误，409 按 `11101`–`11104` 区分角色冲突、最后管理员保护、系统角色保护和账号冲突。

## 验收与门禁

完整验收矩阵遵循后端权威需求文档。Console 至少执行：

```bash
npm run lint
npm run typecheck
npm run build
git diff --check
```

并完成桌面运行态验证：

1. 超级管理员看到全部合法菜单和操作入口。
2. 系统角色全权限只读、不能删除。
3. 普通角色无修改保存成功且不提交 `M`。
4. 角色切换无选择残留。
5. 无权限主体看不到对应写按钮，直接调用仍由 API 拒绝。
6. 角色并发冲突提示刷新重试。
7. route/action manifest 覆盖 Dashboard、所有现有写入口和超级账号 action，直接 URL、焦点恢复和撤权重验证通过。
8. 超级账号晋升/降级入口提交真实账号版本，自我降级、最后账号保护和并发冲突反馈通过。
9. bootstrap single-flight 在同一导航周期最多一次请求，TTL 内普通导航不重复请求，auth revision 变化只触发一次重验证。
10. bootstrap body/header revision 原子一致，中心 HTTP 层在成功、400、403、409 均能捕获；401 正确清理主体资源。
11. 删除 roleCache 后跨账号登录无数据泄漏，角色 mutation 后列表即时刷新。
12. 类型、service、权限 manifest 和组件无双轨兼容、未使用导出、页面级权限字符串复制或循环依赖。
13. 同权限账号快速切换与慢旧响应不会跨 generation 提交，当前主体信息不被旧请求覆盖。
14. 删除 `shouldRevalidate` 后，实际 React Router 显式 revalidate 会运行根 loader，资源层仍保证 TTL 内零重复网络请求。
15. 同一浏览器同时登录用户端和 Console 后分别注销互不影响；Console 请求只发送匹配 `/console` 的后台 Cookie，错误 audience 或仅有用户端 Cookie 时返回 401。
16. 所有 Console 非安全方法都发送 `X-WinRide-Request`；缺失 header 的 Cookie 请求被 API 403 拒绝，合法请求和 revision observer 行为正常。
17. 生成权限常量的 SHA/check 门禁通过，手改生成文件、漏 route/action 或新增未映射 service mutation 均使构建失败。
18. 撤权或停用后的 logout 仍清 Cookie，随后保持未登录态且不会影响用户端 `Ticket`。
19. `GET /console/permissions` 的 add-only、edit-only 主体都可访问，其他主体拒绝；生成 policy 与后端 anyOf 扫描一致。
20. 同账号 slow-old/fast-new 响应在相同 generation 下按 sequence/epoch 丢弃旧结果，不恢复旧菜单/动作，也不触发失效风暴。
21. 根 bootstrap 与子 loader 并行时，快子慢根、慢子快根均能提交最新权限上下文；无关业务 request sequence 不丢弃 bootstrap，被 abort 的唯一请求会自动重试。

## 实施记录

- 2026-08-25：跨仓权威方案已经十四轮 Luna Max 独立审查，第十四轮无 P1/P2/P3 遗留。用户要求文档完成后先暂停，因此未修改 Console 权限、路由、页面、service 或测试代码。
- 2026-08-25：恢复实施后曾产生 Console 半成品改动；用户确认终止，所有已跟踪 Console 代码已恢复，所有本轮未跟踪生成代码、权限目录和 session service 已删除。本文件同步作废。

## 验证记录

- 文档 `git diff --check` 通过。
- 已丢弃的半成品实现不计入交付，相关验证结果不代表本方案已实现。
- 2026-08-25 回滚后执行 `npm run typecheck`，通过；三仓 `git diff --check` 通过。未执行浏览器运行态与跨仓联调，因为当前没有待交付实现。
