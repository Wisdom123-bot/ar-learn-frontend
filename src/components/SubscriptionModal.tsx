"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

interface SubscriptionStatus {
  tier: string;
  actual_tier: string;
  is_active: boolean;
  expiry: string | null;
  has_pending: boolean;
  student_count: number;
}

export default function SubscriptionModal({ isOpen, onClose, status }: { isOpen: boolean, onClose: () => void, status: SubscriptionStatus | null }) {
  const [step, setStep] = useState<"choose" | "pay" | "waiting">("choose");
  const [selectedTier, setSelectedTier] = useState<"standard" | "elite" | null>(null);
  const [mpesaMessage, setMpesaMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const studentCount = status?.student_count || 0;
  const standardPrice = studentCount * 10 * 4;
  const elitePrice = studentCount * 17 * 4;

  const handleRequest = async () => {
    if (!selectedTier || !mpesaMessage.trim()) return;
    setLoading(true);
    setError("");
    try {
      await api.post("/subscription/request", {
        tier: selectedTier,
        mpesa_message: mpesaMessage
      });
      setStep("waiting");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  const tiers = [
    {
      id: "basic",
      name: "Basic Tier",
      subtitle: "Foundation",
      price: "Free",
      color: "gray",
      features: [
        "Student Admissions & Unique IDs",
        "Teacher Onboarding",
        "Digital Attendance Register",
        "Academic Score Archival",
        "Performance Means Calculation",
        "Incident Logs (Discipline)",
        "Standard Fee Tracking",
        "Subject Allocation"
      ]
    },
    {
      id: "standard",
      name: "Standard Tier",
      subtitle: "Growth",
      price: `KES ${standardPrice.toLocaleString()}`,
      period: "per 4 months",
      color: "blue",
      features: [
        "Branded Report Builder",
        "Parent-Teacher Messaging",
        "Automated Timetabling",
        "Regional Benchmarking",
        "Student Badge System",
        "Financial Deficit Analytics",
        "Bulk Data Tools",
        "System-Wide Audit Logging"
      ]
    },
    {
      id: "elite",
      name: "Elite Tier",
      subtitle: "Visionary",
      price: `KES ${elitePrice.toLocaleString()}`,
      period: "per 4 months",
      color: "purple",
      features: [
        "Top-Tier Multimodal Vision (CBC)",
        "ML Grade Forecasting",
        "Natural Language AI Assistant",
        "Predictive Failure Alerts",
        "Automated AI Summaries",
        "Offline-First Sync Engine",
        "Atomic Transactions",
        "JWT-Signed Identity"
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

        {/* Header */}
        <div className="p-8 pb-0 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Choose Your Path</h2>
            <p className="text-gray-500 font-medium">Empower your school with the right tools.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {step === "choose" && (
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tiers.map((t) => (
                <div
                  key={t.id}
                  className={`relative p-6 rounded-[2rem] border-2 transition-all ${
                    t.id === "basic" ? "border-gray-100 bg-gray-50" :
                    t.id === "standard" ? "border-blue-100 hover:border-blue-400 bg-blue-50/30" :
                    "border-purple-100 hover:border-purple-400 bg-purple-50/30"
                  }`}
                >
                  <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                    t.color === "gray" ? "text-gray-400" :
                    t.color === "blue" ? "text-blue-600" : "text-purple-600"
                  }`}>
                    {t.subtitle}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">{t.name}</h3>
                  <div className="mb-4">
                    <span className="text-2xl font-black text-gray-900">{t.price}</span>
                    {t.period && <span className="text-xs font-bold text-gray-500 ml-1">{t.period}</span>}
                  </div>

                  <ul className="space-y-2 mb-8">
                    {t.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-medium text-gray-600">
                        <svg className={`shrink-0 mt-0.5 ${t.color === "gray" ? "text-gray-400" : t.color === "blue" ? "text-blue-500" : "text-purple-500"}`} width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {t.id !== "basic" && (
                    <button
                      onClick={() => { setSelectedTier(t.id as any); setStep("pay"); }}
                      className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${
                        t.color === "blue" ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700"
                      }`}
                    >
                      Select {t.name}
                    </button>
                  )}
                  {t.id === "basic" && (
                    <div className="w-full py-3 text-center font-bold text-gray-400">
                      Current Plan
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === "pay" && (
          <div className="p-8 max-w-md mx-auto text-center">
             <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M12 2v20m-5-17a5 5 0 100 10c2 0 3 1 5 1s3 1 3 3a5 5 0 01-10 0" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
             </div>
             <h3 className="text-2xl font-black text-gray-900 mb-2">Secure Payment</h3>
             <p className="text-gray-600 font-medium mb-6">
               Please send <span className="text-gray-900 font-bold">{selectedTier === "standard" ? tiers[1].price : tiers[2].price}</span> to the following number:
             </p>

             <div className="bg-gray-50 p-6 rounded-[2rem] border-2 border-dashed border-gray-200 mb-6">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">M-Pesa Recipient</div>
                <div className="text-3xl font-black text-blue-600 tracking-tighter">0702382123</div>
             </div>

             <div className="text-left mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-2">Paste M-Pesa Confirmation Message</label>
                <textarea
                  value={mpesaMessage}
                  onChange={(e) => setMpesaMessage(e.target.value)}
                  placeholder="MPESA Confirmed. KES... received from..."
                  className="w-full h-32 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-medium focus:border-blue-400 focus:outline-none transition-colors resize-none"
                />
             </div>

             {error && <p className="text-sm font-bold text-red-500 mb-4">{error}</p>}

             <div className="flex gap-4">
                <button
                  onClick={() => setStep("choose")}
                  className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleRequest}
                  disabled={loading || !mpesaMessage.trim()}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-2xl font-bold text-white shadow-xl shadow-blue-200 transition-all active:scale-95"
                >
                  {loading ? "Processing..." : "Submit Payment"}
                </button>
             </div>
          </div>
        )}

        {step === "waiting" && (
          <div className="p-12 text-center">
             <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
             </div>
             <h3 className="text-3xl font-black text-gray-900 mb-3">Verifying Your Payment</h3>
             <p className="text-lg text-gray-600 font-medium max-w-sm mx-auto mb-8">
               We've received your request. Verification typically takes <span className="text-blue-600 font-bold">under 10 minutes</span>.
             </p>
             <p className="text-sm text-gray-400 mb-8">
               In the meantime, you can continue using the <span className="font-bold">Basic Mode</span>. We'll notify you once your {selectedTier} features are active.
             </p>
             <button
                onClick={onClose}
                className="px-12 py-4 bg-gray-900 hover:bg-black rounded-2xl font-bold text-white shadow-xl transition-all active:scale-95"
             >
               Return to Dashboard
             </button>
          </div>
        )}

      </div>
    </div>
  );
}
