import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { MENU_ITEMS } from "../constants/menuItems";
import { useMemo, useEffect } from "react";
import MenuItem from "../components/MenuItem";
import { usePermissions } from "../hooks/usePermissions";
import { useLocation } from "react-router-dom";
import { toggleOpenMenu } from "../slices/appSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const sideBarCollapsed = useSelector(
    (state: RootState) => state.app.sideBarCollapsed,
  );
  const openMenus = useSelector(
    (state: RootState) => state.app.openMenus,
  );
  const { canRead } = usePermissions();
  const location = useLocation();

  // Auto-expand parent menu when navigating to a child route
  useEffect(() => {
    const currentPath = location.pathname;
    MENU_ITEMS.forEach((item) => {
      if (item.children && item.children.length > 0) {
        const isChildActive = item.children.some(
          (child) =>
            currentPath === child.href ||
            currentPath.startsWith(child.href + "/"),
        );
        if (isChildActive && !openMenus.includes(item.href)) {
          dispatch(toggleOpenMenu(item.href));
        }
      }
    });
  }, [location.pathname]);

  const handleToggleItem = (href: string) => {
    dispatch(toggleOpenMenu(href));
  };

  // Filter menu items based on read permission
  const filteredMenuItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const hasRead = canRead(item.module);
      if (!hasRead) return false;

      // If item has children, filter children too
      if (item.children) {
        const filteredChildren = item.children.filter((child) =>
          canRead(child.module),
        );
        // If no children have read access, still show the parent if it has its own page
        // But if parent is just a container (href starts with / and has children),
        // we keep it if at least one child is visible
        if (filteredChildren.length > 0) {
          return true;
        }
        // If parent has its own page (like /vendors), keep it
        // Otherwise hide
        return true; // Keep parent if it has read access
      }

      return true;
    }).map((item) => {
      if (item.children) {
        return {
          ...item,
          children: item.children.filter((child) => canRead(child.module)),
        };
      }
      return item;
    });
  }, [canRead]);

  return (
    <aside
      className="bg-[#343a40] text-white flex flex-col h-[90vh] overflow-y-auto hide-scrollbar"
      style={{
        width: sideBarCollapsed ? "4rem" : "15rem",
        transition: "width 0.3s",
        overflow: "hidden",
      }}
    >
      <nav className="flex-1 h-full">
        <ul className="list-none py-4 flex flex-col gap-4 h-full overflow-y-auto hide-scrollbar">
          {filteredMenuItems.map((item) => (
            <MenuItem
              key={item.href}
              item={item}
              collapsed={sideBarCollapsed}
              openMenus={new Set(openMenus)}
              toggleItem={handleToggleItem}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
