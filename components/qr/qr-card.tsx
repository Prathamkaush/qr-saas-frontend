"use client";

import { useEffect, useState } from "react";
import { BarChart2, FileText, Wifi, User, Link as LinkIcon, File } from "lucide-react"; 
import AuthImage from "@/components/ui/auth-image";

interface QRCardProps {
  qr: any;
  onClick: () => void;
}

export default function QRCard({ qr, onClick }: QRCardProps) {
  // Local state to hold the fresh scan count
  const [scanCount, setScanCount] = useState(qr.scan_count || 0);

  // Use Dynamic API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  const imageUrl = `${API_URL}/qr/${qr.id}/image`;

  // 🔥 FIX: Fetch Real-Time Scan Count on Mount
  useEffect(() => {
    async function fetchFreshStats() {
      try {
        const token = localStorage.getItem("token");
        // Call the analytics endpoint for this specific QR code
        const res = await fetch(`${API_URL}/analytics/${qr.id}/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          // Update the UI with the real number from the database
          if (data && typeof data.total_scans === 'number') {
            setScanCount(data.total_scans);
          }
        }
      } catch (e) {
        console.error("Failed to fetch stats for QR", qr.id, e);
      }
    }

    fetchFreshStats();
  }, [qr.id, API_URL]);

  // Smart Content Display
  const getDisplayContent = () => {
    switch (qr.qr_type) {
      case "url": return qr.target_url;
      case "wifi": return "WiFi Network";
      case "vcard": return "Contact Card";
      case "pdf": return "PDF Document";
      case "text": return "Plain Text Message";
      default: return qr.target_url || "Scannable Content";
    }
  };

  const TypeIcon = () => {
      switch(qr.qr_type) {
          case "wifi": return <Wifi size={14} className="text-gray-500"/>;
          case "pdf": return <File size={14} className="text-gray-500"/>;
          case "vcard": return <User size={14} className="text-gray-500"/>;
          case "text": return <FileText size={14} className="text-gray-500"/>;
          default: return <LinkIcon size={14} className="text-gray-500"/>;
      }
  }

  return (
    <div 
      onClick={onClick}
      className="group bg-white border rounded-xl p-4 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer relative flex flex-col h-full"
    >
      {/* Image Area */}
      <div className="flex justify-center h-40 w-full mb-4 bg-gray-50 rounded-lg items-center overflow-hidden relative">
         <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wide">
            Dynamic
         </div>
         
        <div className="w-28 h-28 transition-transform duration-300 group-hover:scale-110">
            <AuthImage
                src={imageUrl}
                alt="QR Code"
                className="w-full h-full object-contain mix-blend-multiply"
            />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 flex-1">
        <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-gray-900 truncate flex-1" title={qr.name}>
                {qr.name || "Untitled QR"}
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded shrink-0">
                {qr.qr_type}
            </span>
        </div>
        
        {/* Friendly Content Display */}
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
            <TypeIcon />
            <p className="truncate flex-1 font-medium text-gray-700">{getDisplayContent()}</p>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <BarChart2 size={14} className="text-blue-500" />
            {/* 🔥 Display the fetched scanCount state */}
            <span className="font-medium text-gray-900">{scanCount}</span> <span className="text-gray-400">Scans</span>
        </div>
        <div className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Manage →
        </div>
      </div>
    </div>
  );
}