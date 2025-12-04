"use client";

import { Check, CreditCard, Zap } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Billing & Plans</h1>

      {/* Current Plan Status */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Current Plan</span>
            </div>
            <h2 className="text-3xl font-bold">Pro Plan</h2>
            <p className="text-blue-100 mt-1">Renews on January 1st, 2026</p>
          </div>
          <button className="bg-white text-blue-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-md">
            Manage Subscription
          </button>
        </div>
        {/* Decorative circle */}
        <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Zap size={20}/></div>
             <h3 className="font-semibold text-gray-900">Dynamic QR Codes</h3>
          </div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium">12 used</span>
            <span className="text-gray-500">of 50 limit</span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
             <div className="h-full bg-blue-500 w-[24%] rounded-full"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Check size={20}/></div>
             <h3 className="font-semibold text-gray-900">Monthly Scans</h3>
          </div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium">4,200 scans</span>
            <span className="text-gray-500">of 10,000 limit</span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
             <div className="h-full bg-green-500 w-[42%] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-100 rounded border">
               <CreditCard className="text-gray-600" size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900">Visa ending in 4242</p>
              <p className="text-sm text-gray-500">Expires 12/28</p>
            </div>
          </div>
          <button className="text-blue-600 font-medium hover:text-blue-700 text-sm">Update</button>
        </div>
      </div>
    </div>
  );
}