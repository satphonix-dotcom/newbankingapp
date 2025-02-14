
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import KYC from "@/pages/KYC";
import KYCSubmit from "@/pages/KYCSubmit";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminKYCPage from "@/pages/AdminKYCPage";
import AdminUserPage from "@/pages/AdminUserPage";
import AccountDetail from "@/pages/AccountDetail";
import TransactionsDetail from "@/pages/TransactionsDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/kyc",
    element: <KYC />,
  },
  {
    path: "/kyc/submit",
    element: <KYCSubmit />,
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/kyc/:id",
    element: <AdminKYCPage />,
  },
  {
    path: "/admin/users/:id",
    element: <AdminUserPage />,
  },
  {
    path: "/accounts/:id",
    element: <AccountDetail />,
  },
  {
    path: "/transactions/:id",
    element: <TransactionsDetail />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
