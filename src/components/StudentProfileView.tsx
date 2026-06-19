"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, Legend
} from "recharts";
import MessagingPanel from "./MessagingPanel";

interface StudentProfile {
  student: {
    id: string;
    name: string;
    admission_number: string;
    access_code: string;
    class_name: string;
    school_name: string;
  };
  results: {
    subject: string;
    scores: number[];
    average: number;
  }[];
  attendance: {
    summary: { present: number; absent: number; sick: number; suspended: number };
    percentage: number;
    total_days: number;
  };
  discipline: {
    id: string;
    category: string;
    description: string;
    incident_date: string;
    action_taken: string;
  }[];
  fee: {
    balance: number;
    cleared: boolean;
    payments: {
      amount: number;
      payment_date: string;
      receipt_number: string;
    }[];
  };
  class_teacher_remark: string;
  weaknesses: string[];
  badges?: {
    id: string;
    badge: { name: string; icon_url: string; description: string };
    awarded_by_name: string;
    term: string;
  }[];
  class_comparison: {
    subject_averages: Record<string, number>;
    class_overall_mean: number;
    student_overall_mean: number;
  };
}

export default function StudentProfileView({ studentId, term, teacherRole, teacherId, isParent }: { studentId: string; term: string; teacherRole?: string; teacherId?: string, isParent?: boolean }) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);

  // Editing state
  const [editingRemark, setEditingRemark] = useState(false);
  const [remarkText, setRemarkText] = useState("");
  const [savingRemark, setSavingRemark] = useState(false);
  const [editingFee, setEditingFee] = useState(false);
  const [newBalance, setNewBalance] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [savingFee, setSavingFee] = useState(false);

  // Badging state
  const [availableBadges, setAvailableBadges] = useState<any[]>([]);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [awardingBadge, setAwardingBadge] = useState(false);

  useEffect(() => {
    if (studentId) {
      fetchProfile();
    }
  }, [studentId, term]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/students/${studentId}/profile`, { params: { term } });
      setProfile(res.data);
      setRemarkText(res.data.class_teacher_remark || "");

      // Also fetch available badges for awarding
      const badgeRes = await api.get("/badges/");
      setAvailableBadges(badgeRes.data);
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAwardBadge = async (badgeId: string) => {
    if (!teacherId || !profile) return;
    setAwardingBadge(true);
    try {
      await api.post("/badges/award", {
        student_id: profile.student.id,
        badge_id: badgeId,
        awarded_by: teacherId,
        term: term
      });
      setShowAwardModal(false);
      fetchProfile();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to award badge");
    } finally {
      setAwardingBadge(false);
    }
  };

  const fetchAiSummary = async () => {
    setLoadingAI(true);
    try {
      const res = await api.get(`/students/${studentId}/ai-summary`, { params: { term } });
      setAiSummary(res.data.summary);
    } catch (err) {
      console.error("Failed to load AI summary", err);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSaveRemark = async () => {
    if (!teacherId || !profile) return;
    setSavingRemark(true);
    try {
      await api.put("/class-teacher/remark", {
        student_id: profile.student.id,
        remark: remarkText,
      }, {
        params: { teacher_id: teacherId, term },
      });
      setEditingRemark(false);
      fetchProfile();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to save remark");
    } finally {
      setSavingRemark(false);
    }
  };

  const handleUpdateFee = async () => {
    if (!teacherId || !profile) return;
    setSavingFee(true);
    try {
      if (newBalance) {
        await api.post("/fees/balance/add", {
          student_id: profile.student.id,
          term,
          balance: parseFloat(newBalance),
        });
      }
      if (paymentAmount) {
        await api.post("/fees/payment/record", {
          student_id: profile.student.id,
          amount: parseFloat(paymentAmount),
          term,
          recorded_by: teacherId,
        });
      }
      setEditingFee(false);
      setNewBalance("");
      setPaymentAmount("");
      fetchProfile();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to update fee");
    } finally {
      setSavingFee(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Loading student profile...</div>;
  if (!profile) return <div className="p-10 text-center text-red-500">Student not found.</div>;

  const radarData = profile.results.map(r => ({
    subject: r.subject,
    score: r.average,
    fullMark: 100,
  }));

  const comparisonData = useMemo(() => {
    const subjects = profile.results.map(r => r.subject);
    const data = subjects.map(s => ({
       name: s,
       "Your Child": profile.results.find(r => r.subject === s)?.average || 0,
       "Class Average": profile.class_comparison.subject_averages[s] || 0
    }));

    // Add Overall Mean
    data.push({
       name: "OVERALL MEAN",
       "Your Child": profile.class_comparison.student_overall_mean,
       "Class Average": profile.class_comparison.class_overall_mean
    });

    return data;
  }, [profile]);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest">Student Profile</span>
               {profile.fee.cleared && <span className="px-3 py-1 bg-emerald-400 text-emerald-900 rounded-full text-xs font-bold">FEES CLEARED</span>}
            </div>
            <h1 className="text-4xl font-black mb-1">{profile.student.name}</h1>
            <p className="text-indigo-100 font-medium">
              {profile.student.class_name} · {profile.student.school_name}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white/10 p-3 rounded-2xl">
                <p className="text-[10px] text-indigo-200 uppercase font-bold">Admission</p>
                <p className="font-mono font-bold">{profile.student.admission_number}</p>
             </div>
             <div className="bg-white/10 p-3 rounded-2xl">
                <p className="text-[10px] text-indigo-200 uppercase font-bold">Access Code</p>
                <p className="font-mono font-bold text-yellow-300">{profile.student.access_code}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Academics & AI */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Summary Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                ✨ AI Performance Insights
              </h2>
              {!aiSummary && !loadingAI && (
                <button
                  onClick={fetchAiSummary}
                  className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl font-bold hover:bg-indigo-100 transition"
                >
                  Generate Summary
                </button>
              )}
            </div>

            {loadingAI ? (
               <div className="flex items-center gap-3 py-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
                  <p className="text-sm text-gray-500 animate-pulse">Analyzing data and generating professional remarks...</p>
               </div>
            ) : aiSummary ? (
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed italic">
                "{aiSummary}"
              </div>
            ) : (
              <p className="text-sm text-gray-400">Click generate to get an AI-powered summary of the student's performance this term.</p>
            )}

            {profile.weaknesses.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase w-full mb-1">Focus Areas:</span>
                {profile.weaknesses.map(w => (
                  <span key={w} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black border border-red-100">
                    {w}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Performance Chart Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-bold text-gray-900">Peer Comparison Analysis</h2>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                     <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                     <span className="text-[10px] font-black text-gray-400 uppercase">Child</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <div className="h-2 w-2 rounded-full bg-gray-200"></div>
                     <span className="text-[10px] font-black text-gray-400 uppercase">Class Mean</span>
                  </div>
               </div>
            </div>

            <div className="h-96 w-full">
              {comparisonData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                       dataKey="name"
                       axisLine={false}
                       tickLine={false}
                       tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                       padding={{ left: 10, right: 10 }}
                    />
                    <YAxis
                       domain={[0, 100]}
                       axisLine={false}
                       tickLine={false}
                       tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                    />
                    <Tooltip
                       cursor={{ fill: '#f8fafc' }}
                       contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="Your Child" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={24} />
                    <Bar dataKey="Class Average" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                   <p className="text-sm font-bold uppercase tracking-widest">Awaiting Results...</p>
                   <p className="text-[10px] mt-1">Comparison data will appear once class results are approved.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Subject Proficiency</h2>

          {/* Achievement Badges Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Achievement Badges</h2>
                {(teacherRole === "headteacher" || teacherRole === "dean" || teacherRole === "teacher") && (
                   <button
                     onClick={() => setShowAwardModal(true)}
                     className="text-xs bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl font-bold hover:bg-amber-100 transition"
                   >
                     + Award Badge
                   </button>
                )}
             </div>

             {profile.badges && profile.badges.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                   {profile.badges.map(b => (
                      <div key={b.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center group hover:bg-amber-50 hover:border-amber-200 transition-all">
                         <div className="text-3xl mb-2 grayscale group-hover:grayscale-0 transition">
                            {b.badge.icon_url === 'star' ? '⭐' :
                             b.badge.icon_url === 'calendar' ? '📅' :
                             b.badge.icon_url === 'shield' ? '🛡️' :
                             b.badge.icon_url === 'trending-up' ? '📈' :
                             b.badge.icon_url === 'flask' ? '🧪' : '🏆'}
                         </div>
                         <p className="text-xs font-black text-gray-900 mb-1">{b.badge.name}</p>
                         <p className="text-[8px] text-gray-400 uppercase font-bold">{b.term}</p>
                         <div className="mt-2 opacity-0 group-hover:opacity-100 transition text-[9px] text-amber-700 font-medium leading-tight">
                            {b.badge.description}
                         </div>
                      </div>
                   ))}
                </div>
             ) : (
                <div className="py-10 text-center text-gray-400">
                   <p className="text-sm font-medium">No badges awarded yet.</p>
                </div>
             )}
          </div>

          {/* Messaging Panel at the bottom of the profile */}
          {teacherId && (
             <div className="mt-6">
                <MessagingPanel
                  studentId={studentId}
                  currentUserId={teacherId}
                  recipientId={studentId} // For simplicity, we use studentId as recipientId for parent channel
                  recipientName="Student's Parent"
                />
             </div>
          )}
        </div>

        {/* Right Column: Attendance, Fees, Discipline */}
        <div className="space-y-6">
          {/* Attendance Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Attendance</h2>
              <span className={`text-lg font-black ${profile.attendance.percentage > 90 ? 'text-emerald-500' : 'text-amber-500'}`}>
                {profile.attendance.percentage}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-gray-50 p-3 rounded-2xl text-center">
                  <p className="text-xs text-gray-400 font-bold uppercase">Present</p>
                  <p className="text-xl font-black text-emerald-600">{profile.attendance.summary.present}</p>
               </div>
               <div className="bg-gray-50 p-3 rounded-2xl text-center">
                  <p className="text-xs text-gray-400 font-bold uppercase">Absent</p>
                  <p className="text-xl font-black text-rose-500">{profile.attendance.summary.absent}</p>
               </div>
            </div>
          </div>

          {/* Fees Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4">Financial Status</h2>
            <div className="p-4 bg-gray-50 rounded-2xl mb-4">
               <p className="text-xs text-gray-400 font-bold uppercase mb-1">Outstanding Balance</p>
               <p className={`text-2xl font-black ${profile.fee.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  KES {profile.fee.balance.toLocaleString()}
               </p>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
               <p className="text-[10px] text-gray-400 font-bold uppercase">Recent Payments</p>
               {profile.fee.payments.length > 0 ? profile.fee.payments.map((p, i) => (
                 <div key={i} className="flex justify-between items-center text-xs p-2 hover:bg-gray-50 rounded-lg transition">
                    <span className="text-gray-500 font-medium">{p.payment_date}</span>
                    <span className="font-bold text-gray-700">KES {p.amount.toLocaleString()}</span>
                 </div>
               )) : <p className="text-xs text-gray-400 italic">No payments recorded this term.</p>}
            </div>
          </div>

          {/* Discipline Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
             <h2 className="font-bold text-gray-800 mb-4">Conduct & Discipline</h2>
             {profile.discipline.length > 0 ? (
               <div className="space-y-4">
                 {profile.discipline.slice(0, 2).map(d => (
                   <div key={d.id} className="border-l-4 border-amber-400 pl-3">
                      <p className="text-xs font-bold text-gray-800">{d.category}</p>
                      <p className="text-[10px] text-gray-500">{d.incident_date}</p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{d.description}</p>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-2xl">
                  <span className="text-xl">✅</span>
                  <span className="text-xs font-bold">Exemplary Conduct</span>
               </div>
             )}
          </div>

          {/* Teacher Actions (Only if canEdit) */}
          {(teacherRole === "headteacher" || teacherRole === "dean") && (
            <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100">
               <h2 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  🛠 Administrative Controls
               </h2>
               <div className="space-y-3">
                  <button
                    onClick={() => setEditingFee(true)}
                    className="w-full py-2 bg-white text-indigo-600 rounded-xl text-xs font-bold shadow-sm hover:bg-indigo-600 hover:text-white transition"
                  >
                    Adjust Fees / Record Payment
                  </button>
                  <button
                    onClick={() => setEditingRemark(true)}
                    className="w-full py-2 bg-white text-indigo-600 rounded-xl text-xs font-bold shadow-sm hover:bg-indigo-600 hover:text-white transition"
                  >
                    {profile.class_teacher_remark ? "Update Remark" : "Add Teacher Remark"}
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals for editing */}
      {editingFee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Financial Adjustment</h3>
            <div className="space-y-4">
               <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Set New Balance (Optional)</label>
                  <input type="number" value={newBalance} onChange={e => setNewBalance(e.target.value)} className="w-full border rounded-xl p-3 text-sm" placeholder="e.g. 15000" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Record Payment (Optional)</label>
                  <input type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} className="w-full border rounded-xl p-3 text-sm" placeholder="e.g. 5000" />
               </div>
               <div className="flex gap-2 pt-4">
                  <button onClick={handleUpdateFee} disabled={savingFee} className="flex-1 bg-indigo-600 text-white py-3 rounded-2xl font-bold text-sm disabled:opacity-50">
                    {savingFee ? "Saving..." : "Apply Changes"}
                  </button>
                  <button onClick={() => setEditingFee(false)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-2xl font-bold text-sm">Cancel</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {editingRemark && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Class Teacher Remark</h3>
            <textarea
              value={remarkText}
              onChange={e => setRemarkText(e.target.value)}
              className="w-full border rounded-2xl p-4 text-sm"
              rows={5}
              placeholder="Enter your professional remarks about the student's overall performance and conduct..."
            />
            <div className="flex gap-2 pt-4">
               <button onClick={handleSaveRemark} disabled={savingRemark} className="flex-1 bg-indigo-600 text-white py-3 rounded-2xl font-bold text-sm disabled:opacity-50">
                  {savingRemark ? "Saving..." : "Save Remark"}
               </button>
               <button onClick={() => setEditingRemark(false)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-2xl font-bold text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showAwardModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl">
             <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">Recognition Hub</h3>
             <div className="grid grid-cols-2 gap-4">
                {availableBadges.map(b => (
                   <button
                     key={b.id}
                     onClick={() => handleAwardBadge(b.id)}
                     disabled={awardingBadge}
                     className="bg-gray-50 p-4 rounded-3xl border border-gray-100 flex flex-col items-center text-center hover:bg-amber-50 hover:border-amber-200 transition-all group disabled:opacity-50"
                   >
                      <div className="text-3xl mb-2 group-hover:scale-110 transition">
                         {b.icon_url === 'star' ? '⭐' :
                          b.icon_url === 'calendar' ? '📅' :
                          b.icon_url === 'shield' ? '🛡️' :
                          b.icon_url === 'trending-up' ? '📈' :
                          b.icon_url === 'flask' ? '🧪' : '🏆'}
                      </div>
                      <p className="text-xs font-black text-gray-800">{b.name}</p>
                   </button>
                ))}
             </div>
             <button
               onClick={() => setShowAwardModal(false)}
               className="w-full mt-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition"
             >
                Cancel
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
