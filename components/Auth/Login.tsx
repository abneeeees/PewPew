"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginGoogle, loginDiscord, loginCredentials } from "../../lib/auth";

// Easily configurable wallpapers
const WALLPAPERS = [
  "/wallpapers/bg-1.jpeg", 
  "/wallpapers/bg-2.jpeg",
  "/wallpapers/bg-3.jpeg",
  "/wallpapers/bg-4.jpeg",
  "/wallpapers/bg-5.jpeg",
  "/wallpapers/bg-6.jpeg",
  "/wallpapers/bg-7.jpeg",
  "/wallpapers/bg-8.jpeg",

];


// Validation schemas
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Rotating background logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % WALLPAPERS.length);
    }, 15000); // 15 seconds interval
    return () => clearInterval(interval);
  }, []);

  // Form Hooks
  const {
    register: registerSignIn,
    handleSubmit: handleSignInSubmit,
    formState: { errors: signInErrors },
    reset: resetSignIn,
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
  });

  const {
    register: registerSignUp,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signUpErrors },
    reset: resetSignUp,
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
  });

  // Switch tabs & reset state
  const handleTabChange = (signUpMode: boolean) => {
    setIsSignUp(signUpMode);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrorMsg(null);
    setSuccessMsg(null);
    resetSignIn();
    resetSignUp();
  };

  // Sign In Handler
  const onSignIn = async (data: SignInValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await loginCredentials(data);
      if (response?.error) {
        setErrorMsg(response.error);
      } else {
        setSuccessMsg("Signed in successfully! Redirecting...");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up Handler
  const onSignUp = async (data: SignUpValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.username,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMsg(result.error || "Failed to create account.");
        return;
      }

      setSuccessMsg("Account created! Logging in automatically...");

      // Automatically sign the user in after signing up
      const loginRes = await loginCredentials({
        email: data.email,
        password: data.password,
      });

      if (loginRes?.error) {
        setErrorMsg("Account created, but automatic sign-in failed. Please sign in manually.");
        setIsSignUp(false);
      }
    } catch (err) {
      setErrorMsg("Something went wrong during sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic Theme Config
  const theme = isSignUp
    ? {
        accent: "purple",
        text: "text-purple-400",
        border: "border-purple-500/20 focus:border-purple-400 focus:ring-purple-500/20",
        bg: "bg-purple-600 hover:bg-purple-500 shadow-purple-500/20",
        glow: "shadow-[0_0_20px_rgba(168,85,247,0.15)]",
        btnBorder: "border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/5 focus:ring-purple-500/20",
      }
    : {
        accent: "blue",
        text: "text-blue-400",
        border: "border-blue-500/20 focus:border-blue-400 focus:ring-blue-500/20",
        bg: "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20",
        glow: "shadow-[0_0_20px_rgba(59,130,246,0.15)]",
        btnBorder: "border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/5 focus:ring-blue-500/20",
      };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans select-none px-4 py-8">
      {/* Background Wallpapers */}
      <div className="absolute inset-0 z-0">
        {WALLPAPERS.map((wp, idx) => (
          <div
            key={wp}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out`}
            style={{
              backgroundImage: `url(${wp})`,
              opacity: idx === currentBg ? 1 : 0,
            }}
          />
        ))}
        {/* Dark overlay to increase text contrast */}
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] z-10" />
      </div>

      {/* Main Container Card */}
      <div
        className={`relative z-20 w-full max-w-[440px] rounded-2xl border border-white/10 bg-zinc-950/45 backdrop-blur-xl p-6 md:p-8 transition-all duration-500 ease-in-out ${theme.glow}`}
      >
        {/* Header / Logo */}
        <div className="text-center mb-6">
          <h1
            className={`text-3xl font-extrabold tracking-wider transition-all duration-500 bg-gradient-to-r bg-clip-text text-transparent ${
              isSignUp ? "from-purple-400 to-pink-500" : "from-blue-400 to-indigo-500"
            }`}
          >
            PEWPEW
          </h1>
          <p className="text-zinc-400 text-xs mt-1">online community for gamers</p>
        </div>

        {/* Custom Tab Switcher */}
        <div className="relative flex p-1 bg-black/45 rounded-xl border border-white/5 mb-6">
          {/* Sliding active pill indicator */}
          <div
            className={`absolute top-1 bottom-1 rounded-lg transition-all duration-500 ease-in-out ${
              isSignUp ? "left-1/2 w-[calc(50%-4px)] bg-purple-600/70" : "left-1 w-[calc(50%-4px)] bg-blue-600/70"
            }`}
          />
          <button
            type="button"
            onClick={() => handleTabChange(false)}
            className={`relative z-10 w-1/2 py-2 text-sm font-semibold transition-colors duration-500 ${
              !isSignUp ? "text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleTabChange(true)}
            className={`relative z-10 w-1/2 py-2 text-sm font-semibold transition-colors duration-500 ${
              isSignUp ? "text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Global Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium animate-fade-in">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center font-medium animate-fade-in">
            {successMsg}
          </div>
        )}

        {/* Slide-out Form Viewport */}
        <div className="overflow-hidden">
          <div
            className="flex w-[200%] transition-transform duration-500 ease-in-out"
            style={{ transform: isSignUp ? "translateX(-50%)" : "translateX(0%)" }}
          >
            {/* -------------------- SIGN IN FORM -------------------- */}
            <form onSubmit={handleSignInSubmit(onSignIn)} className="w-1/2 pr-2 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-300">Email Address</label>
                <input
                  type="email"
                  disabled={isLoading}
                  placeholder="name@example.com"
                  {...registerSignIn("email")}
                  className={`w-full px-3.5 py-2 text-sm rounded-lg bg-black/35 border text-zinc-100 placeholder:text-zinc-600 outline-none transition-all duration-300 focus:ring-4 ${theme.border}`}
                />
                {signInErrors.email && (
                  <span className="text-[10px] text-red-400 font-medium">{signInErrors.email.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5 relative">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-zinc-300">Password</label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    disabled={isLoading}
                    placeholder="••••••••"
                    {...registerSignIn("password")}
                    className={`w-full pl-3.5 pr-10 py-2 text-sm rounded-lg bg-black/35 border text-zinc-100 placeholder:text-zinc-600 outline-none transition-all duration-300 focus:ring-4 ${theme.border}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {signInErrors.password && (
                  <span className="text-[10px] text-red-400 font-medium">{signInErrors.password.message}</span>
                )}
              </div>

              <div className="flex items-center justify-between mt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-zinc-200 transition-colors">
                  <input
                    type="checkbox"
                    disabled={isLoading}
                    {...registerSignIn("rememberMe")}
                    className={`w-4.5 h-4.5 rounded border bg-black/40 text-blue-600 outline-none transition-all focus:ring-0 ${
                      isSignUp ? "accent-purple-500 border-purple-500/30" : "accent-blue-500 border-blue-500/30"
                    }`}
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className={`font-semibold hover:underline transition-all duration-500 ${theme.text}`}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 mt-2 rounded-lg font-bold text-white transition-all duration-500 text-sm active:scale-[0.98] cursor-pointer ${theme.bg}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* -------------------- SIGN UP FORM -------------------- */}
            <form onSubmit={handleSignUpSubmit(onSignUp)} className="w-1/2 pl-2 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-300">Username</label>
                <input
                  type="text"
                  disabled={isLoading}
                  placeholder="GamerName"
                  {...registerSignUp("username")}
                  className={`w-full px-3.5 py-2 text-sm rounded-lg bg-black/35 border text-zinc-100 placeholder:text-zinc-600 outline-none transition-all duration-300 focus:ring-4 ${theme.border}`}
                />
                {signUpErrors.username && (
                  <span className="text-[10px] text-red-400 font-medium">{signUpErrors.username.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-300">Email Address</label>
                <input
                  type="email"
                  disabled={isLoading}
                  placeholder="name@example.com"
                  {...registerSignUp("email")}
                  className={`w-full px-3.5 py-2 text-sm rounded-lg bg-black/35 border text-zinc-100 placeholder:text-zinc-600 outline-none transition-all duration-300 focus:ring-4 ${theme.border}`}
                />
                {signUpErrors.email && (
                  <span className="text-[10px] text-red-400 font-medium">{signUpErrors.email.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-300">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    disabled={isLoading}
                    placeholder="••••••••"
                    {...registerSignUp("password")}
                    className={`w-full pl-3.5 pr-10 py-2 text-sm rounded-lg bg-black/35 border text-zinc-100 placeholder:text-zinc-600 outline-none transition-all duration-300 focus:ring-4 ${theme.border}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {signUpErrors.password && (
                  <span className="text-[10px] text-red-400 font-medium">{signUpErrors.password.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-300">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    disabled={isLoading}
                    placeholder="••••••••"
                    {...registerSignUp("confirmPassword")}
                    className={`w-full pl-3.5 pr-10 py-2 text-sm rounded-lg bg-black/35 border text-zinc-100 placeholder:text-zinc-600 outline-none transition-all duration-300 focus:ring-4 ${theme.border}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {signUpErrors.confirmPassword && (
                  <span className="text-[10px] text-red-400 font-medium">{signUpErrors.confirmPassword.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 mt-2 rounded-lg font-bold text-white transition-all duration-500 text-sm active:scale-[0.98] cursor-pointer ${theme.bg}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* OR Continue With Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#121214]/90 px-3 text-zinc-500 font-medium tracking-wide">or continue with</span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => loginGoogle()}
            className={`w-full sm:w-1/2 py-2 px-4 flex items-center justify-center gap-2.5 text-xs font-semibold text-zinc-300 rounded-lg bg-black/25 border transition-all duration-500 outline-none focus:ring-4 cursor-pointer ${theme.btnBorder}`}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => loginDiscord()}
            className={`w-full sm:w-1/2 py-2 px-4 flex items-center justify-center gap-2.5 text-xs font-semibold text-zinc-300 rounded-lg bg-black/25 border transition-all duration-500 outline-none focus:ring-4 cursor-pointer ${theme.btnBorder}`}
          >
            <svg viewBox="0 0 127.14 96.36" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.89-.65,1.76-1.34,2.58-2a75.58,75.58,0,0,0,73.1,0c.83.71,1.69,1.4,2.58,2a68.43,68.43,0,0,1-10.5,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129.87,48.24,123.86,25.41,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"
                fill="#5865F2"
              />
            </svg>
            <span>Discord</span>
          </button>
        </div>
      </div>
    </div>
  );
}