import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),
  layout("components/layout/LayoutPanel.tsx", [
    index("routes/home.tsx"),
  ]),
  route("403", "routes/403.tsx"),
  route("*", "routes/404.tsx"),
] satisfies RouteConfig;
