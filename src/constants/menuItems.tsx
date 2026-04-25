import type { ReactNode } from "react";
import type { PermissionModule } from "../types/user";

import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SettingsIcon from "@mui/icons-material/Settings";
import ReceiptIcon from "@mui/icons-material/ReceiptOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
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
  module: PermissionModule;
  children?: MenuItem[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <HomeIcon />,
    module: "Dashboard",
  },
  { title: "POS", href: "/pos", icon: <PointOfSaleIcon />, module: "Sales" },
  {
    title: "Customers",
    href: "/customers",
    icon: <GroupIcon />,
    module: "Customers",
  },
  {
    title: "Sales",
    href: "/sales",
    icon: <AttachMoneyIcon />,
    module: "Sales",
    children: [
      {
        title: "Invoices",
        href: "/sales/invoices",
        icon: <ReceiptIcon />,
        module: "Sales",
      },
    ],
  },

  {
    title: "Suppliers",
    href: "/vendors",
    icon: <StoreIcon />,
    module: "Suppliers",
    children: [
      {
        title: "Vendors",
        href: "/vendors",
        icon: <PersonOutlined />,
        module: "Suppliers",
      },
      {
        title: "Purchases",
        href: "/purchases",
        icon: <ShoppingCartOutlined />,
        module: "Suppliers",
      },
    ],
  },
  {
    title: "Stocks",
    href: "/stocks",
    icon: <AllInboxOutlinedIcon />,
    module: "Stocks",
    children: [
      {
        title: "Batches",
        href: "/batches",
        icon: <CurrencyBitcoinOutlinedIcon />,
        module: "Stocks",
      },
      {
        title: "Stock Adjustment",
        href: "/stock-adjustments",
        icon: <EditOutlined />,
        module: "Stocks",
      },
      {
        title: "Stock Movements",
        href: "/stock-movements",
        icon: <ReceiptIcon />,
        module: "Stocks",
      },
    ],
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: <Inventory2Icon />,
    module: "Inventory",
    children: [
      {
        title: "Products",
        href: "/products",
        icon: <CategoryIcon />,
        module: "Inventory",
      },
      {
        title: "Product Categories",
        href: "/product-categories",
        icon: <ArticleOutlinedIcon />,
        module: "Inventory",
      },
    ],
  },
  {
    title: "Users",
    href: "/users",
    icon: <PersonOutlined />,
    module: "Users",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <SettingsIcon />,
    module: "Settings",
  },
];
