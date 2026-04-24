import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Lock, CheckCircle } from "lucide-react";

import { supabase } from "../supabaseConnection";
import { updatePassword } from "../forgotPassword";


export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      return setError("Please fill in both fields.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match. Please try again.");
    }

    try {
      setLoading(true);
      await updatePassword(password);
      await supabase.auth.signOut();
      setIsSuccess(true);
    } catch (error: any) {
      setError(error.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Password Updated!</h2>
          <p className="text-gray-600 pb-4">
            Your password has been successfully reset. We've sent a confirmation email. You can now log in with your new password.
          </p>
          <Button className="w-full" onClick={() => window.location.href = "/"}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-linear-to-br from-purple-100 to-violet-200 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-purple-700" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Update Password</h2>
        <p className="text-gray-600 text-center mb-8">
          Please enter your new password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">New Password</Label>
            <Input 
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>

      </div>
    </div>
  );
}