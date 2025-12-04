"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  QrCode,
  Folder,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  Plus,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------
// 1. MAIN DESKTOP SIDEBAR (Collapsible)
// ----------------------------------------------------------------------
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "hidden md:flex flex-col border-r bg-white h-screen sticky top-0 transition-all duration-300",
        collapsed ? "w-[80px]" : "w-64"
      )}
    >
      {/* Shared Content */}
      <SidebarContent collapsed={collapsed} />

      {/* Collapse Toggle Button */}
      <div className="hidden md:flex justify-center p-4 border-t">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>
  );
}

// ----------------------------------------------------------------------
// 2. MOBILE SIDEBAR (Drawer / Sheet)
// ----------------------------------------------------------------------
export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger Button (Visible only on Mobile) */}
      <button 
        onClick={() => setOpen(true)}
        className="md:hidden p-2 hover:bg-gray-100 rounded-md text-gray-600"
      >
        <Menu size={24} />
      </button>

      {/* Overlay & Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in"
            onClick={() => setOpen(false)}
          />
          
          {/* Sidebar Panel */}
          <div className="relative w-64 bg-white h-full shadow-xl animate-in slide-in-from-left duration-300 flex flex-col">
            <button 
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
            
            <SidebarContent collapsed={false} />
          </div>
        </div>
      )}
    </>
  );
}

// ----------------------------------------------------------------------
// 3. SHARED CONTENT (Links & Logic)
// ----------------------------------------------------------------------
function SidebarContent({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-full">
      {/* BRAND HEADER */}
      <div className={cn("h-16 flex items-center border-b", collapsed ? "justify-center px-0" : "px-6")}>
        <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <QrCode className="fill-blue-600 text-white" size={collapsed ? 28 : 24} />
          {!collapsed && <span>QR SaaS</span>}
        </div>
      </div>

      {/* CREATE BUTTON */}
      <div className="p-4">
        <Link href="/dashboard/qr/create">
          <button 
            className={cn(
                "w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center rounded-lg font-medium transition-all shadow-sm hover:shadow-md",
                collapsed ? "p-3" : "py-2.5 gap-2"
            )}
            title="Create QR"
          >
            <Plus size={20} />
            {!collapsed && "Create QR"}
          </button>
        </Link>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        {!collapsed && (
            <p className="px-4 text-xs font-semibold text-gray-400 mt-4 mb-2 uppercase tracking-wider">
            Main
            </p>
        )}
        <SidebarItem href="/dashboard" icon={<LayoutDashboard size={20} />} collapsed={collapsed}>
          Dashboard
        </SidebarItem>
        <SidebarItem href="/dashboard/qr" icon={<QrCode size={20} />} collapsed={collapsed}>
          My QR Codes
        </SidebarItem>

        {!collapsed && (
            <p className="px-4 text-xs font-semibold text-gray-400 mt-8 mb-2 uppercase tracking-wider">
            Management
            </p>
        )}
        <SidebarItem href="/dashboard/projects" icon={<Folder size={20} />} collapsed={collapsed}>
          Projects
        </SidebarItem>
        <SidebarItem href="/dashboard/analytics" icon={<BarChart3 size={20} />} collapsed={collapsed}>
          Analytics
        </SidebarItem>

        {!collapsed && (
            <p className="px-4 text-xs font-semibold text-gray-400 mt-8 mb-2 uppercase tracking-wider">
            Account
            </p>
        )}
        <SidebarItem href="/dashboard/billing" icon={<CreditCard size={20} />} collapsed={collapsed}>
          Billing
        </SidebarItem>
        <SidebarItem href="/dashboard/settings" icon={<Settings size={20} />} collapsed={collapsed}>
          Settings
        </SidebarItem>
      </nav>

      {/* USER FOOTER */}
      <div className="p-4 border-t bg-gray-50 mt-auto">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center w-full text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors",
            collapsed ? "justify-center p-2" : "px-4 py-2"
          )}
          title="Sign Out"
        >
          <LogOut size={20} className={cn(!collapsed && "mr-3")} />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </div>
  );
}

// Helper Component for Links
function SidebarItem({
  href,
  icon,
  children,
  collapsed
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const isActive = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center rounded-lg transition-all duration-200 group",
        collapsed ? "justify-center p-3" : "px-4 py-2.5",
        isActive
          ? "bg-blue-50 text-blue-700 font-medium"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      )}
      title={typeof children === 'string' ? children : undefined}
    >
      <span className={cn("transition-colors", isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600", !collapsed && "mr-3")}>
        {icon}
      </span>
      {!collapsed && children}
    </Link>
  );
}