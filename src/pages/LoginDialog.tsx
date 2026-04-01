import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Heart } from "lucide-react";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (name: string) => void;
}

export function LoginDialog({ open, onOpenChange, onLogin }: LoginDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (isSignUp && !name) {
      setError("Please enter your name");
      return;
    }

    // Mock authentication - in a real app, this would validate against a backend
    const userName = isSignUp ? name : email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
    onLogin(userName);
    
    // Reset form
    setEmail("");
    setPassword("");
    setName("");
    setIsSignUp(false);
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-200 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-purple-700" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            {isSignUp ? "Join Divas in Tech" : "Welcome Back"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isSignUp 
              ? "Create an account to access community features" 
              : "Login to access the calendar and mentorship page"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {isSignUp && (
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full">
            {isSignUp ? "Sign Up" : "Login"}
          </Button>

          <div className="text-center text-sm">
            {isSignUp ? (
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError("");
                  }}
                  className="text-violet-700 hover:underline hover:text-purple-800"
                >
                  Login
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError("");
                  }}
                  className="text-violet-700 hover:underline hover:text-purple-800"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500 text-center">
              Demo: Use any email and password to login
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}