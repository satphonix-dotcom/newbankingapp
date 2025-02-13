
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import GetStarted from "./pages/GetStarted";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserPage from "./pages/AdminUserPage";
import AccountDetail from "./pages/AccountDetail";
import TransactionsDetail from "./pages/TransactionsDetail";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Documentation from "./pages/Documentation";
import HelpCenter from "./pages/HelpCenter";
import Press from "./pages/Press";
import Security from "./pages/Security";
import Status from "./pages/Status";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import KYC from "./pages/KYC";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-dashboard/user/:userId" element={<AdminUserPage />} />
      <Route path="/account/:accountId" element={<AccountDetail />} />
      <Route path="/transactions" element={<TransactionsDetail />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/help-center" element={<HelpCenter />} />
      <Route path="/press" element={<Press />} />
      <Route path="/security" element={<Security />} />
      <Route path="/status" element={<Status />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/kyc" element={<KYC />} />
    </Routes>
  );
}

export default App;
