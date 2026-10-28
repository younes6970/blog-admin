import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),
  layout("components/layout/LayoutPanel.tsx", [
    index("routes/home.tsx"),
    route("posts", "routes/posts.tsx"),
    route("posts/new", "routes/posts.editor.tsx", { id: "post-create" }),
    route("posts/:id/edit", "routes/posts.editor.tsx", { id: "post-edit" }),
  ]),
  route("403", "routes/403.tsx"),
  route("*", "routes/404.tsx"),
] satisfies RouteConfig;
