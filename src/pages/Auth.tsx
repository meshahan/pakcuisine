import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [resetEmail, setResetEmail] = useState("");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      toast({ title: "Welcome back!", description: "You've been logged in successfully." });
      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);

    try {
      const redirectUrl = `${window.location.origin}/admin/reset-password`; // Ensure this route exists or redirect to a valid page
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;

      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
      setIsResetDialogOpen(false);
      setResetEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - Pak Cuisine</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-2xl">P</span>
              </div>
              <span className="font-display text-3xl font-bold text-primary-foreground">
                Pak Cuisine
              </span>
            </div>
            <p className="text-secondary-foreground/70">Admin Dashboard</p>
          </div>

          {/* Auth Card */}
          <div className="bg-card rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="admin@pakcuisine.com"
                  required
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Password</Label>
                  <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Forgot Password?
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="reset-email">Email Address</Label>
                          <Input
                            id="reset-email"
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-gradient-primary"
                          disabled={isResetting}
                        >
                          {isResetting ? "Sending..." : "Send Reset Link"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </div>

          <p className="text-center mt-6 text-secondary-foreground/60 text-sm">
            <a href="/" className="hover:text-primary transition-colors">
              ← Back to website
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Auth;
