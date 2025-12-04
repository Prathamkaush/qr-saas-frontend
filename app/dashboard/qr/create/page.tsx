"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, QrCode, Type, Palette, Save } from "lucide-react";

import StepType from "./step-type";
import StepContent from "./step-content";
import StepDesign from "./step-design";
import StepPreview from "./step-preview";

function WizardLogic() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [qrType, setQrType] = useState<string | null>(null);

  const [content, setContent] = useState<any>({ url: "", text: "", name: "", phone: "", email: "", company: "", ssid: "", password: "", file: null });
  const [design, setDesign] = useState<any>({ color: "#000000", bgColor: "#FFFFFF", dotShape: "square", eyeShape: "square", logo: null, frameStyle: "none", frameText: "Scan Me", frameColor: "#2563eb", frameTextColor: "#ffffff", framePosition: "bottom" });

  useEffect(() => {
    const typeFromUrl = searchParams.get("type");
    if (typeFromUrl && !qrType) {
        setQrType(typeFromUrl);
        setStep(2);
    }
  }, [searchParams]);

  const computedContent = qrType === "url" ? content.url || "" : qrType === "text" ? content.text || "" : qrType === "wifi" ? `WIFI:S:${content.ssid};T:WPA;P:${content.password};;` : qrType === "vcard" ? `BEGIN:VCARD\nFN:${content.name}\nTEL:${content.phone}\nEMAIL:${content.email}\nORG:${content.company}\nEND:VCARD` : "";

  const next = () => { setStep((prev) => Math.min(prev + 1, 4)); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const back = () => { setStep((prev) => Math.max(prev - 1, 1)); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const steps = [ { id: 1, label: "Type", icon: QrCode }, { id: 2, label: "Content", icon: Type }, { id: 3, label: "Design", icon: Palette }, { id: 4, label: "Preview", icon: Save } ];

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Create QR Code</h1>
          <p className="text-sm sm:text-base text-gray-500">Design and customize your QR code in seconds.</p>
        </div>

        {/* Responsive Stepper */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6">
          <nav aria-label="Progress">
            <ol role="list" className="flex items-center justify-between w-full">
              {steps.map((s, index) => {
                const Icon = s.icon;
                const isCompleted = step > s.id;
                const isCurrent = step === s.id;
                
                return (
                  <li key={s.id} className={`relative flex flex-col items-center ${index !== steps.length - 1 ? "w-full" : ""}`}>
                    {/* Connecting Line */}
                    {index !== steps.length - 1 && (
                      <div className="absolute top-5 left-1/2 w-full h-0.5 -translate-y-1/2 bg-gray-100 -z-10">
                         <div className={`h-full transition-all duration-500 ease-in-out ${isCompleted ? "bg-blue-600" : "bg-transparent"}`} style={{ width: "100%" }} />
                      </div>
                    )}
                    
                    {/* Circle Icon */}
                    <div className={`
                        relative z-10 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ring-4
                        ${isCompleted ? "bg-blue-600 text-white ring-blue-50" : isCurrent ? "bg-white border-2 border-blue-600 text-blue-600 ring-blue-50" : "bg-gray-100 text-gray-400 ring-white"}
                    `}>
                        {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                    </div>

                    {/* Label (Hidden on tiny screens) */}
                    <span className={`mt-2 text-[10px] sm:text-xs font-medium uppercase tracking-wider ${isCurrent ? "text-blue-600" : "text-gray-400"}`}>
                        {s.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden min-h-[400px] sm:min-h-[500px]">
          <div className="p-4 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                {step === 1 && <StepType qrType={qrType} setQrType={setQrType} onNext={next} />}
                {step === 2 && <StepContent qrType={qrType} content={content} setContent={setContent} onNext={next} onBack={back} />}
                {step === 3 && <StepDesign design={design} setDesign={setDesign} content={computedContent} onNext={next} onBack={back} />}
                {step === 4 && <StepPreview qrType={qrType} content={content} design={design} onBack={back} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QRWizardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <WizardLogic />
    </Suspense>
  );
}