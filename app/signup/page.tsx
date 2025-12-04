"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Image from "next/image";
import LoginAnimation from "@/components/login/login-animation";
import { BeamLogo } from "@/components/ui/logo"; // Import your logo

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 FIX: Use NEXT_PUBLIC_API_URL so it works on Client Side
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/register", formData);
      
      if (res.data.token) {
          // 1. Save Token
          localStorage.setItem("token", res.data.token);
          
          // 2. Save User Object
          localStorage.setItem("user", JSON.stringify(res.data.user));
          
          router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white">

      {/* LEFT */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20">

        {/* Branding Section */}
        <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
                <BeamLogo size={40} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign up with Beam</h1>
            <p className="text-gray-500">Create your account to get started.</p>
        </div>

        {error && (
          <div className="mb-4 text-red-600 text-sm bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <input
          type="text"
          name="name" 
          placeholder="Full name"
          value={formData.name}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 w-full focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          name="email"
          placeholder="name@email.com"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 w-full focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Create password"
          value={formData.password}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-3 mb-6 w-full focus:ring-2 focus:ring-blue-500"
        />

        <button 
            onClick={handleSignup}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 w-full mb-4 transition font-medium"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
        
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
        </div>

        <button
          onClick={() => {
            window.location.href = `${API_URL}/auth/google/login`;
          }}
          className="border border-gray-300 hover:bg-gray-50 transition-colors rounded-lg py-3 flex items-center justify-center gap-3 w-full text-gray-700 font-medium"
        >
          <Image src="/google.png" width={20} height={20} alt="Google" />
          Sign up with Google
        </button>

        <p className="mt-8 text-gray-500 text-sm text-center">
          Already have an account?
          <Link href="/login" className="text-blue-600 font-medium ml-1">Log in</Link>
        </p>
      </div>

      {/* RIGHT: Animation */}
      <div className="hidden md:block w-1/2 h-full bg-gray-50">
        <LoginAnimation />
      </div>
    </div>
  );
}