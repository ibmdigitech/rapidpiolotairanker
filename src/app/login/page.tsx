"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Rocket, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to sign in. Please verify your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google sign-in failed.";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-84 h-84 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-84 h-84 rounded-full bg-accent/15 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header/Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 group mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-md">
              <Rocket className="h-5 w-5 text-background font-bold" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-white">
              RankPilot<span className="text-accent font-extrabold">.AI</span>
            </span>
          </Link>
          <h1 className="font-heading font-bold text-2xl text-white">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-2">Log in to manage your website rankings</p>
        </div>

        {/* Card Form */}
        <div className="glass-card rounded-2xl p-8 border-white/5 shadow-2xl">
          {error && (
            <div className="flex items-center space-x-2 bg-destructive/10 border border-destructive/20 text-destructive-foreground text-sm p-3 rounded-xl mb-6">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground"><Mail className="h-4.5 w-4.5" /></span>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/5 focus:border-primary/50 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground"><Lock className="h-4.5 w-4.5" /></span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/5 focus:border-primary/50 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-background font-bold hover:opacity-90 active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer mt-6"
            >
              <span>{loading ? "Logging in..." : "Log In"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-6 text-center">
            <span className="absolute inset-x-0 top-1/2 border-b border-white/5 -z-10" />
            <span className="bg-neutral-950 px-3 text-xs text-muted-foreground">Or continue with</span>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-xl border border-white/5 hover:border-white/10 bg-neutral-900 hover:bg-neutral-850 text-sm font-semibold text-white transition-colors flex items-center justify-center space-x-2.5 cursor-pointer"
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google Account</span>
          </button>

          <p className="text-center text-xs text-muted-foreground mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-accent hover:underline font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
