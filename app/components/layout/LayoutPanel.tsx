import { useState } from "react";
import classNames from "classnames";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";

function LayoutPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { pathname } = useLocation();

  if (pathname === "/posts/new" || /^\/posts\/[^/]+\/edit\/?$/.test(pathname)) {
    return <main><Outlet /></main>;
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Main Content - responsive margin */}
        <div
          className={classNames("mt-10 md:mt-0 transition-all duration-300", {
            "md:mr-16": isCollapsed,
            "md:mr-64": !isCollapsed,
          })}
        >
          {/* Page Content */}
          <main className="p-4  md:p-6">
            <div className="mx-auto w-full max-w-[1800px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
  );
}
export default LayoutPanel;
