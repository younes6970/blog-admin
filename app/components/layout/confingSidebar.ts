import { FileText, type LucideIcon } from "lucide-react";
import type { Permission } from "~/lib/permissions";

type SidebarLink = {
  key: string;
  label: string;
  icon: LucideIcon;
  path: string;
  permission: Permission | null;
  permissions?: Permission[];
  children?: never;
};
type SidebarGroup = {
  key: string;
  label: string;
  icon: LucideIcon;
  permission?: never | null;
  path?: never;
  children: { label: string; path: string; permission: Permission | Permission[] }[];
};
export type SidebarItem = SidebarLink | SidebarGroup;
export const SIDEBAR: SidebarItem[] = [
  { key: "posts", label: "پست‌های بلاگ", icon: FileText, path: "/posts", permission: null },
];
