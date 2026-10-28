import { useState } from "react";
import classNames from "classnames";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { ChevronLeft, Circle } from "lucide-react";

function LayoutPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { pathname } = useLocation();

  if (pathname === "/posts/new" || /^\/posts\/[^/]+\/edit\/?$/.test(pathname)) {
    return <main><Outlet /></main>;
  }

  return (
      <div className="min-h-screen bg-white text-stone-800">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Main Content - responsive margin */}
        <div
          className={classNames("transition-[margin] duration-200", {
            "md:mr-16": isCollapsed,
            "md:mr-56": !isCollapsed,
          })}
        >
          <header className="flex h-[73px] items-center justify-between gap-4 border-b border-stone-100 px-5 pr-16 md:px-9">
            <div className="flex items-center gap-2.5 text-[11px]"><span className="text-stone-400">فضای کار</span><ChevronLeft size={12} className="text-stone-300" /><span className="text-stone-600">مدیریت محتوا</span></div>
            <span className="flex items-center gap-2 text-[10px] text-stone-400" title="مطالب در حافظه‌ی همین مرورگر ذخیره می‌شوند"><Circle size={6} className="fill-stone-300 text-stone-300" />نسخه‌ی محلی</span>
          </header>
          <main className="px-5 py-9 sm:px-8 md:px-9 lg:px-12 lg:py-12">
            <div className="mx-auto w-full max-w-[1280px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
  );
}
export default LayoutPanel;
