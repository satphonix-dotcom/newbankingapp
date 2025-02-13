
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import GetStarted from "./pages/GetStarted";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import AccountDetail from "./pages/AccountDetail";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserPage from "./pages/AdminUserPage";
import Documentation from "./pages/Documentation";
import HelpCenter from "./pages/HelpCenter";
import Contact from "./pages/Contact";
import Status from "./pages/Status";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";
import Cookies from "./pages/Cookies";
import Profile from "./pages/Profile";
import TransactionsDetail from "./pages/TransactionsDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account/:id" element={<AccountDetail />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users/:id" element={<AdminUserPage />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/status" element={<Status />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/press" element={<Press />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/security" element={<Security />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/transactions" element={<TransactionsDetail />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
