import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),
  layout("routes/index.tsx", [index("routes/dashboard/index.tsx")])
] satisfies RouteConfig;
