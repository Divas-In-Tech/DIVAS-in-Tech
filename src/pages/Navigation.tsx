import { Button } from "../components/ui/button";
import { LogOut, LogIn, Flower } from "lucide-react";

type Page = "home" | "mission" | "board" | "mentors" | "partners" | "calendar" |"contact" | "admin";

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
  userName: string;
}

export function Navigation({ currentPage, onNavigate, isLoggedIn, isAdmin, onLoginClick, onLogout, userName }: NavigationProps) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 bg-[rgba(221,79,221,0)]">
            <Flower className="w-8 h-8 text-violet-600" />
            <span className="text-[rgb(145,78,228)]">Divas in Tech</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`transition-colors ${
                currentPage === 'home' ? 'text-purple-700' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('mission')}
              className={`transition-colors ${
                currentPage === 'mission' ? 'text-purple-700' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Mission
            </button>
            <button
              onClick={() => onNavigate('board')}
              className={`transition-colors ${
                currentPage === 'board' ? 'text-purple-700' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Board
              </button>
        {/*Mentor Page down below V */}
            {isLoggedIn &&(
            <button
              onClick={() => onNavigate('mentors')}
              className={`transition-colors ${
                currentPage === 'mentors' ? 'text-purple-700' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Mentors
            </button>
            )}
            <button
              onClick={() => onNavigate('partners')}
              className={`transition-colors ${
                currentPage === 'partners' ? 'text-purple-700' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Partners
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className={`transition-colors ${
                currentPage === 'contact' ? 'text-purple-700' : 'text-gray-600 hover:text-purple-600'
              }`}
            > 
            Contact 
            </button>
            <button
              onClick={() => onNavigate('calendar')}
              className={`transition-colors ${
                currentPage === 'calendar' ? 'text-purple-700' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Calendar
            </button>
            {isLoggedIn && isAdmin ? (
              <button
              onClick={() => onNavigate('admin')}
              className={`transition-colors ${
                currentPage === 'admin' ? 'text-purple-700' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Admin Dashboard
            </button>
            )
            : null}
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <span className="text-gray-600 text-sm">Welcome, {userName}</span>
                <Button onClick={onLogout} variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={onLoginClick} variant="default" size="sm">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
