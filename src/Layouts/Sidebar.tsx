import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { MENU_ITEMS } from "../constants/menuItems";
import { useState, useMemo } from "react";
import MenuItem from "../components/MenuItem";
import { usePermissions } from "../hooks/usePermissions";

const Sidebar = () => {
  const sideBarCollapsed = useSelector(
    (state: RootState) => state.app.sideBarCollapsed,
  );
  const { canRead } = usePermissions();

  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());

  const toggleItem = (href: string) => {
    setOpenMenus((prev) => {
      const next = new Set(prev);

      if (next.has(href)) {
        next.delete(href);
      } else {
        next.add(href);
      }

      return next;
    });
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
              openMenus={openMenus}
              toggleItem={toggleItem}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
