"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, BarChart3, Download, Edit, Globe, Layers, QrCode, ShieldCheck, Zap, 
  User, FileText, File, Wifi 
} from "lucide-react";
import { BeamLogo } from "@/components/ui/logo"; 
import LiveQRCode from "@/components/qr/live-qr-code"; 

// Base64 Beam Logo for Watermark (Blue)
const BEAM_LOGO_DATA_URL = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHJ4PSI4IiBmaWxsPSIjMjU2M2ViIi8+PHBhdGggZD0iTTIwIDJMMTAgMzAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHJlY3QgeD0iNyIgeT0iMTAiIHdpZHRoPSIzIiBoZWlnaHQ9IjMiIHJ4PSIxIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjkiLz48cmVjdCB4PSI3IiB5PSIxOCIgd2lkdGg9IjMiIGhlaWdodD0iMyIgcng9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuOSIvPjxyZWN0IHg9IjIyIiB5PSIxMCIgd2lkdGg9IjMiIGhlaWdodD0iMyIgcng9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuOSIvPj48Y2lyY2xlIGN4PSIyMS41IiBjeT0iMjAuNSIgcj0iMi41IiBmaWxsPSIjYmZkYmZlIi8+PC9zdmc+`;

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [demoContent, setDemoContent] = useState("");
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const qrRef = useRef<any>(null);

  // Check login status & Load Watermark
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    
  }, []);

  const handleDownload = () => {
    if (qrRef.current) {
      qrRef.current.download("png");
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BeamLogo size={32} />
            <span className="text-xl font-bold text-gray-900 tracking-tight">Beam</span>
          </div>
          
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
               <Link href="/dashboard">
                 <button className="bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2">
                   Go to Dashboard <ArrowRight size={16} />
                 </button>
               </Link>
            ) : (
               <>
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">
                  Log in
                </Link>
                <Link href="/signup">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md">
                    Get Started
                  </button>
                </Link>
               </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Interactive Generator */}
      <section className="pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              v2.0 is now live
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight">
              Turn any link into a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                powerful connection
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
              Create dynamic, trackable QR codes in seconds. Analyze scans, update destinations, and customize designs to match your brand.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group active:scale-95">
                  Create for Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="#features">
                <button className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-bold transition-all active:scale-95">
                  Explore Features
                </button>
              </Link>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 pt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                ))}
              </div>
              <p>Trusted by 10,000+ creators</p>
            </div>
          </motion.div>

          {/* Right: Interactive Generator Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            {/* Decoratiive Blur */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-purple-200 rounded-[2rem] transform rotate-3 scale-105 opacity-40 blur-3xl -z-10"></div>
            
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-2">
               <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 space-y-6">
                  
                  {/* Input Area */}
                  <div className="space-y-2">
                     <label className="text-sm font-semibold text-gray-700 ml-1">Enter your link</label>
                     <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          type="text" 
                          value={demoContent}
                          onChange={(e) => setDemoContent(e.target.value)}
                          placeholder="https://your-website.com"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                        />
                     </div>
                  </div>

                  {/* QR Preview Area */}
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                     {/* Using your existing LiveQRCode component */}
                     <LiveQRCode 
       ref={qrRef}
       content={demoContent} 
       watermark={true}
       design={{
          color: "#000000",
          bgColor: "#ffffff",
          dotShape: "square",
          eyeShape: "square",
          logo: BEAM_LOGO_DATA_URL // 🔥 Pass the string constant directly
       }} 
    />
                     
                     {/* Watermark Overlay (Visual Hint) */}
                     <div className="absolute bottom-4 flex items-center gap-1.5 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm border border-gray-100 pointer-events-none">
                        <BeamLogo size={14} />
                        <span className="text-[10px] font-bold text-gray-900 tracking-tight uppercase">Powered by Beam</span>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                     <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={handleDownload}
                          className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all active:scale-95 text-sm"
                        >
                           <Download size={16} /> Download
                        </button>
                        <Link href="/signup" className="w-full">
                           <button className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-black text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-gray-500/20 active:scale-95 text-sm">
                              <Zap size={16} className="text-yellow-400" /> Remove Logo
                           </button>
                        </Link>
                     </div>
                     
                     {/* Customize Design Button (Redirects to Login) */}
                     <Link href="/login" className="block w-full">
                        <button className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-xl transition-all active:scale-95 text-sm border border-blue-100">
                           <Edit size={16} /> Customize Design
                        </button>
                     </Link>
                  </div>
                  
                  <p className="text-xs text-center text-gray-400">
                     Free downloads include watermark. <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link> to remove it.
                  </p>

               </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-gray-900">Create any type of QR Code</h2>
               <p className="text-gray-600 mt-2">One platform for all your connections.</p>
            </div>
            
            {/* 🔥 UPDATED: Only URL, Text, vCard, PDF, WiFi */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
               {[
                 { label: 'Website', icon: <Globe size={20} className="text-blue-500" /> },
                 { label: 'Plain Text', icon: <FileText size={20} className="text-gray-500" /> },
                 { label: 'vCard', icon: <User size={20} className="text-purple-500" /> },
                 { label: 'PDF', icon: <File size={20} className="text-red-500" /> },
                 { label: 'WiFi', icon: <Wifi size={20} className="text-yellow-500" /> },
               ].map((item) => (
                 <Link key={item.label} href="/signup">
                   <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-gray-100 shadow-sm bg-gray-50/50 hover:bg-white hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">
                      <div className="mb-3 p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <span className="font-semibold text-gray-700 text-sm">{item.label}</span>
                   </div>
                 </Link>
               ))}
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Everything you need to grow</h2>
            <p className="mt-4 text-lg text-gray-600">Beam provides the tools you need to create, manage, and track your QR codes effectively.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="text-yellow-600" />}
              title="Dynamic QR Codes"
              desc="Edit the destination URL anytime, even after printing. No need to reprint your materials."
            />
            <FeatureCard 
              icon={<BarChart3 className="text-blue-600" />}
              title="Real-time Analytics"
              desc="Track scans, location, device type, and time. Make data-driven decisions."
            />
            <FeatureCard 
              icon={<Edit className="text-purple-600" />}
              title="Custom Design"
              desc="Add your logo, change colors, and choose custom frames to match your brand identity."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-green-600" />}
              title="Secure & Reliable"
              desc="Enterprise-grade security ensuring your data and your users are always safe."
            />
            <FeatureCard 
              icon={<Layers className="text-indigo-600" />}
              title="Bulk Creation"
              desc="Generate hundreds of QR codes at once for inventory, tickets, or products."
            />
            <FeatureCard 
              icon={<Globe className="text-cyan-600" />}
              title="Custom Domains"
              desc="Use your own domain for short links to build trust and brand recognition."
            />
          </div>
        </div>
      </section>

      {/* Stats/Social Proof */}
      <section className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
              <div>
                 <p className="text-4xl font-bold text-blue-600">10M+</p>
                 <p className="text-gray-500 mt-2">Scans Tracked</p>
              </div>
              <div>
                 <p className="text-4xl font-bold text-blue-600">50k+</p>
                 <p className="text-gray-500 mt-2">Active Users</p>
              </div>
              <div>
                 <p className="text-4xl font-bold text-blue-600">99.9%</p>
                 <p className="text-gray-500 mt-2">Uptime</p>
              </div>
              <div>
                 <p className="text-4xl font-bold text-blue-600">24/7</p>
                 <p className="text-gray-500 mt-2">Support</p>
              </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-blue-600 rounded-3xl overflow-hidden shadow-2xl relative">
           {/* Background Pattern */}
           <div className="absolute inset-0 opacity-10">
              <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
              </svg>
           </div>
           
           <div className="relative z-10 text-center py-16 px-6 sm:px-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Beam your content?</h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                 Join thousands of businesses using Beam to connect with their customers. No credit card required to start.
              </p>
              <Link href="/signup">
                <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
                   Get Started for Free
                </button>
              </Link>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="col-span-2 md:col-span-1">
                 <div className="flex items-center gap-2 mb-4">
                    <BeamLogo size={24} />
                    <span className="font-bold text-lg text-gray-900">Beam</span>
                 </div>
                 <p className="text-sm text-gray-500">
                    Connecting the physical and digital worlds, one scan at a time.
                 </p>
              </div>
              <div>
                 <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
                 <ul className="space-y-2 text-sm text-gray-600">
                    <li><Link href="#" className="hover:text-blue-600">Features</Link></li>
                    <li><Link href="#" className="hover:text-blue-600">Pricing</Link></li>
                    <li><Link href="#" className="hover:text-blue-600">API</Link></li>
                 </ul>
              </div>
              <div>
                 <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
                 <ul className="space-y-2 text-sm text-gray-600">
                    <li><Link href="#" className="hover:text-blue-600">Blog</Link></li>
                    <li><Link href="#" className="hover:text-blue-600">Help Center</Link></li>
                    <li><Link href="#" className="hover:text-blue-600">Guides</Link></li>
                 </ul>
              </div>
              <div>
                 <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
                 <ul className="space-y-2 text-sm text-gray-600">
                    <li><Link href="#" className="hover:text-blue-600">About</Link></li>
                    <li><Link href="#" className="hover:text-blue-600">Careers</Link></li>
                    <li><Link href="#" className="hover:text-blue-600">Contact</Link></li>
                 </ul>
              </div>
           </div>
           <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">© 2025 Beam QR. All rights reserved.</p>
              <div className="flex gap-6">
                 <Link href="#" className="text-gray-400 hover:text-gray-600"><span className="sr-only">Twitter</span>🐦</Link>
                 <Link href="#" className="text-gray-400 hover:text-gray-600"><span className="sr-only">GitHub</span>🐙</Link>
                 <Link href="#" className="text-gray-400 hover:text-gray-600"><span className="sr-only">LinkedIn</span>💼</Link>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all"
    >
      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}