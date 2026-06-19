"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import BackButton from "@/components/BackButton";

const PremiumCharts = dynamic(() => import("@/components/PremiumCharts"), { ssr: false });

export default function AnalyticsHubPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [term, setTerm] = useState("Term 1 2025");

  if (!teacher) return null;

  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (!stored) {
      router.push("/login");
      return;
    }
    setTeacher(JSON.parse(stored));
  }, [router]);


  const isAdmin = teacher.role === "headteacher" || teacher.role === "dean";

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 md:p-12 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Intelligence Suite</span>
               {teacher.is_premium && <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest">Premium Active</span>}
            </div>
            <h1 className="text-4xl font-black text-gray-900">Analytics Command Center</h1>
            <p className="text-gray-500 font-medium">Data-driven decisions for {teacher.school_name}</p>
          </div>

          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
             <div className="px-4 py-1 border-r">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Analysis Period</p>
                <input
                  type="text"
                  value={term}
                  onChange={e => setTerm(e.target.value)}
                  className="text-sm font-bold border-none p-0 focus:ring-0 w-28 bg-transparent"
                />
             </div>
             <BackButton />
          </div>
        </header>

        {/* Premium Visualizations */}
        {teacher.is_premium && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
               <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse"></div>
               <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight">Executive Summary</h2>
            </div>
            <PremiumCharts schoolId={teacher.school_id} term={term} />
          </section>
        )}

        {/* Action Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Teacher Performance */}
          <div
            onClick={() => router.push("/analytics/teachers")}
            className="group relative bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:border-blue-400 cursor-pointer transition-all hover:shadow-xl"
          >
            <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
               👨‍🏫
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              {isAdmin ? "Staff Performance" : "Personal Analysis"}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {isAdmin
                ? "Evaluate teacher value-add scores, subject mean trends, and identify top-performing staff."
                : "Monitor your teaching impact with value-add scores and longitudinal performance tracking."
              }
            </p>
            <div className="flex items-center text-blue-600 text-xs font-bold uppercase tracking-wider group-hover:gap-2 transition-all">
               Open Module <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
          </div>

          {/* Student Risk Analytics */}
          <div
            onClick={() => router.push("/risk")}
            className="group relative bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:border-rose-400 cursor-pointer transition-all hover:shadow-xl"
          >
            <div className="h-16 w-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
               🚨
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Risk Forecasting</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              AI-driven identification of students vulnerable to academic failure or dropout based on behavioral patterns.
            </p>
            <div className="flex items-center text-rose-600 text-xs font-bold uppercase tracking-wider group-hover:gap-2 transition-all">
               View Alerts <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
          </div>

          {/* Subject Benchmarking (New Link) */}
          <div
            className="group relative bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 opacity-80"
          >
            <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-6">
               🧪
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Subject Mastery</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Comparative analysis of subject performance against national standards and previous years.
            </p>
            <div className="flex items-center text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
               Advanced Feature • Coming Soon
            </div>
          </div>

          {/* School-Wide Trends (Admin) */}
          {isAdmin && (
             <div
               onClick={() => router.push("/headteacher/dashboard")}
               className="group relative bg-indigo-900 p-8 rounded-[2rem] shadow-xl cursor-pointer transition-all hover:translate-y-[-4px]"
             >
                <div className="h-16 w-16 bg-white/10 text-white rounded-2xl flex items-center justify-center text-3xl mb-6">
                   🏢
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Executive Dashboard</h2>
                <p className="text-indigo-200 text-sm leading-relaxed mb-6">
                   Comprehensive school overview including financial status, attendance rates, and operational efficiency.
                </p>
                <div className="flex items-center text-white text-xs font-bold uppercase tracking-wider group-hover:gap-2 transition-all">
                   Enter Command <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
