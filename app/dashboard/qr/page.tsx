"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, QrCode } from "lucide-react";
import QRCard from "@/components/qr/qr-card";
import QRDetailModal from "@/components/qr/qr-detail-modal"; 

export default function QRListPage() {
  const [qrs, setQrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedQR, setSelectedQR] = useState<any>(null);

  // 🔥 FIX 1: Use Dynamic API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  const fetchQRs = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
    try {
        // 🔥 FIX 2: Use API_URL variable
        const res = await fetch(`${API_URL}/qr/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
            const data = await res.json();
            setQrs(data || []);
        }
    } catch (e) {
        console.error("Fetch error", e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------------------------------------------
  // DELETE LOGIC
  // ---------------------------------------------
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
        // 🔥 FIX 3: Use API_URL variable
        const res = await fetch(`${API_URL}/qr/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            setQrs((prev) => prev.filter((q) => q.id !== id));
            setSelectedQR(null); 
        } else {
            alert("Failed to delete QR code");
        }
    } catch (e) {
        alert("Error deleting QR code");
    }
  };

  const filteredQRs = qrs.filter(q => 
    (q.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    // 🔥 FIX 4: Responsive Padding (p-4 mobile, p-8 desktop)
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      
      {/* Header Section: Column on mobile, Row on desktop */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My QR Codes</h1>
            <p className="text-gray-500 text-sm md:text-base mt-1">Manage, track, and edit your QR codes.</p>
        </div>
        
        {/* Create Button: Full width on mobile */}
        <Link href="/dashboard/qr/create" className="w-full md:w-auto">
          <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium shadow-sm transition-all hover:shadow-md active:scale-95">
            <Plus size={20} /> Create New QR
          </button>
        </Link>
      </div>

      {/* Search Bar: Full width on mobile */}
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
            type="text" 
            placeholder="Search by name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredQRs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-300 text-center px-4">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <QrCode className="text-gray-400 w-8 h-8" />
            </div>
            <p className="text-gray-900 font-medium text-lg">No QR codes found</p>
            <p className="text-gray-500 text-sm mt-1 max-w-sm">
                {search ? `No results for "${search}". Try a different term.` : "You haven't created any QR codes yet. Get started now!"}
            </p>
            {!search && (
                <Link href="/dashboard/qr/create" className="mt-6">
                    <button className="text-blue-600 font-medium hover:underline">Create your first QR →</button>
                </Link>
            )}
        </div>
      )}

      {/* Grid Layout: Responsive columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredQRs.map((qr) => (
          <QRCard 
            key={qr.id} 
            qr={qr} 
            onClick={() => setSelectedQR(qr)} 
          />
        ))}
      </div>

      {/* POP-UP MODAL */}
      {selectedQR && (
        <QRDetailModal 
            qr={selectedQR} 
            onClose={() => setSelectedQR(null)} 
            onDelete={handleDelete}
        />
      )}

    </div>
  );
}