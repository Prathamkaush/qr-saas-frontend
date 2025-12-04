"use client";

import { useEffect, useState } from "react";
import { 
  BarChart3, Globe, Smartphone, Calendar, MapPin, Monitor, ArrowUp, Loader2 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Data Types
interface AnalyticsSummary {
  total_scans: number;
  unique_ips: number;
  countries: Record<string, number>;
  devices: Record<string, number>;
  browsers: Record<string, number>;
}

interface TimePoint {
  timestamp: string;
  count: number;
}

export default function GlobalAnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [timeSeries, setTimeSeries] = useState<TimePoint[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FIX: This ensures it works on Render (HTTPS) and Localhost
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch Global Summary (Using dynamic API_URL)
        const summaryRes = await fetch(`${API_URL}/analytics/dashboard`, { headers });
        if (summaryRes.ok) setSummary(await summaryRes.json());

        // 2. Fetch Global Time Series (Using dynamic API_URL)
        const chartRes = await fetch(`${API_URL}/analytics/dashboard/timeseries`, { headers });
        if (chartRes.ok) setTimeSeries(await chartRes.json() || []);

      } catch (e) {
        console.error("Analytics load failed", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
  }

  // Calculate Max for Chart Scaling
  const maxScans = Math.max(...timeSeries.map(p => p.count), 10);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Global Analytics</h1>
          <p className="text-gray-500 mt-1">Performance across all your QR codes.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border px-3 py-2 rounded-lg text-sm font-medium text-gray-600 shadow-sm">
          <Calendar size={16} />
          <span>All Time</span> 
        </div>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Scans" 
          value={summary?.total_scans || 0} 
          icon={<BarChart3 className="text-blue-600" />} 
        />
        <StatCard 
          title="Unique Visitors" 
          value={summary?.unique_ips || 0} 
          icon={<Globe className="text-purple-600" />} 
        />
        <StatCard 
          title="Top Device" 
          value={getTopKey(summary?.devices)} 
          icon={<Smartphone className="text-green-600" />} 
        />
      </div>

      {/* MAIN CHART */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle>Scan Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end gap-2 pt-4">
            {timeSeries.length === 0 ? (
               <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                 No scan data available.
               </div>
            ) : (
               timeSeries.map((point, i) => {
                 const heightPercent = (point.count / maxScans) * 100;
                 return (
                   <div key={i} className="flex-1 flex flex-col justify-end group relative">
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {new Date(point.timestamp).toLocaleDateString()}: {point.count} Scans
                      </div>
                      
                      {/* Bar */}
                      <div 
                        style={{ height: `${heightPercent}%` }} 
                        className="w-full bg-blue-100 rounded-t-md hover:bg-blue-500 transition-all duration-300 min-h-[4px]"
                      ></div>
                      
                      {/* Date Label (Only show every 3rd label if too many points) */}
                      <span className="text-[10px] text-gray-400 text-center mt-2 truncate w-full block">
                        {i % Math.ceil(timeSeries.length / 10) === 0 ? new Date(point.timestamp).getDate() : ''}
                      </span>
                   </div>
                 );
               })
            )}
          </div>
        </CardContent>
      </Card>

      {/* BREAKDOWNS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Countries */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-lg font-medium">Locations</CardTitle>
             <MapPin className="text-gray-400" size={18} />
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
             <BreakdownList data={summary?.countries} total={summary?.total_scans} color="bg-blue-500" />
          </CardContent>
        </Card>

        {/* Devices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-lg font-medium">Devices</CardTitle>
             <Smartphone className="text-gray-400" size={18} />
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
             <BreakdownList data={summary?.devices} total={summary?.total_scans} color="bg-green-500" />
          </CardContent>
        </Card>

        {/* Browsers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-lg font-medium">Browsers</CardTitle>
             <Monitor className="text-gray-400" size={18} />
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
             <BreakdownList data={summary?.browsers} total={summary?.total_scans} color="bg-orange-500" />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

// ---------------------------------------------------------
// HELPERS & SUB-COMPONENTS
// ---------------------------------------------------------

function getTopKey(map: Record<string, number> | undefined) {
  if (!map || Object.keys(map).length === 0) return "—";
  return Object.entries(map).reduce((a, b) => a[1] > b[1] ? a : b)[0];
}

function StatCard({ title, value, icon }: any) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="p-3 bg-gray-100 rounded-xl">{icon}</div>
      </CardContent>
    </Card>
  );
}

function BreakdownList({ data, total, color }: any) {
  if (!data || Object.keys(data).length === 0) {
    return <p className="text-sm text-gray-400 italic">No data yet.</p>;
  }

  return (
    <>
      {Object.entries(data).slice(0, 5).map(([label, count]: any) => {
        const percent = Math.round((count / (total || 1)) * 100);
        return (
          <div key={label}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-medium text-gray-700">{label}</span>
              <span className="text-gray-500">{percent}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div style={{ width: `${percent}%` }} className={`h-full ${color}`}></div>
            </div>
          </div>
        );
      })}
    </>
  );
}