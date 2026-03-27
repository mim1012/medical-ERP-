import { createBrowserRouter } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { ClientManagement } from "./pages/ClientManagement";
import { ProductManagement } from "./pages/ProductManagement";
import { InventoryManagement } from "./pages/InventoryManagement";
import { ReceivingManagement } from "./pages/ReceivingManagement";
import { ShippingManagement } from "./pages/ShippingManagement";
import { ServiceManagement } from "./pages/ServiceManagement";
import { DocumentManagement } from "./pages/DocumentManagement";
import { SettlementManagement } from "./pages/SettlementManagement";
import { UserManagement } from "./pages/UserManagement";
import { TaxInvoiceManagement } from "./pages/TaxInvoiceManagement";
import { AlertCenter } from "./pages/AlertCenter";
import { LogHistory } from "./pages/LogHistory";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Dashboard,
  },
  {
    path: "/clients",
    Component: ClientManagement,
  },
  {
    path: "/products",
    Component: ProductManagement,
  },
  {
    path: "/inventory",
    Component: InventoryManagement,
  },
  {
    path: "/receiving",
    Component: ReceivingManagement,
  },
  {
    path: "/shipping",
    Component: ShippingManagement,
  },
  {
    path: "/service",
    Component: ServiceManagement,
  },
  {
    path: "/documents",
    Component: DocumentManagement,
  },
  {
    path: "/settlement",
    Component: SettlementManagement,
  },
  {
    path: "/users",
    Component: UserManagement,
  },
  {
    path: "/invoice",
    Component: TaxInvoiceManagement,
  },
  {
    path: "/alerts",
    Component: AlertCenter,
  },
  {
    path: "/logs",
    Component: LogHistory,
  },
]);