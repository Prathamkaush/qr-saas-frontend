"use client";

import { useEffect, useState } from "react";
import { Check, CreditCard, Zap, Loader2, AlertTriangle } from "lucide-react";

export default function BillingPage() {
  const [sub, setSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  useEffect(() => {
    async function fetchBilling() {
      try {
        const token = localStorage.getItem("token");
        // Endpoint to fetch /billing/subscription
        const res = await fetch(`${API_URL}/billing/subscription`, {
           headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setSub(await res.json());
      } catch (e) { console.error(e); } 
      finally { setLoading(false); }
    }
    fetchBilling();
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600"/></div>;

  const planName = sub?.plan_id || "Free Plan";
  const isPro = planName === "pro";

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Billing & Plans</h1>

      {/* Plan Status Card */}
      <div className={`rounded-2xl p-8 text-white shadow-lg relative overflow-hidden ${isPro ? "bg-gradient-to-r from-blue-600 to-indigo-700" : "bg-gray-800"}`}>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Current Plan</span>
            </div>
            <h2 className="text-3xl font-bold capitalize">{planName}</h2>
            <p className="text-blue-100 mt-1">
               {isPro ? `Renews on ${new Date(sub.current_period_end).toLocaleDateString()}` : "Upgrade to unlock analytics"}
            </p>
          </div>
          <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-md">
            {isPro ? "Manage Subscription" : "Upgrade to Pro"}
          </button>
        </div>
      </div>

      {/* Usage Stats (Real) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UsageCard 
           icon={<Zap size={20}/>} 
           title="Dynamic QR Codes" 
           used={sub?.usage?.qr_count || 0} 
           limit={isPro ? 100 : 5} 
           color="blue"
        />
        <UsageCard 
           icon={<Check size={20}/>} 
           title="Monthly Scans" 
           used={sub?.usage?.scan_count || 0} 
           limit={isPro ? 10000 : 100} 
           color="green"
        />
      </div>
    </div>
  );
}

function UsageCard({ icon, title, used, limit, color }: any) {
  const percent = Math.min((used / limit) * 100, 100);
  const colorClass = color === "blue" ? "bg-blue-500" : "bg-green-500";
  const bgClass = color === "blue" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600";

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex items-center gap-3 mb-4">
         <div className={`p-2 rounded-lg ${bgClass}`}>{icon}</div>
         <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-medium">{used.toLocaleString()} used</span>
        <span className="text-gray-500">of {limit.toLocaleString()} limit</span>
      </div>
      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
         <div className={`h-full ${colorClass}`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}