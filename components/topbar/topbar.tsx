"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; // Added usePathname
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon, Settings } from "lucide-react";
import { MobileSidebar } from "../navigation/sidebar"; // Import the mobile drawer we made

export default function Topbar() {
  const router = useRouter();
  const pathname = usePathname(); // Get current route
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [initials, setInitials] = useState("");

  // Determine Page Title based on URL
  const getPageTitle = () => {
    if (pathname.includes("/dashboard/qr/create")) return "Create QR";
    if (pathname.includes("/dashboard/qr")) return "My QR Codes";
    if (pathname.includes("/dashboard/settings")) return "Settings";
    if (pathname.includes("/dashboard/billing")) return "Billing";
    if (pathname.includes("/dashboard/projects")) return "Projects";
    if (pathname.includes("/dashboard/analytics")) return "Analytics";
    return "Dashboard"; // Default
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setInitials(getInitials(parsedUser.name || parsedUser.email || "?"));
      } catch (e) {
        console.error("User data corrupted", e);
      }
    } else {
       const token = localStorage.getItem("token");
       if (token) setInitials("ME");
    }
  }, []);

  const getInitials = (text: string) => {
      const cleanText = text.trim();
      if (!cleanText) return "?";
      if (cleanText.includes("@")) return cleanText.charAt(0).toUpperCase();
      const parts = cleanText.split(" ");
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6 shadow-sm sticky top-0 z-30">
      
      {/* LEFT: Mobile Menu + Dynamic Title */}
      <div className="flex items-center gap-3">
        {/* 🔥 FIX: Use MobileSidebar instead of a dead button */}
        <MobileSidebar />
        
        <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
          {getPageTitle()}
        </h1>
      </div>

      {/* RIGHT: User Profile */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-full transition-colors border border-transparent hover:border-gray-200">
              
              <span className="hidden md:block text-sm font-medium text-gray-700 mr-1 max-w-[150px] truncate">
                {user?.name || user?.email || "Account"}
              </span>
              
              <Avatar className="h-9 w-9 border bg-gray-100">
                <AvatarImage src={"/user.png"} />
                <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none truncate">{user?.name || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground text-gray-400 truncate">
                  {user?.email || "No email found"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
              <UserIcon className="mr-2 h-4 w-4" /> <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
              <Settings className="mr-2 h-4 w-4" /> <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700">
              <LogOut className="mr-2 h-4 w-4" /> <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}