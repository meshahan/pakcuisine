import { useState, useEffect } from "react";
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
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [authData, setAuthData] = useState({ email: "", password: "", fullName: "" });
  const [resetEmail, setResetEmail] = useState("");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user) {
        // Optional: Auto-redirect if needed, but showing status is better for clarity
        // const role = session.user.user_metadata?.role;
        // if (role === 'admin') navigate('/admin');
        // else navigate('/dashboard');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    toast({ title: "Logged out" });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authData.email,
          password: authData.password,
        });

        if (error) throw error;

        toast({ title: "Welcome back!", description: "You've been logged in successfully." });

        // Check role (simplified: admins often have metadata or specific emails)
        const user = data.user;
        const role = user?.user_metadata?.role;

        if (role === 'customer') {
          navigate("/dashboard");
        } else {
          navigate("/admin");
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email: authData.email,
          password: authData.password,
          options: {
            data: {
              full_name: authData.fullName,
              role: 'customer'
            }
          }
        });

        if (error) throw error;

        toast({
          title: "Account Created!",
          description: "Check your email to verify your account."
        });
        setMode('login');
      }
    } catch (error: any) {
      toast({
        title: mode === 'login' ? "Login Failed" : "Sign Up Failed",
        description: error.message || "Something went wrong.",
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

  if (currentUser) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card rounded-2xl p-8 shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Already Logged In</h2>
          <p className="text-muted-foreground mb-6">
            You are currently logged in as <span className="font-semibold text-foreground">{currentUser?.email || 'User'}</span>
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate(currentUser?.user_metadata?.role === 'customer' ? '/dashboard' : '/admin')}
              className="w-full"
            >
              Go to Dashboard
            </Button>
            <Button onClick={handleLogout} variant="outline" className="w-full text-destructive hover:bg-destructive/10">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            <p className="text-secondary-foreground/70">
              {mode === 'login' ? 'Sign in to your account' : 'Create your customer account'}
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-card rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-center mb-6">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <form onSubmit={handleAuth} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={authData.fullName}
                    onChange={(e) => setAuthData({ ...authData, fullName: e.target.value })}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={authData.email}
                  onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Password</Label>
                  {mode === 'login' && (
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
                  )}
                </div>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={authData.password}
                  onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? (mode === 'login' ? "Logging in..." : "Creating Account...") : (mode === 'login' ? "Login" : "Sign Up")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
          </div>

          <p className="text-center mt-6 text-secondary-foreground/60 text-sm flex items-center justify-center gap-4">
            <a href="/" className="hover:text-primary transition-colors">
              ← Back to website
            </a>
            <span className="text-muted-foreground">|</span>
            <button
              onClick={() => navigate('/admin')}
              className="hover:text-primary transition-colors"
            >
              Admin Access
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default Auth;
