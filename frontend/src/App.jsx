import { Routes, Route, useLocation } from "react-router-dom";

// 🔥 LAYOUT
import DashboardLayout from "./components/DashboardLayout";

// 🔥 MAIN PAGES
import Home from "./pages/Home";
import Learning from "./pages/Learning";
import AISection from "./pages/AISection";
import AIChat from "./pages/AIChat";


// 🔥 MOCK FLOW
import MockInterview from "./pages/MockInterview";
import PerformancePage from "./pages/PerformancePage";
import RoleBasedPage from "./pages/RoleBased";
import ResumeBasedPage from "./pages/ResumeBasedPage";
import Instructions from "./pages/Instructions";
import ReportPage from "./pages/ReportPage";
import CompanySpecificPage from "./pages/CompanySpecificPage";
import CardPage from "./pages/CardPage"; // ✅ ADDED

import AssessmentRound from "./pages/AssessmentRound";
import CodingRound from "./pages/CodingRound";
import InterviewRound from "./pages/InterviewRound";
import ResultPage from "./pages/ResultPage";

// 🔥 OTHER PAGES
import Analytics from "./pages/MyAnalytics";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/Password";
import LogoutPage from "./pages/Logout";
import CommunityPage from "./pages/Community";
import SectionPage from "./pages/SectionPage";

// 🔥 STATIC
import Copyright from "./pages/Copyright";
import Cookies from "./pages/Cookies";
import TermsOfService from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";


// 🔐 AUTH
import LoginPage from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import NotificationPage from "./pages/Notification";

// ❌ 404 PAGE
const NotFound = () => (
  <div className="flex items-center justify-center h-screen text-white bg-[#0f172a]">
    <h1 className="text-xl">404 - Page Not Found</h1>
  </div>
);

function App() {
  const location = useLocation();
  const state = location.state;

  return (
    <>
      {/* ✅ MAIN ROUTES */}
      <Routes location={state?.background || location}>

        {/* 🔥 DASHBOARD LAYOUT */}
        <Route path="/" element={<DashboardLayout />}>

          {/* 🏠 */}
          <Route index element={<Home />} />
          <Route path="learning" element={<Learning />} />
          <Route path="ai" element={<AISection />} />
          <Route path="aichat" element={<AIChat />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="section" element={<SectionPage />} />

          {/* 🎯 MOCK FLOW */}
          <Route path="mock">

            <Route index element={<MockInterview />} />
            <Route path="performance" element={<PerformancePage />} />
            <Route path="role" element={<RoleBasedPage />} />
            <Route path="resume" element={<ResumeBasedPage />} />
            <Route path="instructions" element={<Instructions />} />
            <Route path="report" element={<ReportPage />} />
            <Route path="company" element={<CompanySpecificPage />} />

            {/* 🔥 FIX (YOUR ISSUE) */}
            <Route path="card" element={<CardPage />} />

            <Route path="assessment" element={<AssessmentRound />} />
            <Route path="coding" element={<CodingRound />} />
            <Route path="interview" element={<InterviewRound />} />
            <Route path="result" element={<ResultPage />} />
            <Route path="result/:id" element={<ResultPage />} />

          </Route>

          {/* 📊 */}
          <Route path="analytics" element={<Analytics />} />

          {/* 👤 */}
          <Route path="profile" element={<Profile />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="password" element={<ChangePassword />} />
          <Route path="logout" element={<LogoutPage />} />

        </Route>

        {/* 🔐 NORMAL ROUTES */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />

        {/* 📄 STATIC */}
        <Route path="/copyright" element={<Copyright />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* ❌ 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* ✅ MODAL ROUTES */}
      {state?.background && (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      )}
    </>
  );
}

export default App;