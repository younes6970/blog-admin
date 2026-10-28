import {
  ChevronDown,
  ChevronRight,
  DotIcon,
  Menu,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import classNames from "classnames";
import { useAuthStore } from "~/lib/useAuthStore";
import { SIDEBAR, type SidebarItem } from "./confingSidebar";
import type { Permission } from "~/lib/permissions";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}

type SidebarLinkItemType = Extract<
  SidebarItem,
  { path: string; children?: never }
>;
type SidebarGroupItemType = Extract<SidebarItem, { children: unknown }>;
type SidebarLinkItemProps = {
  item: SidebarLinkItemType;
  isCollapsed: boolean;
  isActive: boolean;
  onNavigate: () => void;
  pathname: string;
};

type SidebarGroupItemProps = {
  item: SidebarGroupItemType;
  isCollapsed: boolean;
  currentPath: string;
  onNavigate: () => void;
};

function isSidebarGroup(item: SidebarItem): item is SidebarGroupItemType {
  return "children" in item;
}

function SidebarLinkItem({
  item,
  isCollapsed,
  isActive,
  onNavigate,
  pathname,
}: SidebarLinkItemProps) {
  const IconComponent = item.icon;

  return (
    <Link
      key={item.path}
      to={item.path}
      onClick={onNavigate}
    >
      <div
        className={classNames(
          "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg",
          "transition-all duration-200 group",
          {
            "bg-main/20 text-main border-l-2 border-main": isActive,
            "text-gray-600 hover:bg-gray-50 hover:text-gray-900": !isActive,
            "justify-center": isCollapsed,
            "justify-start": !isCollapsed,
          },
        )}
      >
        <IconComponent
          size={20}
          className={classNames("shrink-0", {
            "text-main": isActive,
            "text-gray-500 group-hover:text-gray-700": !isActive,
          })}
        />
        {!isCollapsed && (
          <span className="font-medium text-sm transition-opacity duration-200 delay-75 whitespace-nowrap overflow-hidden">
            {item.label}
          </span>
        )}
      </div>
    </Link>
  );
}

function SidebarGroupItem({
  item,
  isCollapsed,
  currentPath,
  onNavigate,
}: SidebarGroupItemProps) {
  const IconComponent = item.icon;
  const subMenuItems = item.children ?? [];
  const isActiveSubMenu = subMenuItems.some(
    (child) => child.path === currentPath,
  );

  return (
    <Collapsible key={item.key} className="m-0">
      <CollapsibleTrigger className="w-full cursor-pointer group/coll-trigger">
        <div
          title={item.label}
          className={classNames(
            "flex items-center w-full px-3 py-2.5 rounded-lg",
            "transition-all duration-200 group",
            {
              "bg-main/20 text-main border-l-2 border-main": isActiveSubMenu,
              "text-gray-600 hover:bg-gray-50 hover:text-gray-900":
                !isActiveSubMenu,
              "justify-center gap-px": isCollapsed,
              "justify-between gap-3": !isCollapsed,
            },
          )}
        >
          <div className="flex items-center gap-3">
            <IconComponent
              size={20}
              className={classNames("shrink-0", {
                "text-main": isActiveSubMenu,
                "text-gray-500 group-hover:text-gray-700": !isActiveSubMenu,
              })}
            />
            {!isCollapsed && (
              <span className="font-medium text-sm transition-opacity duration-200 delay-75 whitespace-nowrap overflow-hidden">
                {item.label}
              </span>
            )}
          </div>
          <ChevronDown
            className={classNames(
              "group-aria-expanded/coll-trigger:rotate-180 rotate-0 transition-all duration-200 shrink-0 size-4",
              {
                hidden: isCollapsed,
                block: !isCollapsed,
              },
            )}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-1">
        {subMenuItems.map((child) => (
          <Link
            key={child.path}
            to={child.path}
            onClick={onNavigate}
          >
            <div
              title={child.label}
              className={classNames(
                "flex items-center w-full py-2.5 rounded-lg",
                "transition-all duration-200 group",
                {
                  "bg-main/20 text-main":
                    currentPath === child.path,
                  "text-gray-600 hover:bg-gray-50 hover:text-gray-900":
                    currentPath !== child.path,
                  "justify-center p-0": isCollapsed,
                  "justify-start pr-6": !isCollapsed,
                },
              )}
            >
              <DotIcon
                className={classNames("size-6", {
                  hidden: isCollapsed,
                  block: !isCollapsed,
                })}
              />
              <span className="font-medium text-sm transition-opacity duration-200 delay-75 whitespace-nowrap overflow-hidden">
                {child.label}
              </span>
            </div>
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const location = useLocation();
  const { can, permissions } = useAuthStore();

  const toggleCollapse = () => setIsCollapsed((value) => !value);
  const toggleMobile = () => {
    setIsCollapsed(false);
    setIsMobileOpen((value) => !value);
  };
  const handleNavClick = () => setIsMobileOpen(false);

  const sidebarItems = useMemo(() => {
    const hasRequiredPermission = (permission: Permission | Permission[]) =>
      Array.isArray(permission)
        ? permission.some((item) => can(item))
        : can(permission);

    return SIDEBAR.flatMap((item): SidebarItem[] => {
      if (isSidebarGroup(item)) {
        const children = (item.children ?? []).filter((child) =>
          hasRequiredPermission(child.permission),
        );

        if (!children.length) return [];

        return [{ ...item, children } as SidebarItem];
      }

      const hasPermission =
        (!item.permission || can(item.permission)) &&
        (!item.permissions ||
          item.permissions.some((permission) => can(permission)));

      return hasPermission ? [item] : [];
    });
  }, [can, permissions]);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 right-4 z-50 md:hidden bg-white shadow-sm border"
        onClick={toggleMobile}
      >
        <Menu size={20} />
      </Button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={toggleMobile}
        />
      )}

      <aside
        className={`
          fixed top-0 right-0 h-full bg-white border-l border-gray-200 z-90
          transition-all duration-300 ease-in-out shadow-sm
          ${isCollapsed ? "w-16" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}
      >
        <div className="h-full w-full flex flex-col transition-all duration-300 ease-in-out overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 h-16 shrink-0">
            <div className="flex-1 overflow-hidden">
              {!isCollapsed && (
                <h1 className="text-lg font-semibold text-gray-800 transition-opacity duration-200 delay-75 whitespace-nowrap">
                  پنل مدیریت
                </h1>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapse}
              className="hidden md:flex text-gray-500 hover:text-white shrink-0"
            >
              <ChevronRight
                size={16}
                className={`transition-transform duration-200 ${
                  isCollapsed ? "rotate-180" : ""
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobile}
              className="md:hidden text-gray-500 shrink-0"
            >
              <X size={16} />
            </Button>
          </div>

          <nav className="p-2 space-y-2 flex-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              if (isSidebarGroup(item)) {
                return (
                  <SidebarGroupItem
                    key={item.key}
                    item={item}
                    isCollapsed={isCollapsed}
                    currentPath={location.pathname}
                    onNavigate={handleNavClick}
                  />
                );
              }

              const isActive =
                location.pathname ===
                item.path;

              return (
                <SidebarLinkItem
                  key={item.path}
                  item={item}
                  isCollapsed={isCollapsed}
                  isActive={isActive}
                  onNavigate={handleNavClick}
                  pathname={location.pathname}
                />
              );
            })}
          </nav>


        </div>
      </aside>
    </>
  );
}
