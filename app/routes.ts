import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"), //登录
  layout("routes/index.tsx", [
    index("routes/dashboard/index.tsx"), //控制台
    route("user", "routes/user/index.tsx")
  ]),
] satisfies RouteConfig;
