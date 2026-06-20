"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import api, { validatedGet } from "@/lib/api";
import { TeacherAnalyticsResponseSchema, TeacherSchema, type TeacherPerformance, type Teacher } from "@/lib/schemas";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from "recharts";
import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/lib/store";

export default function TeacherAnalyticsPage() {
  const router = useRouter();
  const { user: teacher } = useAuthStore();
  const [term, setTerm] = useState("Term 1 2025");
  const [previousTerm, setPreviousTerm] = useState("Term 3 2024");

  useEffect(() => {
    if (!teacher) {
      router.push("/login");
      return;
    }
    fetchRankings(teacher.school_id, term);
  }, [teacher, router, term]);

  // TanStack Query for Teacher Analytics
  const { data: analyticsData, isLoading, error, refetch } = useQuery({
    queryKey: ["teacherAnalytics", teacher?.school_id, term, previousTerm],
    queryFn: () => validatedGet("/analytics/teachers", TeacherAnalyticsResponseSchema, {
      params: { school_id: teacher?.school_id, term, previous_term: previousTerm || undefined },
    }),
    enabled: !!teacher?.school_id,
  });

  const data = analyticsData?.teachers || [];

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const radarData = useMemo(() => {
    if (data.length === 0) return [];
    const t = data[0];
    return [
      { subject: "Current", A: t.current_mean, fullMark: 100 },
      { subject: "Previous", A: t.previous_mean || 0, fullMark: 100 },
      { subject: "Benchmark", A: t.school_subject_mean || 0, fullMark: 100 },
      { subject: "Value Add", A: 50 + (t.value_add || 0), fullMark: 100 },
    ];
  }, [data]);

  if (!teacher) return null;


  const isAdmin = teacher.role === "headteacher" || teacher.role === "dean";

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 text-gray-800">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              aria-label="Back to Analytics Hub"
              onClick={() => router.push("/analytics")}
              className="p-3 bg-white hover:bg-gray-50 rounded-2xl transition shadow-sm border border-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight" aria-level={1}>
                {isAdmin ? "Staff Performance Registry" : "Performance Analytics"}
              </h1>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{term} · Intelligence Engine</p>
            </div>
          </div>

          <form onSubmit={handleFilter} className="flex gap-2 items-end">
            <div className="flex bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5">
               <div className="px-3">
                  <p className="text-[8px] font-black text-gray-400 uppercase">Analysis</p>
                  <input
                    aria-label="Current Analysis Term"
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="p-0 text-xs font-bold border-none focus:ring-0 w-24 bg-transparent"
                  />
               </div>
              <div className="w-[1px] bg-gray-100 my-2"></div>
              <div className="px-3">
                  <p className="text-[8px] font-black text-gray-400 uppercase">Baseline</p>
                  <input
                    aria-label="Baseline Term for comparison"
                    type="text"
                    value={previousTerm}
                    onChange={(e) => setPreviousTerm(e.target.value)}
                    className="p-0 text-xs font-bold border-none focus:ring-0 w-24 bg-transparent text-gray-400"
                  />
              </div>
            </div>
            <button
              type="submit"
              aria-label="Update Analytics View"
              className="bg-gray-900 text-white p-3 rounded-2xl hover:bg-blue-600 transition shadow-lg active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </form>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20" aria-busy="true">
            <div className="relative">
               <div className="h-16 w-16 border-4 border-blue-100 rounded-full"></div>
               <div className="absolute top-0 h-16 w-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-6">Quantifying Metrics...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-3xl text-center border border-red-100 shadow-sm font-bold text-sm" role="alert">
            {(error as any).message || "Failed to load analytics"}
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] shadow-sm border border-gray-100 text-center">
             <div className="text-6xl mb-6">📊</div>
             <h3 className="text-2xl font-black text-gray-900 mb-2">Dataset Empty</h3>
             <p className="text-gray-500 max-w-xs mx-auto text-sm">We couldn't find any performance records for the selected terms.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Visual Insights Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Radar Chart for Single Teacher or Top Performer */}
               <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100" role="region" aria-label="Performance Competency Map">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Competency Map</h3>
                  <div className="h-64 min-h-[256px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minHeight={256} minWidth={0} debounce={50}>
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData} aria-label="Teacher Competency Radar Chart">
                        <PolarGrid stroke="#f1f5f9" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                        <Radar name={data[0]?.teacher_name} dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[10px] text-center text-gray-400 font-bold uppercase mt-4">Multi-dimensional performance variance</p>
               </div>

               {/* Stats Cards */}
               <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
                     <div className="absolute -right-4 -bottom-4 text-white/10 text-9xl font-black group-hover:scale-110 transition-transform duration-700">∑</div>
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-70">Primary Mean</p>
                     <p className="text-5xl font-black mb-4">{data[0]?.current_mean}%</p>
                     <div className="flex items-center gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black">
                           {data[0]?.change !== null && (data[0]?.change ?? 0) >= 0 ? "+" : ""}{data[0]?.change}% TREND
                        </span>
                     </div>
                  </div>

                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between">
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Value‑Add (V.A)</p>
                        <p className={`text-4xl font-black ${data[0]?.value_add >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                           {data[0]?.value_add > 0 ? "+" : ""}{data[0]?.value_add}%
                        </p>
                     </div>
                     <div className="h-2 w-full bg-gray-50 rounded-full mt-6 overflow-hidden">
                        <div
                           className={`h-full transition-all duration-1000 ${data[0]?.value_add >= 0 ? "bg-emerald-500" : "bg-rose-500"}`}
                           style={{ width: `${Math.min(Math.abs((data[0]?.value_add ?? 0) * 10), 100)}%` }}
                        ></div>
                     </div>
                     <p className="text-[9px] font-bold text-gray-400 mt-2 uppercase">Improvement from previous term</p>
                  </div>
               </div>
            </div>

            {/* Detailed Registry Table */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                 <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Performance Registry</h2>
                 <span className="text-[10px] font-bold text-gray-400">{data.length} Teachers active</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" aria-label="Detailed teacher performance data">
                  <thead>
                    <tr className="text-gray-400 uppercase text-[9px] font-black tracking-[0.15em]">
                      <th className="text-left p-8">Identity</th>
                      <th className="text-center p-8">Metric</th>
                      <th className="text-center p-8">Trajectory</th>
                      <th className="text-center p-8">Benchmark</th>
                      <th className="text-center p-8">Value‑Add</th>
                      <th className="text-center p-8">Fragility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.map((t) => (
                      <tr key={t.teacher_id} className="hover:bg-blue-50/20 transition-all group">
                        <td className="p-8">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all duration-500">
                              {t.teacher_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-gray-900 text-base">{t.teacher_name}</p>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{t.teacher_id.slice(0,12)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-8 text-center">
                          <span className="font-black text-gray-900 text-lg">{t.current_mean}%</span>
                        </td>
                        <td className="p-8 text-center">
                          {t.change !== null ? (
                            <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black ${t.change > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                              {t.change > 0 ? "▲" : "▼"} {Math.abs(t.change)}%
                            </div>
                          ) : (
                            <span className="text-gray-200 font-black">—</span>
                          )}
                        </td>
                        <td className="p-8 text-center">
                          <span className="text-gray-400 font-black">{t.school_subject_mean ?? "—"}%</span>
                        </td>
                        <td className="p-8 text-center">
                          <div className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black ${t.value_add !== null && t.value_add >= 0 ? "bg-emerald-500 text-white" : "bg-rose-500 text-white shadow-rose-100"} shadow-lg transition-transform hover:scale-110`}>
                            {t.value_add !== null && t.value_add > 0 ? "+" : ""}{t.value_add}%
                          </div>
                        </td>
                        <td className="p-8 text-center">
                          {t.risk_student_count > 0 ? (
                            <div className="flex flex-col items-center">
                              <span className="text-rose-600 font-black text-lg">{t.risk_student_count}</span>
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden shadow-inner">
                                <div className="h-full bg-rose-500" style={{ width: `${Math.min(t.risk_student_count * 10, 100)}%` }}></div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-emerald-500 font-black uppercase text-[10px] tracking-widest">Minimal</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
