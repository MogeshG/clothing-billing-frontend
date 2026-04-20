import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { MENU_ITEMS } from "../constants/menuItems";
import { useState } from "react";
import MenuItem from "../components/MenuItem";

const Sidebar = () => {
  const sideBarCollapsed = useSelector((state: RootState) => state.app.sideBarCollapsed);

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
          {MENU_ITEMS.map((item) => (
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
