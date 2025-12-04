"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import Router
import { api } from "@/lib/api"; // Import your API client
import LoginAnimation from "../../components/login/login-animation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State for inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Send data to Go Backend
      const res = await api.post("/auth/login", {
        email: email,
        password: password
      });

      // 2. Save Token
      localStorage.setItem("token", res.data.token);

      // 3. 🔥 FIX: Save User Data (Critical for Topbar to show name)
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      
      // 4. Redirect
      router.push("/dashboard");

    } catch (err: any) {
      console.error(err);
      // Show error from backend or fallback
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white">

      {/* LEFT: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-10 md:px-20 z-10">

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Welcome to Beam 👋</h1>
          <p className="text-gray-500 mt-2">Login to continue to your dashboard</p>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Email Input */}
        <input
          type="email"
          placeholder="name@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Bind State
          className="border border-gray-200 rounded-xl px-4 py-3 mb-4 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Enter your password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Bind State
          className="border border-gray-200 rounded-xl px-4 py-3 mb-6 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`rounded-xl py-3 w-full font-semibold text-white transition 
                      ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <div className="my-6 flex items-center gap-4">
           <div className="h-px bg-gray-200 flex-1" />
           <span className="text-gray-400 text-sm">OR</span>
           <div className="h-px bg-gray-200 flex-1" />
        </div>

        {/* Google OAuth Button */}
        {/* Note: This assumes your Go backend is listening on port 8080 */}
        <button
          onClick={() => window.location.href = `${API_URL}/auth/google/login`}
          className="border border-gray-300 hover:bg-gray-50 transition-colors rounded-lg py-3 flex items-center justify-center gap-3 w-full text-gray-700"
        >
          {/* Ensure this image path is correct in your public folder */}
          <Image src="/google.png" width={20} height={20} alt="Google" />
          Continue with Google
        </button>

        <p className="mt-8 text-gray-500 text-sm text-center">
          Don’t have an account?
          <Link href="/signup" className="text-blue-600 font-medium ml-1">
            Create one
          </Link>
        </p>
      </div>

      {/* RIGHT: Animation Area */}
      <div className="hidden md:block w-1/2 h-full bg-gradient-to-br from-blue-50 to-blue-100 relative">
        <LoginAnimation />
      </div>

    </div>
  );
}