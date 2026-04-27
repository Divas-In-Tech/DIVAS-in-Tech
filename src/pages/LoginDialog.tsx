import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Heart, Mail } from "lucide-react";

import { registerUser } from "../registration"
import { signInUser } from "../authentication"
import { sendResetPasswordEmail } from "../forgotPassword";

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
    isUnder13: "",
    parentEmail: "",
    eventAttended: "",
    password: "",
    accountType: "",
    affiliation: "",
  })

  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isPasswordReset, setPasswordReset] = useState(false)

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isPasswordReset) {
      if (!form.email) {
        return setError("Please enter your email");
      }

      try {
        setLoading(true);
        await sendResetPasswordEmail(form.email);
        setUserEmail(form.email);
        setIsSuccess(true);
      } catch (error: any) {
        setError(error.message || "Failed to send reset email");
      } finally {
        setLoading(false)
      }
      return;
    }

    const { firstName, lastName, email, password} = form;

    if (!email || !password || (isSignUp && (!firstName || !lastName))) {
      return setError("Please fill in all required fields");
    }

    try {
      setLoading(true);

      if (isSignUp) {
        await registerUser(form.email, form.password, form.firstName, form.lastName, form.eventAttended, form.isUnder13, form.parentEmail);
        setUserEmail(form.email);
        setIsSuccess(true);

      } else {
        const result = await signInUser(email, password);

        const user = result.data.user;

        const name = user?.user_metadata?.first_name || "";

        onLogin(name);
        window.location.reload();
      }

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        isUnder13: "",
        parentEmail: "",
        eventAttended: "",
        password: "",
        accountType: "",
        affiliation: ""
      })

      setIsSignUp(false)

    } catch (error: any){
      setError(error.message || "Authentication failed");

    } finally {
      setLoading(false)
    }

  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setPasswordReset(false);
    setError("");
  }

  const togglePasswordReset = () => {
    setPasswordReset(!isPasswordReset);
    setError("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-center text-2xl">
              Please check your email
            </DialogTitle>
            <DialogDescription className="text-center text-md pb-4">
              We've sent an email to <span className="font-semibold text-black">{userEmail}</span>. 
              {isPasswordReset 
                ? " Please use the link to reset your password." 
                : " Please verify to activate your account in order to log in."}
            </DialogDescription>
            <Button className="w-full" 
              onClick={() => {
                setIsSuccess(false);
                setIsSignUp(false);
                setPasswordReset(false);
                setForm({ firstName: "", lastName: "", email: "", isUnder13: "", parentEmail: "", eventAttended: "", password: "", accountType: "", affiliation: "" });
              }} >
              Return to Login
            </Button>
          </div>
        ) : (

        <>
        <DialogHeader>

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-linear-to-br from-purple-100 to-violet-200 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-purple-700" />
            </div>
          </div>
        
          <DialogTitle className="text-center text-2xl">
            {isPasswordReset ? "Reset Password" : isSignUp ? "Join Divas in Tech" : "Welcome Back"}
          </DialogTitle>

          <DialogDescription className="text-center">
            {isPasswordReset 
              ? "Enter your email address and we'll send you a link to reset your password."
              : isSignUp ? "Create an account to access community features" : "Login to access the calendar and mentor chat"}
          </DialogDescription>

        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">

          {isSignUp && !isPasswordReset && (
            <>


              <div>
                <div>
                <label htmlFor="accountType" className="block text-sm font-medium text-gray-800">Account Type</label>
                  <select
                      id="accountType"
                      name="accountType"
                      value={form.accountType}
                      onChange={update("accountType")}
                      required
                      className="mt-2 block w-full rounded-md py-2 px-3 border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                    >
                      <option value="">Please select an option</option>
                      <option value="student">Student</option>
                      <option value="volunteer">Voluneteer</option>
                    </select>
                </div>

                {form.accountType === "volunteer" && (
                  <div>
                    <Label htmlFor="affiliation">Affiliation</Label>
                    <Input 
                      id="affiliation"
                      type="email"
                      value={form.affiliation}
                      onChange={update("affiliation")}
                      placeholder="Affiliation"
                    />
                  </div>
                )}
              </div>



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

              <div>
                <Label htmlFor="eventAttended">Event Attended</Label>
                <Input
                  id="eventAttended"
                  value={form.eventAttended}
                  onChange={update("eventAttended")}
                  placeholder="Event Attended"
                />
              </div>


              {form.accountType === "student" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                    id="under13"
                    checked={form.isUnder13 === "true"}
                    onChange={(e) => setForm({ ...form, isUnder13: e.target.checked ? "true" : "" })}
                  />
                  <Label htmlFor="under13">I am under 13 years old</Label>
                </div>

                {form.isUnder13 && (
                  <div>
                    <Label htmlFor="parentEmail">Parent Email</Label>
                    <Input 
                      id="parentEmail"
                      type="email"
                      value={form.parentEmail}
                      onChange={update("parentEmail")}
                      placeholder="Parent Email"
                    />
                  </div>
                )}
                </div>
              )}
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

          {!isPasswordReset && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="password">Password</Label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={togglePasswordReset}
                    className="text-xs text-violet-700 hover:text-purple-800 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <Input 
                id="password"
                type="password"
                value={form.password}
                onChange={update("password")}
                placeholder="Password"
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : isPasswordReset ? "Send Reset Link" : isSignUp ? "Sign Up" : "Login"}
          </Button>

          <div className="text-center text-sm pt-2">
            {isPasswordReset ? (
              <button
                type="button"
                onClick={togglePasswordReset}
                className="text-violet-700 hover:text-purple-800 hover:underline"
              >
                Back to Login
              </button>
            ) : (
              <div>
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-violet-700 hover:text-purple-800 hover:underline"
                >
                  {isSignUp ? "Login" : "Sign Up"}
                </button>
              </div>
            )}
          </div>

        </form>
        </>
        )}

      </DialogContent>
    </Dialog>
  );
}