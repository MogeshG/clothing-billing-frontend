export interface MenuItem {
  title: string;
  href: string;
  icon?: string;
  children?: MenuItem[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "🏠",
  },
  {
    title: "Customers",
    href: "/customers",
    icon: "👥",
  },
  {
    title: "Products",
    href: "/prod",
    icon: "📦",
    children: [
      { title: "Clothing", href: "/products/clothing", icon: "👕" },
      { title: "Accessories", href: "/products/accessories", icon: "💍" },
      { title: "Inventory", href: "/products/inventory", icon: "📊" },
    ],
  },
  {
    title: "Sales",
    href: "/sales",
    icon: "💰",
    children: [
      { title: "Invoices", href: "/sales/invoices", icon: "📄" },
      { title: "POS", href: "/sales/pos", icon: "🛒" },
      { title: "Payments", href: "/sales/payments", icon: "💳" },
    ],
  },
  {
    title: "Reports",
    href: "/reort",
    icon: "📈",
    children: [
      { title: "Sales Report", href: "/reports/sales", icon: "📊" },
      { title: "Inventory Report", href: "/reports/inventory", icon: "📋" },
    ],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "⚙️",
  },
];
