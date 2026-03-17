import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Heart } from "lucide-react";

import { registerUser } from "../registration"
import { signInUser } from "../authentication"

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (name: string) => void;
}

export function LoginDialog({ open, onOpenChange, onLogin }: LoginDialogProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  })

  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    console.log(form);

    const { firstName, lastName, email, password} = form;

    if (!email || !password || (isSignUp && (!firstName || !lastName))) {
      return setError("Please fill in all required fields");
    }

    try {
      setLoading(true);

      if (isSignUp) {
        await registerUser(form.email, form.password, form.firstName, form.lastName);
        onLogin(`${firstName} ${lastName}`);

      } else {
        const result = await signInUser(email, password);

        const user = result.data.user;

        const name = user?.user_metadata?.first_name || "";

        onLogin(name);
      }

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
      })

      setIsSignUp(false)

    } catch (error: any){
      setError(error.message || "Authentication failed");

    } finally {
      setLoading(false)
    }

  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setError("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">

        <DialogHeader>

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-linear-to-br from-purple-100 to-violet-200 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-purple-700" />
            </div>
          </div>
        
          <DialogTitle className="text-center text-2x1">
            {isSignUp ? "Join Divas in Tech" : "Welcome Back"}
          </DialogTitle>

          <DialogDescription className="text-center">
            {isSignUp ? "Create an accoutn to access community features" : "Login to access the calendar and mentor chat"}
          </DialogDescription>

        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">

          {isSignUp && (
            <>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName"
                  value={form.firstName}
                  onChange={update("firstName")}
                  placeholder="First Name"
                />
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName"
                  value={form.lastName}
                  onChange={update("lastName")}
                  placeholder="Last Name"
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                value={form.email}
                onChange={update("email")}
                placeholder="Email"
              />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                value={form.password}
                onChange={update("password")}
                placeholder="Password"
              />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Login"}
          </Button>

          <div>
            {isSignUp ? "Already have an account?" : "Don't have and account?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-violet-700 hover:text-purple-800 hover:underline"
            >
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </div>

        </form>

      </DialogContent>
    </Dialog>
  );
}