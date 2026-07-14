import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

const rootPath = "routes";
const systemPath = `${rootPath}/sys`;

export default [
  route("login", "routes/login.tsx"), //登录
  layout("routes/index.tsx", [
    index("routes/dashboard/index.tsx"),
    route("sys/user", `${systemPath}/user/index.tsx`),
    route("sys/file", `${systemPath}/file/index.tsx`),
    route("sys/log", `${systemPath}/log/index.tsx`),
    route("sys/audit", `${systemPath}/audit/index.tsx`),
    route("sys/report", `${systemPath}/report/index.tsx`),
  ]),
] satisfies RouteConfig;
