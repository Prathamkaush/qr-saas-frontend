"use client";

import { X, Download, Pencil, Trash2, ExternalLink, Calendar, BarChart2, FileText, Wifi, User } from "lucide-react";
import AuthImage from "@/components/ui/auth-image";
import Link from "next/link";

interface QRModalProps {
  qr: any;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export default function QRDetailModal({ qr, onClose, onDelete }: QRModalProps) {
  if (!qr) return null;

  // 🔥 FIX 1: Use Dynamic API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  const imageUrl = `${API_URL}/qr/${qr.id}/image`;

  // 🔥 FIX 2: Smart Content Display (Hides raw links for PDF/WiFi)
  const getContentDisplay = () => {
    switch(qr.qr_type) {
        case "url": return qr.target_url;
        case "pdf": return "PDF Document (Hosted)";
        case "wifi": return "WiFi Network Configuration";
        case "vcard": return "Contact Card Data";
        case "text": return "Plain Text Message";
        default: return qr.target_url;
    }
  };

  const getIcon = () => {
    switch(qr.qr_type) {
        case "pdf": return <FileText size={16} className="text-red-500" />;
        case "wifi": return <Wifi size={16} className="text-blue-500" />;
        case "vcard": return <User size={16} className="text-purple-500" />;
        default: return <ExternalLink size={16} className="text-gray-400" />;
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(imageUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${qr.name || "qr-code"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Card - 🔥 Added max-height & overflow for mobile scrolling */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-gray-100 rounded-full transition z-10"
        >
          <X size={20} />
        </button>

        {/* LEFT: Huge Image */}
        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r">
          <div className="w-full aspect-square bg-white p-4 rounded-xl shadow-sm border">
            <AuthImage 
              src={imageUrl} 
              alt={qr.name} 
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>
        </div>

        {/* RIGHT: Details & Actions */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 uppercase tracking-wide mb-3">
              {qr.qr_type}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight break-words">
              {qr.name || "Untitled QR"}
            </h2>
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
              <Calendar size={14} /> 
              Created: {new Date(qr.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-4 flex-1">
            {/* 🔥 Smart Content Box */}
            <div className="bg-gray-50 p-3 rounded-lg border text-sm text-gray-600 flex items-center justify-between group">
                <div className="flex items-center gap-3 truncate">
                    {getIcon()}
                    <span className="truncate font-medium">{getContentDisplay()}</span>
                </div>
                
                {/* Only show external link arrow if it is a URL */}
                {qr.qr_type === "url" && (
                    <a 
                      href={qr.target_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink size={14} />
                    </a>
                )}
            </div>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-3 mt-8">
            
            {/* Analytics Button */}
            <Link href={`/dashboard/qr/${qr.id}/analytics`} className="col-span-2">
               <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition shadow-sm">
                  <BarChart2 size={18} /> View Analytics
               </button>
            </Link>

            <button 
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg font-medium transition"
            >
              <Download size={18} /> PNG
            </button>

            <Link href={`/dashboard/qr/${qr.id}/edit`} className="w-full">
                <button className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg font-medium transition">
                <Pencil size={18} /> Edit
                </button>
            </Link>

            <button 
              onClick={() => {
                if(confirm("Are you sure you want to delete this QR?")) {
                    onDelete(qr.id);
                }
              }}
              className="col-span-2 flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-lg font-medium transition mt-2"
            >
              <Trash2 size={18} /> Delete QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}