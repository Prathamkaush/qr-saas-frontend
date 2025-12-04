"use client";

import { useEffect, useState } from "react";
import { User, Mail, Lock, Save, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({ current: "", new: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // 🔥 FIX 1: Use Dynamic API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  useEffect(() => {
    // 1. Initial Load from LocalStorage (Fast UI)
    const stored = localStorage.getItem("user");
    if (stored) {
        try { setUser(JSON.parse(stored)); } catch(e){}
    }

    // 2. Fetch Fresh Data from Backend (Source of Truth)
    // You typically need a GET /api/auth/me or GET /api/settings/profile endpoint
    // If you don't have one, we rely on the localStorage update mechanism during login.
    // Assuming for now you want to save updates to the backend:
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      
      // 🔥 FIX 2: Use API_URL in fetch
      const res = await fetch(`${API_URL}/settings/`, { 
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.name,
          // Only send password fields if they are typed in
          ...(passwordData.new ? { current_password: passwordData.current, new_password: passwordData.new } : {})
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Update failed");
      }

      // Update LocalStorage on success to keep UI in sync
      const updatedUser = { ...user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setMsg({ type: "success", text: "Profile updated successfully!" });
      setPasswordData({ current: "", new: "" }); // Clear passwords

    } catch (err: any) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

      {msg.text && (
        <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${msg.type === "error" ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-600 border border-green-200"}`}>
          {msg.text}
        </div>
      )}

      <div className="bg-white border shadow-sm rounded-xl overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
          <p className="text-sm text-gray-500">Update your account details</p>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
          </div>

          {/* Email Field (Read Only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
          </div>

          {/* Password Section */}
          <div className="pt-4 border-t">
            <h3 className="text-md font-medium text-gray-900 mb-4">Change Password</h3>
            <div className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  placeholder="Current Password" 
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none focus:border-blue-500" 
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  placeholder="New Password" 
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none focus:border-blue-500" 
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
             <button 
               type="submit" 
               disabled={loading}
               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition disabled:opacity-70 shadow-sm"
             >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {loading ? "Saving..." : "Save Changes"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}