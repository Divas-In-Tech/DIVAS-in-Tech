import { useState, useEffect } from "react";
import { Navigation } from "./pages/Navigation";
import { HomePage } from "./pages/HomePage";
import { MissionPage } from "./pages/MissionPage";
import { BoardPage } from "./pages/BoardPage";
import { PartnersPage } from "./pages/PartnersPage";
import { CalendarPage } from "./pages/CalendarPage";
import { ContactPage } from "./pages/ContactPage";
import { MentorPage } from "./pages/MentorPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { LoginDialog } from "./pages/LoginDialog";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

import { supabase } from './supabaseConnection';
import ResetPassword from "./pages/ResetPassword";

export default function App() {
  const defaultIsAdmin = import.meta.env.DEV; //NOTE: Admin access is enabled by default in development mode for testing purposes
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [userName, setUserName] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  // without this, the reset email can't redirect to the reset page
  const [currentPage, setCurrentPage] = useState(() => {
    if (window.location.pathname === '/reset-password') {
      return "reset-password";
    }
    return "home";
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        const firstName = session.user.user_metadata?.first_name || "";
        const lastName = session.user.user_metadata?.last_name || "";
        setUserName(`${firstName} ${lastName}`.trim() || "User");
      }
    });
  }, []);

useEffect(() => {
    async function checkAdminStatus() {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData, error } = await supabase
          .from("users")
          .select("role")
          .eq("email", user.email)
          .single();

        if (profileData && profileData.role === "admin") {
          setIsAdmin(true);
        }
        
        if (error) console.error("Error fetching profile:", error.message);
      }
    }


    async function checkApprovalStatus() {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData, error } = await supabase
          .from("users")
          .select("approved")
          .eq("email", user.email)
          .single();

        if (profileData && profileData.approved === true) {
          setIsApproved(true);
        }
        
        if (error) console.error("Error fetching profile:", error.message);
      }
    }

    checkApprovalStatus()
    checkAdminStatus();
  }, []);


  const handleLogin = (name) => {
    setIsLoggedIn(true);
    setUserName(name);
    setShowLogin(false);
    toast.success(`Welcome back, ${name}!`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setIsLoggedIn(false);
    setIsAdmin(defaultIsAdmin);
    setUserName("");
    setCurrentPage("home");
    toast.success("Successfully logged out");
  };

  const handleNavigate = (page) => {
    if (page === "admin" && !isAdmin) {
      toast.error("Admin access is required to view the dashboard");
      return;
    }

    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
        userName={userName}
        isApproved={isApproved}
      />

      {currentPage === "home" && <HomePage />}
      {currentPage === "mission" && <MissionPage />}
      {currentPage === "contact" && <ContactPage />}
      {currentPage === "mentors" && isApproved && <MentorPage />}
      {currentPage === "board" && <BoardPage />}
      {currentPage === "partners" && <PartnersPage />}
      {currentPage === "calendar" && (
        <CalendarPage
          isLoggedIn={isLoggedIn}
          onLoginPrompt={() => setShowLogin(true)}
        />
      )}
      {currentPage === "admin" && isAdmin && <AdminDashboard />}
      {currentPage === "reset-password" && <ResetPassword />}

      <LoginDialog
        open={showLogin}
        onOpenChange={setShowLogin}
        onLogin={handleLogin}
      />

      <Toaster />

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-400">© 2025 Divas in Tech. Empowering women in technology.</p>
            <p className="text-gray-500 text-sm mt-2">A non-profit organization dedicated to closing the gender gap in tech</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
