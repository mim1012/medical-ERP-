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
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: "/clients",
    element: <ProtectedRoute><ClientManagement /></ProtectedRoute>,
  },
  {
    path: "/products",
    element: <ProtectedRoute><ProductManagement /></ProtectedRoute>,
  },
  {
    path: "/inventory",
    element: <ProtectedRoute><InventoryManagement /></ProtectedRoute>,
  },
  {
    path: "/receiving",
    element: <ProtectedRoute><ReceivingManagement /></ProtectedRoute>,
  },
  {
    path: "/shipping",
    element: <ProtectedRoute><ShippingManagement /></ProtectedRoute>,
  },
  {
    path: "/service",
    element: <ProtectedRoute><ServiceManagement /></ProtectedRoute>,
  },
  {
    path: "/documents",
    element: <ProtectedRoute><DocumentManagement /></ProtectedRoute>,
  },
  {
    path: "/settlement",
    element: <ProtectedRoute><SettlementManagement /></ProtectedRoute>,
  },
  {
    path: "/users",
    element: <ProtectedRoute><UserManagement /></ProtectedRoute>,
  },
  {
    path: "/invoice",
    element: <ProtectedRoute><TaxInvoiceManagement /></ProtectedRoute>,
  },
  {
    path: "/alerts",
    element: <ProtectedRoute><AlertCenter /></ProtectedRoute>,
  },
  {
    path: "/logs",
    element: <ProtectedRoute><LogHistory /></ProtectedRoute>,
  },
]);
