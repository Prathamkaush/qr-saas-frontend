"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  BarChart3, Globe, Smartphone, ArrowLeft, Loader2 
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the shape of data coming from Go Backend
interface AnalyticsSummary {
  total_scans: number;
  countries: Record<string, number>;
  devices: Record<string, number>;
  browsers: Record<string, number>;
}

export default function SingleQRAnalyticsPage() {
  const params = useParams();
  const qrId = params.id as string;

  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 FIX: Use Dynamic URL for Render support
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        // 🔥 FIX: Use API_URL here
        const res = await fetch(`${API_URL}/analytics/${qrId}/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to load analytics", error);
      } finally {
        setLoading(false);
      }
    };

    if (qrId) fetchStats();
  }, [qrId, API_URL]); // Added API_URL dependency

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" /></div>;
  if (!stats) return <div className="p-10 text-center text-gray-500">No data found.</div>;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header: Responsive Layout */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Link href="/dashboard/qr">
          <button className="self-start p-2 hover:bg-gray-100 rounded-full border transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">QR Performance</h1>
          <p className="text-gray-500 text-sm">Real-time scan data for this code</p>
        </div>
      </div>

      {/* Top Stats Cards: Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatCard 
          title="Total Scans" 
          value={stats.total_scans} 
          icon={<BarChart3 className="text-blue-600" />} 
        />
        <StatCard 
          title="Top Country" 
          value={getTopKey(stats.countries)} 
          icon={<Globe className="text-purple-600" />} 
        />
        <StatCard 
          title="Top Device" 
          value={getTopKey(stats.devices)} 
          icon={<Smartphone className="text-green-600" />} 
        />
      </div>

      {/* Data Breakdowns: Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Countries Chart */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader><CardTitle>Top Locations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(stats.countries).length === 0 ? (
               <p className="text-gray-400 text-sm italic">No location data yet.</p>
            ) : (
               Object.entries(stats.countries).slice(0, 5).map(([country, count]) => (
                  <ProgressBar 
                    key={country} 
                    label={country || "Unknown"} 
                    count={count} 
                    total={stats.total_scans} 
                    color="bg-blue-500" 
                  />
               ))
            )}
          </CardContent>
        </Card>

        {/* Devices Chart */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader><CardTitle>Devices</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(stats.devices).length === 0 ? (
               <p className="text-gray-400 text-sm italic">No device data yet.</p>
            ) : (
               Object.entries(stats.devices).map(([device, count]) => (
                  <ProgressBar 
                    key={device} 
                    label={device || "Unknown"} 
                    count={count} 
                    total={stats.total_scans} 
                    color="bg-green-500" 
                  />
               ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- Helpers & Subcomponents ---

function getTopKey(map: Record<string, number>) {
  if (!map || Object.keys(map).length === 0) return "—";
  return Object.entries(map).reduce((a, b) => a[1] > b[1] ? a : b)[0];
}

function StatCard({ title, value, icon }: any) {
  return (
    <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-3xl font-bold mt-1 text-gray-900">{value}</h3>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">{icon}</div>
      </CardContent>
    </Card>
  );
}

function ProgressBar({ label, count, total, color }: any) {
  const percent = Math.round((count / total) * 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{count} ({percent}%)</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div style={{ width: `${percent}%` }} className={`h-full ${color}`}></div>
      </div>
    </div>
  );
}