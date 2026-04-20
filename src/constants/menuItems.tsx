import type { ReactNode } from "react";

import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SettingsIcon from "@mui/icons-material/Settings";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ReceiptIcon from "@mui/icons-material/ReceiptOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import InventoryIcon from "@mui/icons-material/Inventory";
import CurrencyBitcoinOutlinedIcon from "@mui/icons-material/CurrencyBitcoinOutlined";
import AllInboxOutlinedIcon from "@mui/icons-material/AllInboxOutlined";
import CategoryIcon from "@mui/icons-material/CategoryOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import StoreIcon from "@mui/icons-material/Store";
import {
  EditOutlined,
  PersonOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";

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
  { title: "POS", href: "/sales/pos", icon: <PointOfSaleIcon /> },
  {
    title: "Sales",
    href: "/sales",
    icon: <AttachMoneyIcon />,
    children: [
      { title: "Invoices", href: "/sales/invoices", icon: <ReceiptIcon /> },
    ],
  },
  {
    title: "Customers",
    href: "/customers",
    icon: <GroupIcon />,
  },
  {
    title: "Suppliers",
    href: "/vendors",
    icon: <StoreIcon />,
    children: [
      {
        title: "Vendors",
        href: "/vendors",
        icon: <PersonOutlined />,
      },
      {
        title: "Purchases",
        href: "/purchases",
        icon: <ShoppingCartOutlined />,
      },
    ],
  },
  {
    title: "Stocks",
    href: "/stocks",
    icon: <AllInboxOutlinedIcon />,
    children: [
      {
        title: "Batches",
        href: "/batches",
        icon: <CurrencyBitcoinOutlinedIcon />,
      },
      {
        title: "Stock Adjustment",
        href: "/stock-adjustments",
        icon: <EditOutlined />,
      },
      {
        title: "Stock Movements",
        href: "/stock-movements",
        icon: <ReceiptIcon />,
      },
    ],
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
