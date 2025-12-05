"use client";

import { useRef, useState } from "react";
import LiveQRCode from "@/components/qr/live-qr-code";
import { 
  Download, 
  Save, 
  CheckCircle, 
  AlertCircle, 
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function StepPreview({ qrType, content, design, onBack }: any) {
  const router = useRouter();
  const qrRef = useRef<any>(null);

  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<any>(null);
  const [error, setError] = useState("");
  const [format, setFormat] = useState("png");

  // 🔥 FIX 1: Use Dynamic API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  const buildContent = () => {
    switch (qrType) {
      case "url": return content.url;
      case "text": return content.text;
      case "wifi": return `WIFI:S:${content.ssid};T:WPA;P:${content.password};;`;
      case "vcard": return `BEGIN:VCARD\nFN:${content.name}\nTEL:${content.phone}\nEMAIL:${content.email}\nORG:${content.company}\nEND:VCARD`;
      default: return "";
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

      const payload = {
        name: content.name || `${qrType.toUpperCase()} QR`,
        qr_type: qrType,
        target_url: qrType === "url" 
          ? (content.url?.startsWith("http") ? content.url : `https://${content.url}`) 
          : buildContent(), // <--- THIS WAS "https://example.com" BEFORE
        
        design: design,
      };

      // 🔥 FIX 2: Use API_URL Variable
      const res = await fetch(`${API_URL}/qr/dynamic/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create QR");

      setCreated(data);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    qrRef.current.download(`qr-code.${format}`);
  };

  if (created) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="text-green-600 w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">QR Code Created!</h2>
        <p className="text-gray-500 mt-2 mb-8 max-w-md">
          Your QR code has been saved to your dashboard. You can now download it or track its performance.
        </p>
        
        <div className="flex gap-4">
          <button 
            onClick={() => router.push("/dashboard/qr")}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition"
          >
            Go to Dashboard
          </button>
          <button 
            onClick={() => handleDownload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-200 transition"
          >
            Download QR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* LEFT: VISUAL PREVIEW */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative group">
           <div className="bg-white p-8 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100">
              <LiveQRCode ref={qrRef} content={buildContent()} design={design} />
           </div>
           <div className="absolute -top-4 -right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              PREVIEW
           </div>
        </div>
        <p className="mt-8 text-sm text-gray-400">Scan to test before saving</p>
      </div>

      {/* RIGHT: DETAILS & ACTIONS */}
      <div className="flex flex-col justify-center space-y-8">
        
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Final Review</h2>
           <p className="text-gray-500">Review your settings and save your QR Code.</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 border space-y-3">
           <div className="flex justify-between text-sm">
              <span className="text-gray-500">Type</span>
              <span className="font-semibold uppercase">{qrType}</span>
           </div>
           <div className="flex justify-between text-sm">
              <span className="text-gray-500">Content</span>
              <span className="font-medium truncate max-w-[200px]">{buildContent()}</span>
           </div>
           <div className="flex justify-between text-sm">
              <span className="text-gray-500">Colors</span>
              <div className="flex gap-2">
                 <div className="w-4 h-4 rounded-full border" style={{background: design.color}}></div>
                 <div className="w-4 h-4 rounded-full border" style={{background: design.bgColor}}></div>
              </div>
           </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-3">
             <AlertCircle size={20} className="shrink-0 mt-0.5" />
             <div className="text-sm">
               <span className="font-bold block">Error Saving QR</span>
               {error}
             </div>
          </div>
        )}

        <div className="space-y-4 pt-4 border-t">
           <div className="flex gap-3">
              <select 
                value={format} 
                onChange={(e) => setFormat(e.target.value)}
                className="bg-white border rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
              >
                 <option value="png">PNG</option>
                 <option value="svg">SVG</option>
                 <option value="jpeg">JPEG</option>
              </select>
              <button 
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition"
              >
                 <Download size={18} />
                 Download File
              </button>
           </div>

           <button
             onClick={handleSave}
             disabled={loading}
             className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
           >
             {loading ? (
                <>Saving to Dashboard...</>
             ) : (
                <>
                   <Save size={20} />
                   Save to Dashboard
                </>
             )}
           </button>

           <button 
             onClick={onBack}
             className="w-full text-gray-500 text-sm hover:text-gray-800 transition py-2"
           >
             Back to Design
           </button>
        </div>

      </div>
    </div>
  );
}