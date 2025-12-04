"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link as LinkIcon, User, Wifi, FileText, File, Utensils, Contact } from "lucide-react";

// Added "Menu" to match your Dashboard shortcuts
const types = [
  { id: "url", label: "Website URL", desc: "Link to any webpage", icon: LinkIcon },
  { id: "vcard", label: "vCard Contact", desc: "Digital business card", icon: Contact },
  { id: "wifi", label: "WiFi Login", desc: "Auto-connect to WiFi", icon: Wifi },
  { id: "text", label: "Plain Text", desc: "Show a simple message", icon: FileText },
  { id: "pdf", label: "PDF File", desc: "Share a document", icon: File },
  { id: "menu", label: "Menu", desc: "Restaurant menu", icon: Utensils },
];

export default function StepType({ qrType, setQrType, onNext }: any) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Header */}
      <div className="text-center md:text-left space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Choose QR Type</h2>
        <p className="text-gray-500 text-sm">Select the type of content you want to share.</p>
      </div>

      {/* Grid: 2 cols on mobile, 3 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
        {types.map((t) => {
          const Icon = t.icon;
          const active = qrType === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setQrType(t.id)}
              className="outline-none group text-left focus:ring-2 focus:ring-blue-500 rounded-xl"
            >
              <Card
                className={cn(
                  "relative h-full p-4 sm:p-6 flex flex-col gap-3 items-center text-center transition-all cursor-pointer border rounded-xl overflow-hidden",
                  "hover:shadow-md hover:border-blue-400 group-hover:-translate-y-1",
                  active 
                    ? "border-blue-600 shadow-lg bg-blue-50/50 ring-1 ring-blue-600" 
                    : "bg-white hover:bg-gray-50"
                )}
              >
                {/* Icon Circle */}
                <div
                  className={cn(
                    "rounded-full p-3 border transition-all duration-300",
                    active 
                        ? "bg-blue-600 text-white border-blue-600 scale-110" 
                        : "bg-gray-50 text-gray-600 group-hover:bg-white group-hover:text-blue-600"
                  )}
                >
                  <Icon size={24} className="sm:w-7 sm:h-7" />
                </div>

                {/* Text Info */}
                <div className="space-y-1 w-full">
                  <p className={cn("font-semibold text-sm sm:text-base", active ? "text-blue-700" : "text-gray-900")}>
                    {t.label}
                  </p>
                  <p className="text-xs text-gray-500 hidden sm:block">{t.desc}</p>
                </div>
                
                {/* Mobile Active Dot */}
                {active && (
                    <div className="absolute top-3 right-3 w-2 h-2 bg-blue-600 rounded-full sm:hidden animate-pulse"></div>
                )}
              </Card>
            </button>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end pt-6 mt-4 border-t">
        <button
          onClick={onNext}
          disabled={!qrType}
          className={cn(
            "w-full sm:w-auto px-8 py-2.5 rounded-xl text-white font-medium transition-all shadow-sm",
            qrType
              ? "bg-blue-600 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
}