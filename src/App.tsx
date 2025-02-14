
import { createBrowserRouter, RouterProvider, isRouteErrorResponse, useRouteError } from "react-router-dom";
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
import Features from "@/pages/Features";
import Pricing from "@/pages/Pricing";
import Security from "@/pages/Security";
import Status from "@/pages/Status";
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import Careers from "@/pages/Careers";
import Press from "@/pages/Press";
import Documentation from "@/pages/Documentation";
import HelpCenter from "@/pages/HelpCenter";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Cookies from "@/pages/Cookies";

function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">
            {error.status} {error.statusText}
          </h1>
          <p className="text-secondary mb-4">{error.data}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Oops!</h1>
        <p className="text-secondary mb-4">Something went wrong</p>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <ErrorBoundary />,
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
  {
    path: "/features",
    element: <Features />,
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/security",
    element: <Security />,
  },
  {
    path: "/status",
    element: <Status />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/careers",
    element: <Careers />,
  },
  {
    path: "/press",
    element: <Press />,
  },
  {
    path: "/documentation",
    element: <Documentation />,
  },
  {
    path: "/help-center",
    element: <HelpCenter />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/cookies",
    element: <Cookies />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
