"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label"; 
import { 
  Globe, Type, User, Phone, Mail, Building, 
  Wifi, Lock, UploadCloud, FileText, Tag
} from "lucide-react";

export default function StepContent({
  qrType,
  content,
  setContent,
  onNext,
  onBack,
}: any) {
  
  const update = (field: string, value: any) => {
    setContent({ ...content, [field]: value });
  };

  const isValid = () => {
    if (qrType === "url") return content.url?.length > 3;
    if (qrType === "text") return content.text?.length > 0;
    if (qrType === "wifi") return content.ssid?.length > 0;
    if (qrType === "vcard") return content.name?.length > 0; // Name is built-in for vCard
    if (qrType === "pdf") return content.file !== null;
    return true;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      <div className="text-center md:text-left space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Enter Content</h2>
        <p className="text-gray-500 text-sm">
          Fill in the details for your <span className="font-semibold uppercase text-blue-600">{qrType}</span> QR Code.
        </p>
      </div>

      {/* 🔥 FIX: Generic Name Input (For URL, WiFi, PDF, Text) */}
      {/* We hide this for vCard because vCard already has a "Full Name" field */}
      {qrType !== "vcard" && (
        <div className="space-y-3">
           <Label htmlFor="qrName">QR Name (Optional)</Label>
           <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                id="qrName"
                placeholder="e.g. Summer Campaign, Office WiFi"
                className="pl-10 h-11 transition-all focus-visible:ring-blue-500"
                value={content.name || ""}
                onChange={(e) => update("name", e.target.value)}
              />
           </div>
        </div>
      )}

      {/* ----------------- URL INPUT ----------------- */}
      {qrType === "url" && (
        <div className="space-y-3">
          <Label htmlFor="url">Website URL</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              id="url"
              placeholder="https://yourwebsite.com"
              className="pl-10 h-11 sm:h-12 text-base"
              value={content.url || ""}
              onChange={(e) => update("url", e.target.value)}
            />
          </div>
          <p className="text-xs text-gray-400 pl-1">Include https:// for best results.</p>
        </div>
      )}

      {/* ----------------- TEXT INPUT ----------------- */}
      {qrType === "text" && (
        <div className="space-y-3">
          <Label htmlFor="text">Plain Text</Label>
          <div className="relative">
            <Type className="absolute left-3 top-4 text-gray-400" size={18} />
            <Textarea
              id="text"
              placeholder="Enter your message here..."
              className="pl-10 min-h-[150px] resize-none text-base"
              value={content.text || ""}
              onChange={(e) => update("text", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* ----------------- VCARD INPUT ----------------- */}
      {qrType === "vcard" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div className="space-y-2 col-span-1">
            <Label>Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="John Doe"
                className="pl-10 h-11"
                value={content.name || ""}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>
          </div>
          {/* ... keep other vcard inputs ... */}
          <div className="space-y-2 col-span-1">
            <Label>Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="+1 234 567 890"
                className="pl-10 h-11"
                value={content.phone || ""}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2 col-span-1">
             <Label>Company</Label>
             <div className="relative">
               <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <Input placeholder="Acme Inc." className="pl-10 h-11" value={content.company || ""} onChange={(e) => update("company", e.target.value)} />
             </div>
          </div>
          <div className="space-y-2 col-span-1">
             <Label>Email</Label>
             <div className="relative">
               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <Input placeholder="john@example.com" className="pl-10 h-11" value={content.email || ""} onChange={(e) => update("email", e.target.value)} />
             </div>
          </div>
        </div>
      )}

      {/* ----------------- WIFI INPUT ----------------- */}
      {qrType === "wifi" && (
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Network Name (SSID)</Label>
            <div className="relative">
              <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="MyHomeWiFi"
                className="pl-10 h-11"
                value={content.ssid || ""}
                onChange={(e) => update("ssid", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="SecurePassword123"
                className="pl-10 h-11"
                value={content.password || ""}
                onChange={(e) => update("password", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ----------------- PDF UPLOAD ----------------- */}
      {qrType === "pdf" && (
        <div className="space-y-4">
          <Label>Upload PDF Document</Label>
          <div className="relative group">
             <input
                type="file"
                id="pdf-upload"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => update("file", e.target.files?.[0] || null)}
             />
             <label htmlFor="pdf-upload" className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all ${content.file ? "border-green-400 bg-green-50" : "border-gray-300 bg-gray-50 hover:bg-blue-50"}`}>
                {content.file ? (
                    <div className="text-center text-green-700 p-4">
                        <FileText size={40} className="mx-auto mb-2" />
                        <p className="font-semibold text-sm">{content.file.name}</p>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 p-4">
                        <UploadCloud size={40} className="mx-auto mb-2" />
                        <p className="font-semibold text-sm">Click to upload PDF</p>
                    </div>
                )}
             </label>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex justify-between pt-6 mt-6 border-t">
        <button onClick={onBack} className="px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50">Back</button>
        <button onClick={onNext} disabled={!isValid()} className={`px-8 py-2.5 rounded-lg text-white ${isValid() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-200 cursor-not-allowed"}`}>Continue</button>
      </div>
    </div>
  );
}