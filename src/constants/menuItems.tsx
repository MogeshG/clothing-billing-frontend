import type { ReactNode } from "react";

import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SettingsIcon from "@mui/icons-material/Settings";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/CategoryOutlined";
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

export interface MenuItem {
  title: string;
  href: string;
  icon?: ReactNode;
  children?: MenuItem[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <HomeIcon />,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: <GroupIcon />,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: <Inventory2Icon />,
    children: [
      {
        title: "Products",
        href: "/products",
        icon: <CategoryIcon />,
      },
      {
        title: "Product Categories",
        href: "/product-categories",
        icon: <ArticleOutlinedIcon />,
      },
    ],
  },
  {
    title: "Sales",
    href: "/sales",
    icon: <AttachMoneyIcon />,
    children: [
      { title: "Invoices", href: "/sales/invoices", icon: <ReceiptIcon /> },
      { title: "POS", href: "/sales/pos", icon: <PointOfSaleIcon /> },
      {
        title: "Payments",
        href: "/sales/payments",
        icon: <ShoppingCartIcon />,
      },
    ],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: <AssessmentIcon />,
    children: [
      {
        title: "Sales Report",
        href: "/reports/sales",
        icon: <AssessmentIcon />,
      },
      {
        title: "Inventory Report",
        href: "/reports/inventory",
        icon: <InventoryIcon />,
      },
    ],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <SettingsIcon />,
  },
];
