"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart2, QrCode, Plus, Users, MousePointer2, Smartphone, Globe,
  Wifi, FileText, Utensils, Type, Contact
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total_scans: 0,
    unique_ips: 0,
    devices: {} as Record<string, number>
  });
  const [loading, setLoading] = useState(true);

  // 🔥 FIX 1: Use Dynamic API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch QR List (Using Dynamic URL)
        const qrRes = await fetch(`${API_URL}/qr/`, { headers });
        if (qrRes.ok) setQrCodes(await qrRes.json() || []);

        // 2. Fetch Global Analytics (Using Dynamic URL)
        const statsRes = await fetch(`${API_URL}/analytics/dashboard`, { headers });
        if (statsRes.ok) setStats(await statsRes.json());

      } catch (e) {
        console.error("Dashboard load failed", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getDevicePercent = (type: string) => {
    const count = stats.devices[type] || 0;
    if (stats.total_scans === 0) return "0%";
    return Math.round((count / stats.total_scans) * 100) + "%";
  };

  return (
    // 🔥 FIX 2: Responsive Padding (p-4 mobile, p-8 desktop)
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <Link href="/dashboard/qr/create" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 shadow-sm transition-all font-medium active:scale-95">
            <Plus size={18} /> Create QR Code
          </button>
        </Link>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard title="Total QR Codes" value={qrCodes.length} icon={<QrCode className="h-6 w-6 text-blue-600" />} />
        <StatsCard title="Total Scans" value={stats.total_scans} icon={<BarChart2 className="h-6 w-6 text-green-600" />} />
        <StatsCard title="Unique Visitors" value={stats.unique_ips} icon={<Users className="h-6 w-6 text-purple-600" />} />
        <StatsCard title="Active Devices" value={Object.keys(stats.devices).length} icon={<Smartphone className="h-6 w-6 text-orange-500" />} />
      </div>
      
      {/* QR CREATION SHORTCUTS */}
      <section className="space-y-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">Create new QR Code</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          <CreateShortcut label="URL" icon={<Globe className="text-blue-500" />} href="/dashboard/qr/create?type=url" />
          <CreateShortcut label="vCard" icon={<Contact className="text-purple-500" />} href="/dashboard/qr/create?type=vcard" />
          <CreateShortcut label="WiFi" icon={<Wifi className="text-indigo-500" />} href="/dashboard/qr/create?type=wifi" />
          <CreateShortcut label="Text" icon={<Type className="text-gray-500" />} href="/dashboard/qr/create?type=text" />
          <CreateShortcut label="PDF" icon={<FileText className="text-red-500" />} href="/dashboard/qr/create?type=pdf" />
          <CreateShortcut label="Menu" icon={<Utensils className="text-orange-500" />} href="/dashboard/qr/create?type=menu" />
        </div>
      </section>

      {/* ANALYTICS & RECENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Device Stats */}
        <Card className="shadow-sm border-gray-200 h-full">
          <CardHeader><CardTitle>Device Stats</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <DeviceRow icon={<Smartphone />} label="Mobile" percent={getDevicePercent("Mobile")} />
            <DeviceRow icon={<MousePointer2 />} label="Desktop" percent={getDevicePercent("Desktop")} />
            <DeviceRow icon={<Globe />} label="Tablet" percent={getDevicePercent("Tablet")} />
          </CardContent>
        </Card>

        {/* Recent QRs */}
        <div className="lg:col-span-2 space-y-4">
           <div className="flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">Recent QR Codes</h2>
              {qrCodes.length > 0 && <Link href="/dashboard/qr" className="text-sm text-blue-600 hover:underline">View All</Link>}
           </div>
           
           {qrCodes.length === 0 ? (
              <div className="bg-gray-50 border border-dashed rounded-xl p-8 text-center text-gray-500">
                 No QR codes created yet.
              </div>
           ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {qrCodes.slice(0, 4).map((qr) => (
                    <RecentQRCard
                      key={qr.id}
                      name={qr.name || "Untitled QR"}
                      type={qr.qr_type}
                      date={new Date(qr.created_at).toLocaleDateString()}
                    />
                 ))}
              </div>
           )}
        </div>
      </div>
    </div>
  );
}

// ... (Keep StatsCard, CreateShortcut, DeviceRow, RecentQRCard exactly as they were) ...
// --- SUB COMPONENTS ---

function StatsCard({ title, value, icon }: any) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">{icon}</div>
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

function CreateShortcut({ label, icon, href }: any) {
  return (
    <Link href={href}>
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
        <div className="mb-3 p-3 bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors">
           {React.cloneElement(icon as React.ReactElement, { size: 24 })}
        </div>
        <div className="text-sm font-semibold text-gray-700 group-hover:text-blue-600">{label}</div>
      </div>
    </Link>
  );
}

function DeviceRow({ icon, label, percent }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg text-gray-600">{icon}</div>
        <span className="text-gray-700 font-medium">{label}</span>
      </div>
      <span className="font-bold text-gray-900">{percent}</span>
    </div>
  );
}

function RecentQRCard({ name, type, date }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border hover:border-blue-300 transition-all flex items-center justify-between shadow-sm">
       <div>
          <h4 className="font-semibold text-gray-900 truncate max-w-[150px]">{name}</h4>
          <p className="text-xs text-gray-500 mt-1">{date}</p>
       </div>
       <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-600 px-2 py-1 rounded">
          {type}
       </span>
    </div>
  );
}