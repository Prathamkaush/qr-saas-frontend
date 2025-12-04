"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Image from "next/image";
import LoginAnimation from "@/components/login/login-animation";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          
          // 2. 🔥 FIX: Save the User Object too!
          // The Go backend sends { token: "...", user: { ... } }
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

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Create an account</h1>
        <p className="text-gray-500 mb-10">Join us and start generating QR codes</p>

        {error && (
          <div className="mb-4 text-red-600 text-sm bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <input
          type="text"
          name="name" // Important for handleChange
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
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 w-full mb-4 transition"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
        
        <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
        </div>

        <button
          onClick={() => {
            window.location.href = `${API_URL}/auth/google/login`;
          }}
          className="border border-gray-300 hover:bg-gray-50 transition-colors rounded-lg py-3 flex items-center justify-center gap-3 w-full text-gray-700"
        >
          <Image src="/google.png" width={20} height={20} alt="Google" />
          Login with Google
        </button>


        <p className="mt-6 text-gray-500 text-sm">
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