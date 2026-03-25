import { useState } from "react";
import { Navigation } from "./pages/Navigation";
import { HomePage } from "./pages/HomePage";
import { MissionPage } from "./pages/MissionPage";
import { BoardPage } from "./pages/BoardPage";
import { PartnersPage } from "./pages/PartnersPage";
import { CalendarPage } from "./pages/CalendarPage";
import { ChatPage } from "./pages/ChatPage";
import { ContactPage } from "./pages/ContactPage";
import { MentorPage } from "./pages/MentorPage";
import { LoginDialog } from "./pages/LoginDialog";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = (name) => {
    setIsLoggedIn(true);
    setUserName(name);
    setShowLogin(false);
    toast.success(`Welcome back, ${name}!`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setCurrentPage("home");
    toast.success("Successfully logged out");
  };

  const handleNavigate = (page) => {
    if (page === "chat" && !isLoggedIn) {
      toast.error("Please login to access the community chat");
      setShowLogin(true);
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
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
        userName={userName}
      />

      {currentPage === "home" && <HomePage />}
      {currentPage === "mission" && <MissionPage />}
      {currentPage === "contact" && <ContactPage />}
      {currentPage === "mentors" && <MentorPage />}
      {currentPage === "board" && <BoardPage />}
      {currentPage === "partners" && <PartnersPage />}
      {currentPage === "calendar" && (
        <CalendarPage
          isLoggedIn={isLoggedIn}
          onLoginPrompt={() => setShowLogin(true)}
        />
      )}
      {currentPage === "chat" && isLoggedIn && (
        <ChatPage userName={userName} />
      )}

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