/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, NavLink } from "react-router-dom";
import { Tooltip } from "@mui/material";
import clsx from "clsx";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface MenuItemProps {
  item: any;
  collapsed: boolean;
  openMenus: Set<string>;
  toggleItem: (href: string) => void;
}

const MenuItem = ({
  item,
  collapsed,
  openMenus,
  toggleItem,
}: MenuItemProps) => {
  const location = useLocation();

  const hasChildren = !!item.children?.length;

  const isExpanded = openMenus.has(item.href);

  const isActive =
    location.pathname === item.href ||
    item.children?.some((child: any) => location.pathname === child.href);

  return (
    <div>
      {/* MAIN ITEM */}
      <Tooltip title={collapsed ? item.title : ""} placement="right">
        <div
          className={clsx(
            "flex items-center justify-between px-3 py-2 mx-2 rounded-lg cursor-pointer transition",
            isActive
              ? "bg-indigo-600 text-white"
              : "text-gray-300 hover:bg-gray-800",
          )}
          onClick={() => {
            if (hasChildren) toggleItem(item.href);
          }}
        >
          {/* ICON + LABEL */}
          <NavLink
            to={item.href !== "#" ? item.href : ""}
            className="flex items-center gap-3 flex-1"
            onClick={(e) => hasChildren && e.preventDefault()}
          >
            <span className="text-lg">{item.icon}</span>

            {!collapsed && (
              <span className="text-sm font-medium">{item.title}</span>
            )}
          </NavLink>

          {/* EXPAND ICON */}
          {hasChildren && !collapsed && (
            <span>
              {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
            </span>
          )}
        </div>
      </Tooltip>

      {/* EXPANDED SIDEBAR SUBMENU */}
      {hasChildren && isExpanded && !collapsed && (
        <div className="ml-8 w-[75%] mt-1 space-y-1">
          {item.children.map((child: any) => {
            const childActive = location.pathname === child.href;

            return (
              <NavLink
                key={child.href}
                to={child.href}
                className={clsx(
                  "flex items-center gap-2 text-sm px-2 py-1 rounded transition",
                  childActive
                    ? "bg-indigo-500 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800",
                )}
              >
                <span>{child.icon}</span>
                <span>{child.title}</span>
              </NavLink>
            );
          })}
        </div>
      )}

      {/* COLLAPSED INLINE SUBMENU */}
      {hasChildren && isExpanded && collapsed && (
        <div className="ml-2 mt-1 w-[70%] flex flex-col items-end gap-2">
          {item.children.map((child: any) => {
            const childActive = location.pathname === child.href;

            return (
              <Tooltip key={child.href} title={child.title} placement="right">
                <NavLink
                  to={child.href}
                  className={clsx(
                    "flex items-center justify-end w-fit p-1 px-2 rounded transition",
                    childActive
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-700",
                  )}
                >
                  <span>{child.icon}</span>
                </NavLink>
              </Tooltip>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MenuItem;
