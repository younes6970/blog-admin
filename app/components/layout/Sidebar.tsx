import {
  ChevronDown,
  DotIcon,
  Menu,
  PenLine,
  Plus,
  PanelRightClose,
  PanelRightOpen,
  HardDrive,
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
}: SidebarLinkItemProps) {
  const IconComponent = item.icon;

  return (
    <Link
      key={item.path}
      to={item.path}
      onClick={onNavigate}
      title={item.label}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
    >
      <div
        className={classNames(
          "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg",
          "transition-all duration-200 group",
          {
            "bg-stone-100 text-stone-900": isActive,
            "text-stone-600 hover:bg-stone-50 hover:text-stone-900": !isActive,
            "justify-center": isCollapsed,
            "justify-start": !isCollapsed,
          },
        )}
      >
        <IconComponent
          size={17}
          className={classNames("shrink-0", {
            "text-stone-800": isActive,
            "text-stone-500 group-hover:text-stone-700": !isActive,
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
              "bg-stone-100 text-stone-900": isActiveSubMenu,
              "text-stone-600 hover:bg-stone-50 hover:text-stone-900":
                !isActiveSubMenu,
              "justify-center gap-px": isCollapsed,
              "justify-between gap-3": !isCollapsed,
            },
          )}
        >
          <div className="flex items-center gap-3">
            <IconComponent
              size={17}
              className={classNames("shrink-0", {
                "text-stone-800": isActiveSubMenu,
                "text-stone-500 group-hover:text-stone-700": !isActiveSubMenu,
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
                  "bg-stone-100 text-stone-900":
                    currentPath === child.path,
                  "text-stone-600 hover:bg-stone-50 hover:text-stone-900":
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
        className="fixed top-5 right-4 z-50 md:hidden bg-white text-stone-500 border-stone-200"
        onClick={toggleMobile}
        color="transparent"
        aria-label="باز کردن فهرست مدیریت"
        aria-expanded={isMobileOpen}
      >
        <Menu size={17} />
      </Button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={toggleMobile}
        />
      )}

      <aside
        className={`
          fixed top-0 right-0 h-dvh bg-white border-l border-stone-100 z-90
          transition-all duration-200 ease-in-out
          ${isCollapsed ? "w-16" : "w-56"}
          ${isMobileOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}
      >
        <div className="h-full w-full flex flex-col transition-all duration-300 ease-in-out overflow-hidden">
          <div className="flex items-center justify-between px-4 border-b border-stone-100 h-[73px] shrink-0">
            <div className="flex-1 overflow-hidden">
              {!isCollapsed && (
                <h1 className="text-sm font-semibold text-stone-800 transition-opacity duration-200 delay-75 whitespace-nowrap">
                  <span className="flex items-center gap-2"><PenLine size={18} strokeWidth={1.5} />بلاگ<span className="text-[10px] font-normal text-stone-400">/ مدیریت</span></span>
                </h1>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapse}
              className="hidden md:flex size-7 px-0 text-stone-400 hover:bg-stone-50 hover:text-stone-800 shrink-0"
              color="transparent"
              aria-label={isCollapsed ? "باز کردن سایدبار" : "جمع کردن سایدبار"}
              aria-expanded={!isCollapsed}
            >
              {isCollapsed ? <PanelRightOpen size={16} /> : <PanelRightClose size={16} />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobile}
              className="md:hidden text-stone-500 shrink-0"
              color="transparent"
              aria-label="بستن فهرست مدیریت"
            >
              <X size={16} />
            </Button>
          </div>

          <nav aria-label="فهرست مدیریت" className="px-3 py-7 space-y-2 flex-1 overflow-y-auto">
            {!isCollapsed && <p className="px-3 pb-3 text-[10px] text-stone-400">مدیریت محتوا</p>}
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

              const isActive = location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(`${item.path}/`));

              return (
                <SidebarLinkItem
                  key={item.path}
                  item={item}
                  isCollapsed={isCollapsed}
                  isActive={isActive}
                  onNavigate={handleNavClick}
                />
              );
            })}
            <Link to="/posts/new" onClick={handleNavClick} title="مطلب جدید" className={classNames("mt-3 flex items-center gap-3 rounded-lg border border-dashed border-stone-200 px-3 py-2.5 text-stone-400 transition-colors hover:border-stone-300 hover:text-stone-800", { "justify-center": isCollapsed })}>
              <Plus size={16} />{!isCollapsed && <span className="text-xs">مطلب جدید</span>}
            </Link>
          </nav>
          <div className="mx-4 mb-5 flex items-center gap-2 border-t border-stone-100 pt-4 text-stone-400" title="ذخیره‌سازی در همین مرورگر">
            <HardDrive size={14} className="shrink-0" />{!isCollapsed && <span className="text-[10px]">ذخیره‌سازی محلی</span>}
          </div>


        </div>
      </aside>
    </>
  );
}
