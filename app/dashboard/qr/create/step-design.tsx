"use client";

import { useState } from "react";
import LiveQRCode from "@/components/qr/live-qr-code";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Palette, Upload, Frame, Grid, Eye, ChevronDown, ChevronUp 
} from "lucide-react";

export default function StepDesign({ design, setDesign, content, onNext, onBack }: any) {
  
  const update = (field: string, value: any) => {
    setDesign({ ...design, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full animate-in fade-in duration-500">

      {/* LEFT: Design Controls (Scrollable) */}
      <div className="lg:col-span-7 space-y-4 sm:space-y-6 pb-24 lg:pb-0">
        
        {/* Header for Mobile Context */}
        <div className="lg:hidden text-center pb-2">
           <h3 className="text-lg font-semibold text-gray-900">Customize Design</h3>
           <p className="text-sm text-gray-500">Tap sections below to edit</p>
        </div>

        {/* Section 1: Colors */}
        <DesignSection title="Colors" icon={Palette} defaultOpen>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <ColorPicker 
              label="Foreground" 
              value={design.color} 
              // 🔥 FIX: Explicitly typed 'v' as string
              onChange={(v: string) => update("color", v)} 
            />
            <ColorPicker 
              label="Background" 
              value={design.bgColor} 
              // 🔥 FIX: Explicitly typed 'v' as string
              onChange={(v: string) => update("bgColor", v)} 
            />
          </div>
        </DesignSection>

        {/* Section 2: Logo */}
        <DesignSection title="Logo" icon={Upload}>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative group">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => update("logo", e.target.files?.[0] || null)}
            />
            <div className="space-y-2">
               <Upload className="mx-auto text-gray-400 group-hover:text-blue-500 transition-colors" size={32} />
               {design.logo ? (
                 <p className="text-sm font-medium text-green-600 truncate px-4">{design.logo.name}</p>
               ) : (
                 <>
                   <p className="text-sm font-medium text-gray-700">Upload Logo</p>
                   <p className="text-xs text-gray-400">PNG or JPG, max 2MB</p>
                 </>
               )}
            </div>
          </div>
        </DesignSection>

        {/* Section 3: Patterns */}
        <DesignSection title="Pattern Style" icon={Grid}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
             {["square", "rounded", "dots", "classy", "classy-rounded", "extra-rounded"].map((shape) => (
                <ShapeOption 
                   key={shape} 
                   shape={shape} 
                   selected={design.dotShape} 
                   onClick={() => update("dotShape", shape)} 
                />
             ))}
          </div>
        </DesignSection>

        {/* Section 4: Eyes */}
        <DesignSection title="Eye Style" icon={Eye}>
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
             {["square", "rounded", "circle", "leaf", "diamond"].map((shape) => (
                <ShapeOption 
                   key={shape} 
                   shape={shape} 
                   selected={design.eyeShape} 
                   onClick={() => update("eyeShape", shape)} 
                />
             ))}
          </div>
        </DesignSection>

        {/* Section 5: Frames */}
        <DesignSection title="Frame Options" icon={Frame}>
           <div className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                 {["none", "classic", "rounded", "bubble", "banner"].map((style) => (
                    <button
                      key={style}
                      onClick={() => update("frameStyle", style)}
                      className={`
                        px-4 py-2 rounded-lg border text-sm font-medium whitespace-nowrap transition-all flex-shrink-0
                        ${design.frameStyle === style 
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                          : "bg-white text-gray-700 hover:bg-gray-50"}
                      `}
                    >
                       {style.charAt(0).toUpperCase() + style.slice(1)}
                    </button>
                 ))}
              </div>

              {design.frameStyle !== "none" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                   <div className="space-y-2">
                      <Label>Frame Text</Label>
                      <Input 
                        value={design.frameText} 
                        onChange={(e) => update("frameText", e.target.value)} 
                        maxLength={20}
                        className="h-11" 
                      />
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ColorPicker 
                        label="Frame Color" 
                        value={design.frameColor || "#000000"} 
                        // 🔥 FIX: Explicitly typed 'v' as string
                        onChange={(v: string) => update("frameColor", v)} 
                      />
                      <ColorPicker 
                        label="Text Color" 
                        value={design.frameTextColor || "#ffffff"} 
                        // 🔥 FIX: Explicitly typed 'v' as string
                        onChange={(v: string) => update("frameTextColor", v)} 
                      />
                   </div>
                </div>
              )}
           </div>
        </DesignSection>

      </div>

      {/* RIGHT: Live Preview (Sticky Desktop) */}
      <div className="lg:col-span-5 relative hidden lg:block">
        <div className="sticky top-8 bg-gray-50 rounded-2xl border p-8 flex flex-col items-center justify-center min-h-[400px]">
           <div className="bg-white p-4 rounded-xl shadow-lg transform transition-transform hover:scale-105 duration-300">
              <LiveQRCode content={content || "https://example.com"} design={design} />
           </div>
           <p className="mt-6 text-sm text-gray-400 font-medium">Live Preview</p>
        </div>
      </div>

      {/* MOBILE PREVIEW (Bottom Bar) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white border rounded shadow-sm overflow-hidden p-1">
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[8px] text-gray-400">
                    QR
                </div>
            </div>
            <span className="text-sm font-semibold text-gray-800">Preview</span>
         </div>
         <div className="flex gap-3">
            <button onClick={onBack} className="px-4 py-2.5 text-sm border rounded-lg font-medium">Back</button>
            <button onClick={onNext} className="px-6 py-2.5 text-sm bg-blue-600 text-white rounded-lg font-medium shadow-sm">Next</button>
         </div>
      </div>

      {/* DESKTOP NAVIGATION */}
      <div className="col-span-full hidden lg:flex justify-between pt-6 border-t mt-auto">
        <button 
          onClick={onBack} 
          className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>

        <button
          onClick={onNext}
          className="px-8 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm hover:shadow-md transition-all"
        >
          Continue
        </button>
      </div>

    </div>
  );
}

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

function DesignSection({ title, icon: Icon, children, defaultOpen = false }: any) {
   const [isOpen, setIsOpen] = useState(defaultOpen);

   return (
     <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
        <button 
           onClick={() => setIsOpen(!isOpen)}
           className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors active:bg-gray-100"
        >
           <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                 <Icon size={18} />
              </div>
              <span className="font-semibold text-gray-900">{title}</span>
           </div>
           {isOpen ? <ChevronUp size={18} className="text-gray-400"/> : <ChevronDown size={18} className="text-gray-400"/>}
        </button>
        
        {isOpen && (
           <div className="p-4 pt-0 border-t border-gray-50 animate-in slide-in-from-top-1 duration-200">
              <div className="mt-4">{children}</div>
           </div>
        )}
     </div>
   );
}

function ColorPicker({ label, value, onChange }: any) {
   return (
      <div>
         <Label className="text-xs text-gray-500 mb-1.5 block font-medium">{label}</Label>
         <div className="flex items-center gap-3 border rounded-lg p-2 bg-white active:border-blue-300 transition-colors">
            <div 
              className="w-8 h-8 rounded-md border shadow-sm flex-shrink-0" 
              style={{ backgroundColor: value }}
            />
            <Input 
               type="text" 
               value={value} 
               onChange={(e) => onChange(e.target.value)}
               className="border-none h-8 p-0 text-sm focus-visible:ring-0 uppercase font-mono w-full"
               maxLength={7}
            />
            <input 
               type="color" 
               value={value} 
               onChange={(e) => onChange(e.target.value)}
               className="w-8 h-8 opacity-0 absolute cursor-pointer"
            />
         </div>
      </div>
   );
}

function ShapeOption({ shape, selected, onClick }: any) {
   return (
      <button
         onClick={onClick}
         className={`
            h-12 rounded-lg border text-xs font-medium capitalize transition-all active:scale-95
            ${selected === shape 
              ? "bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600" 
              : "bg-white text-gray-600 hover:border-blue-300"}
         `}
      >
         {shape.replace("-", " ")}
      </button>
   );
}