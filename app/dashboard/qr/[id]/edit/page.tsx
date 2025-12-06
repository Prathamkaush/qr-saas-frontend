"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import StepContent from "../../create/step-content";
import StepDesign from "../../create/step-design";
import LiveQRCode from "@/components/qr/live-qr-code";

export default function EditQRPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "design">("content");

  const [qrType, setQrType] = useState("url");
  const [content, setContent] = useState<any>({});
  const [design, setDesign] = useState<any>({});

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  useEffect(() => {
    async function fetchQR() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/qr/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        setQrType(data.qr_type);

        if (data.qr_type === "url")
          setContent({ url: data.target_url, name: data.name });
        else if (data.qr_type === "text")
          setContent({ text: data.target_url, name: data.name });
        else if (data.qr_type === "wifi")
          setContent({ ssid: "Update to change", password: "", name: data.name });
        else setContent({ name: data.name });

        if (data.design_json) {
          setDesign(JSON.parse(data.design_json));
        }
      } catch (e) {
        console.error("Error loading QR", e);
        router.push("/dashboard/qr");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchQR();
  }, [id]);

const handleSave = async () => {
  setSaving(true);
  try {
    const token = localStorage.getItem("token");

    // Convert file -> base64
    const fileToBase64 = (file: File) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });

    // Determine target URL based on type
    const targetUrl =
      qrType === "url"
        ? content.url
        : qrType === "text"
        ? content.text
        : content.url;

    // Prepare design object
    let finalDesign = { ...design };
    if (design.logo instanceof File) {
      finalDesign.logo = await fileToBase64(design.logo);
    }

    const payload = {
      name: content.name,
      target_url: targetUrl,
      design: finalDesign,
    };

    const res = await fetch(`${API_URL}/qr/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Update error:", err);
      alert("Failed to update");
    } else {
      router.push("/dashboard/qr");
    }
  } catch (e) {
    console.error(e);
    alert("Error saving changes");
  } finally {
    setSaving(false);
  }
};


  const computedContent =
    qrType === "url"
      ? content.url || ""
      : qrType === "text"
      ? content.text || ""
      : "";

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/qr">
              <button className="p-2 bg-white border rounded-full hover:bg-gray-100">
                <ArrowLeft size={20} />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Edit QR Code</h1>
              <p className="text-sm text-gray-500">Update content or redesign.</p>
            </div>
          </div>

          
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT PANEL */}
          <div className="lg:col-span-7">
            <div className="bg-white border rounded-2xl shadow p-6">

              <div className="flex border-b mb-6">
                <button
                  onClick={() => setActiveTab("content")}
                  className={`flex-1 py-3 text-center font-medium ${
                    activeTab === "content"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Content
                </button>

                <button
                  onClick={() => setActiveTab("design")}
                  className={`flex-1 py-3 text-center font-medium ${
                    activeTab === "design"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Design
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "content" ? (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.15 }}
                  >
                    <StepContent
                      qrType={qrType}
                      content={content}
                      setContent={setContent}
                      onNext={() => setActiveTab("design")}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="design"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.15 }}
                  >
                    <StepDesign
                      design={design}
                      setDesign={setDesign}
                      content={computedContent}
                      onNext={handleSave}
                      onBack={() => setActiveTab("content")}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          

        </div>
      <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-70"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Save Changes
          </button>
      </div>
    
    </div>


);
}
