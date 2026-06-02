# COLLAB_RULES.md

## 目的

本文件用于承接 `WinRide-Console` 的协作型约束，包括 AI 协作、跨仓库联调、外部材料和后台需求处理口径。

## AI 协作默认口径

- AI 写入前默认先查阅 `AGENTS.md`、`docs/PROJECT_RULES.md`、`docs/WORKING_LOG.md` 和相关需求记录
- 用户只要求讨论方案时，不写文件
- 用户要求实现时，先说明计划、影响范围和验证方式，再进入写入
- 未确认的菜单、权限、字段和接口不得写成既定事实

## 跨仓库协作

- 用户端仓库：`/Users/heliang/private/WinRide`
- 后端仓库：`/Users/heliang/private/WinRide-API`
- 管理端仓库：`/Users/heliang/private/WinRide-Console`

管理端接入接口时，默认以 `WinRide-API` 中 `com.winride.console` 的 controller、DTO、VO 和 service 为本地参考。

## 后台需求材料

- 后台页面需求应先转写为模块、路由、筛选项、表格列、操作项、权限点和验收口径
- 不把没有后端接口支撑的字段长期放入正式页面
- 涉及账号、权限、审核和日志的数据展示时，默认谨慎处理敏感信息

## 冲突处理

- 工程规则以 `docs/PROJECT_RULES.md` 为准
- 当前状态以 `docs/WORKING_LOG.md` 为准
- 单需求细节以对应 `docs/req/*.md` 为准
- 用户当前明确指令优先于历史协作口径
