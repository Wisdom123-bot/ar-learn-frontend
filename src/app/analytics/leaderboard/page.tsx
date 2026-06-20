"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import BackButton from "@/components/BackButton";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

interface LeaderboardData {
  school_name: string;
  county: string;
  school_mean: number;
  national_rank: number;
  total_schools_national: number;
  county_rank: number;
  total_schools_county: number;
  national_top_5: any[];
  county_top_5: any[];
  subject_means: Record<string, number>;
}

import { useAuthStore } from "@/lib/store";

export default function LeaderboardPage() {
  const router = useRouter();
  const { user: teacher } = useAuthStore();
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [term, setTerm] = useState("Term 1 2025");
  const [loading, setLoading] = useState(false);
  const [optedIn, setOptedIn] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [scope, setScope] = useState<"national" | "county">("national");

  const chartData = useMemo(() => {
    if (!data || !teacher) return [];
    const list = scope === "national" ? (data.national_top_5 || []) : (data.county_top_5 || []);

    // Ensure current school is in the list for comparison if it's not top 5
    const results = list.map(s => ({
       name: s.school_name,
       mean: s.school_mean,
       isMe: s.school_id === teacher.school_id
    }));

    const isMeInTop5 = results.some(r => r.isMe);
    if (!isMeInTop5) {
       results.push({
          name: data.school_name + " (You)",
          mean: data.school_mean,
          isMe: true
       });
    }

    return results.sort((a,b) => b.mean - a.mean);
  }, [data, scope, teacher]);

  useEffect(() => {
    if (!teacher) {
      router.push("/login");
      return;
    }

    const isOptedIn = localStorage.getItem(`leaderboard_optin_${teacher.school_id}`);
    if (isOptedIn) {
       setOptedIn(true);
       fetchLeaderboard(teacher.school_id, term);
    } else {
       setShowConfirm(true);
    }
  }, []);

  if (!teacher) return null;

  const fetchLeaderboard = async (schoolId: string, t: string) => {
    setLoading(true);
    try {
      const res = await api.get("/analytics/leaderboard", {
        params: { school_id: schoolId, term: t }
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptIn = () => {
    localStorage.setItem(`leaderboard_optin_${teacher.school_id}`, "true");
    setOptedIn(true);
    setShowConfirm(false);
    fetchLeaderboard(teacher.school_id, term);
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 text-black">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-12">
           <div className="flex items-center gap-4">
              <BackButton />
              <div>
                 <h1 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">School Leaderboard</h1>
                 <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Global performance benchmarking</p>
              </div>
           </div>

           <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
              <span className="text-[10px] font-black text-gray-400 uppercase px-3">Term</span>
              <input
                type="text"
                value={term}
                onChange={e => setTerm(e.target.value)}
                className="w-28 border-none p-0 text-sm font-black focus:ring-0"
              />
           </div>
        </header>

        {showConfirm && (
           <div className="fixed inset-0 z-[100] bg-gray-900/90 backdrop-blur-xl flex items-center justify-center p-6">
              <div className="bg-white rounded-[3rem] p-12 max-w-xl w-full text-center shadow-2xl border border-gray-100">
                 <div className="h-24 w-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce">🏆</div>
                 <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic">Enter the Arena?</h2>
                 <p className="text-gray-500 font-medium leading-relaxed mb-10">
                    By entering the rank system, your school's mean grade and subject performance will be visible to other schools in the software. Are you sure you want to compare your metrics at a county and nationwide level?
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4">
                    <button
                       onClick={handleOptIn}
                       className="flex-1 py-5 bg-gray-900 text-white rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-blue-600 transition-all shadow-xl hover:shadow-blue-200"
                    >
                       Yes, Enter Rankings
                    </button>
                    <button
                       onClick={() => router.back()}
                       className="flex-1 py-5 bg-gray-100 text-gray-400 rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-gray-200 transition-all"
                    >
                       Maybe Later
                    </button>
                 </div>
              </div>
           </div>
        )}

        {loading ? (
           <div className="text-center py-20 flex flex-col items-center">
              <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Aggregating National Data...</p>
           </div>
        ) : data && (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Top Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-gradient-to-br from-indigo-900 to-black p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-20 transition-opacity">
                       <svg width="150" height="150" viewBox="0 0 24 24" fill="white">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                       </svg>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-4 opacity-50">National Rank</p>
                    <div className="flex items-baseline gap-4 mb-2">
                       <span className="text-8xl font-black italic">#{data.national_rank}</span>
                       <span className="text-lg font-bold text-blue-400">/ {data.total_schools_national}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-400">Based on school mean of <span className="text-white font-bold">{data.school_mean}%</span></p>
                 </div>

                 <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col justify-between group">
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-4">County Rank: {data.county}</p>
                       <div className="flex items-baseline gap-4">
                          <span className="text-8xl font-black text-gray-900 italic group-hover:text-blue-600 transition-colors">#{data.county_rank}</span>
                          <span className="text-lg font-bold text-gray-400">/ {data.total_schools_county}</span>
                       </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-50 flex items-center gap-2">
                       <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                       <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Outperforming {Math.round(((data.total_schools_county - data.county_rank) / data.total_schools_county) * 100)}% of local schools</p>
                    </div>
                 </div>
              </div>

              {/* Ranking Comparison Chart */}
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                 <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                       <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">Arena Comparison</h3>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Mean Grade vs Top Performers</p>
                    </div>
                    <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-1">
                       <button
                          onClick={() => setScope("national")}
                          className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition ${scope === "national" ? "bg-white text-gray-900 shadow-md" : "text-gray-400"}`}
                       >
                          National
                       </button>
                       <button
                          onClick={() => setScope("county")}
                          className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition ${scope === "county" ? "bg-white text-gray-900 shadow-md" : "text-gray-400"}`}
                       >
                          County
                       </button>
                    </div>
                 </div>

                 <div className="h-80 w-full min-h-[320px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minHeight={320} minWidth={0} debounce={50}>
                       <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis
                             dataKey="name"
                             axisLine={false}
                             tickLine={false}
                             tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                             padding={{ left: 20, right: 20 }}
                          />
                          <YAxis domain={[0, 100]} hide />
                          <Tooltip
                             cursor={{fill: '#f8fafc'}}
                             contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}}
                          />
                          <Bar dataKey="mean" radius={[12, 12, 0, 0]} barSize={40}>
                             {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.isMe ? '#4f46e5' : '#e2e8f0'} />
                             ))}
                          </Bar>
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* Subject Breakdown Benchmarking */}
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                 <h3 className="text-2xl font-black text-gray-900 mb-8 uppercase italic tracking-tight">Subject Mastery Index</h3>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {Object.entries(data.subject_means).map(([sid, mean]) => (
                       <div key={sid} className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 text-center hover:bg-indigo-50 hover:border-indigo-200 transition-all group">
                          <p className="text-[9px] font-black text-gray-400 uppercase mb-2 group-hover:text-indigo-400 transition-colors">Mean score</p>
                          <p className="text-2xl font-black text-gray-900">{mean}%</p>
                          {/* We'd ideally map sid to subject name here */}
                          <p className="text-[10px] font-bold text-gray-400 mt-1 line-clamp-1">{sid.slice(0,8)}</p>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
