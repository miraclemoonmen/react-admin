import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

const rootPath = "routes";
const systemPath = `${rootPath}/system`;

export default [
  route("login", "routes/login.tsx"), //登录
  layout("routes/index.tsx", [
    index("routes/dashboard/index.tsx"),
    route("system/user", `${systemPath}/user/index.tsx`),
    route("system/file", `${systemPath}/file/index.tsx`),
  ]),
] satisfies RouteConfig;
