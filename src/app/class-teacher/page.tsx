"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import StudentSearch from "@/components/StudentSearch";
import NotificationBell from "@/components/NotificationBell";

interface StudentResult {
  student_id: string;
  student_name: string;
  admission_number: string;
  subjects: Record<string, number>;
  overall_mean: number;
  class_teacher_remark?: string;
}

interface DashboardData {
  class_id: string;
  class_name: string;
  term: string;
  student_results: StudentResult[];
  attendance_summary: {
    present: number;
    absent: number;
    sick: number;
    suspended: number;
  };
  discipline_summary: {
    Minor: number;
    Major: number;
    Positive: number;
  };
  top_students: { name: string; mean: number }[];
  at_risk_students: { name: string; mean: number }[];
}

export default function ClassTeacherDashboard() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [term, setTerm] = useState("Term 1 2025");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Modal states
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Remark editing
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [remarkText, setRemarkText] = useState("");
  const [savingRemark, setSavingRemark] = useState(false);

  // Attendance marking
  const [attDate, setAttDate] = useState(new Date().toISOString().split("T")[0]);
  const [attStatuses, setAttStatuses] = useState<Record<string, string>>({});
  const [savingAtt, setSavingAtt] = useState(false);
  const [attMessage, setAttMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (!stored) {
      router.push("/login");
      return;
    }
    const t = JSON.parse(stored);
    setTeacher(t);
    fetchDashboard(t.teacher_id, term);
  }, [router]);

  if (!teacher) return null;

  const fetchDashboard = async (teacherId: string, t: string) => {
    setLoading(true);
    try {
      const res = await api.get("/class-teacher/dashboard", {
        params: { teacher_id: teacherId, term: t },
      });
      setData(res.data);
      const initialStatuses: Record<string, string> = {};
      res.data.student_results.forEach((s: StudentResult) => {
        initialStatuses[s.student_id] = "Present";
      });
      setAttStatuses(initialStatuses);
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRemark = async (studentId: string) => {
    setSavingRemark(true);
    try {
      await api.put("/class-teacher/remark", {
        student_id: studentId,
        remark: remarkText,
      }, {
        params: {
          teacher_id: teacher.teacher_id,
          term: term,
        },
      });
      setEditingStudent(null);
      setRemarkText("");
      fetchDashboard(teacher.teacher_id, term);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Error saving remark");
    } finally {
      setSavingRemark(false);
    }
  };

  const handleMarkAttendance = async () => {
    if (!data) return;
    setSavingAtt(true);
    setAttMessage("");
    const records = data.student_results.map((s) => ({
      student_id: s.student_id,
      date: attDate,
      status: attStatuses[s.student_id] || "Present",
    }));
    try {
      await api.post("/attendance/record", {
        class_id: data.class_id,
        recorded_by: teacher.teacher_id,
        records: records,
      });
      setAttMessage("Attendance saved successfully!");
      setTimeout(() => setActiveModal(null), 1500);
      fetchDashboard(teacher.teacher_id, term);
    } catch (err: any) {
      setAttMessage(err.response?.data?.detail || "Failed to save attendance");
    } finally {
      setSavingAtt(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#f8f9fc] text-gray-800">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
          <div className="flex items-center gap-4">
             <div className="h-14 w-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-200">
                🏫
             </div>
             <div>
                <h1 className="text-2xl font-black text-gray-900 leading-tight">Class Teacher Command</h1>
                <p className="text-gray-500 font-medium">Managing {data?.class_name || "your class"} · {teacher.school_name}</p>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <StudentSearch />
             <NotificationBell schoolId={teacher.school_id} teacherId={teacher.teacher_id} />
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 flex gap-2">
                <div className="px-4 py-1.5">
                   <p className="text-[10px] font-bold text-gray-400 uppercase">Current Term</p>
                   <input
                      type="text"
                      value={term}
                      onChange={e => setTerm(e.target.value)}
                      onBlur={() => fetchDashboard(teacher.teacher_id, term)}
                      className="text-sm font-bold text-gray-800 border-none p-0 focus:ring-0 w-28"
                   />
                </div>
             </div>
             <button onClick={() => router.back()} className="p-3 bg-white text-gray-400 rounded-2xl shadow-sm hover:text-blue-600 border border-transparent hover:border-blue-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
             </button>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
             <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
             <p className="text-gray-500 font-medium">Synchronizing class data...</p>
          </div>
        ) : message ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-3xl text-center border border-red-100 shadow-sm max-w-lg mx-auto">
             <p className="font-bold mb-2">Access Denied or Error</p>
             <p className="text-sm">{message}</p>
          </div>
        ) : data ? (
          <div className="space-y-8">
            {/* Top Stats Deck */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Class Mean</p>
                <div className="flex items-end gap-2">
                   <p className="text-3xl font-black text-blue-600">
                      {data.student_results.length > 0
                        ? (data.student_results.reduce((sum, s) => sum + s.overall_mean, 0) / data.student_results.length).toFixed(1)
                        : "—"}
                   </p>
                   <span className="text-xs text-green-500 font-bold mb-1.5">%</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Top Performer</p>
                <p className="text-lg font-bold text-gray-900 truncate">
                  {data.top_students[0]?.name || "—"}
                </p>
                <p className="text-xs font-bold text-emerald-500 uppercase">{data.top_students[0]?.mean || 0}% Average</p>
              </div>

              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Support Needed</p>
                <p className="text-3xl font-black text-rose-500">{data.at_risk_students.length}</p>
                <p className="text-xs text-gray-400 font-medium">Students below 50%</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-[2rem] shadow-lg text-white">
                <p className="text-xs font-bold text-indigo-100 uppercase tracking-widest mb-1">Class Capacity</p>
                <p className="text-3xl font-black">{data.student_results.length}</p>
                <p className="text-xs text-indigo-100/70 font-medium">Students enrolled</p>
              </div>
            </div>

            {/* Middle Deck: Actions and Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Overviews */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div
                    onClick={() => setActiveModal('attendance')}
                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:border-blue-400 cursor-pointer group transition-all"
                 >
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="font-bold text-gray-900">Attendance Hub</h3>
                       <span className="h-8 w-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-sm group-hover:scale-110 transition">📅</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                       <div className="bg-gray-50 p-4 rounded-2xl">
                          <p className="text-2xl font-black text-emerald-600">{data.attendance_summary.present}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Present</p>
                       </div>
                       <div className="bg-gray-50 p-4 rounded-2xl">
                          <p className="text-2xl font-black text-rose-500">{data.attendance_summary.absent}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Absent</p>
                       </div>
                    </div>
                 </div>

                 <div
                    onClick={() => setActiveModal('discipline')}
                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:border-amber-400 cursor-pointer group transition-all"
                 >
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="font-bold text-gray-900">Conduct Overview</h3>
                       <span className="h-8 w-8 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-sm group-hover:scale-110 transition">⚖️</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                       <div className="bg-gray-50 p-3 rounded-2xl">
                          <p className="text-xl font-black text-rose-500">{data.discipline_summary.Major}</p>
                          <p className="text-[8px] font-bold text-gray-400 uppercase">Major</p>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-2xl">
                          <p className="text-xl font-black text-amber-500">{data.discipline_summary.Minor}</p>
                          <p className="text-[8px] font-bold text-gray-400 uppercase">Minor</p>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-2xl text-emerald-600 border border-emerald-50">
                          <p className="text-xl font-black">{data.discipline_summary.Positive}</p>
                          <p className="text-[8px] font-bold text-emerald-400 uppercase">Positive</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Action Sidebar */}
              <div className="space-y-4">
                 <button
                    onClick={() => setActiveModal('mark-attendance')}
                    className="w-full bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:bg-indigo-600 hover:text-white group transition-all flex items-center justify-between"
                 >
                    <div className="text-left">
                       <h3 className="font-bold group-hover:text-white">Mark Attendance</h3>
                       <p className="text-xs text-gray-400 group-hover:text-indigo-100">Today's daily register</p>
                    </div>
                    <span className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition">🖊️</span>
                 </button>

                 <button
                    onClick={() => router.push('/import-results')}
                    className="w-full bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:bg-emerald-600 hover:text-white group transition-all flex items-center justify-between"
                 >
                    <div className="text-left">
                       <h3 className="font-bold group-hover:text-white">Batch Results</h3>
                       <p className="text-xs text-gray-400 group-hover:text-emerald-100">Upload bulk scores</p>
                    </div>
                    <span className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition">📊</span>
                 </button>
              </div>
            </div>

            {/* Student Intelligence Table */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                     <h3 className="text-xl font-black text-gray-900">Student Intelligence Deck</h3>
                     <p className="text-sm text-gray-400">Termly progress and pastoral remarks</p>
                  </div>
                  <div className="bg-gray-50 px-4 py-2 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-100">
                     Active Filter: All Students
                  </div>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                   <thead>
                     <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                       <th className="p-6 text-left">Student Identity</th>
                       <th className="p-6 text-center">Mean (%)</th>
                       <th className="p-6 text-left">Pastoral Remark</th>
                       <th className="p-6 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                     {data.student_results.map((s) => (
                       <tr key={s.student_id} className="hover:bg-blue-50/20 transition-colors">
                         <td className="p-6">
                           <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-gray-400">
                                 {s.student_name.charAt(0)}
                              </div>
                              <div>
                                 <button
                                    onClick={() => router.push(`/students/${s.student_id}`)}
                                    className="font-bold text-gray-900 hover:text-blue-600 transition text-left"
                                 >
                                    {s.student_name}
                                 </button>
                                 <p className="text-[10px] text-gray-400 font-mono">{s.admission_number}</p>
                              </div>
                           </div>
                         </td>
                         <td className="p-6 text-center">
                           <div className={`inline-flex items-center justify-center h-10 w-14 rounded-xl font-black ${s.overall_mean >= 50 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                             {s.overall_mean}%
                           </div>
                         </td>
                         <td className="p-6">
                            {s.class_teacher_remark ? (
                               <p className="text-xs text-gray-600 line-clamp-2 italic">"{s.class_teacher_remark}"</p>
                            ) : (
                               <p className="text-xs text-gray-300 italic">No pastoral remark yet...</p>
                            )}
                         </td>
                         <td className="p-6 text-right">
                            <button
                               onClick={() => {
                                 setEditingStudent(s.student_id);
                                 setRemarkText(s.class_teacher_remark || "");
                               }}
                               className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition"
                            >
                               {s.class_teacher_remark ? "Edit Remark" : "+ Remark"}
                            </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Modals Deck */}
      {activeModal === 'attendance' && (
        <DetailModal
          title="Attendance Insights"
          onClose={() => setActiveModal(null)}
          data={Object.entries(data?.attendance_summary || {})}
        />
      )}
      {activeModal === 'discipline' && (
        <DetailModal
          title="Conduct Insights"
          onClose={() => setActiveModal(null)}
          data={Object.entries(data?.discipline_summary || {})}
        />
      )}

      {activeModal === 'mark-attendance' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                 <div>
                    <h2 className="text-2xl font-black text-gray-900">Register Marking</h2>
                    <p className="text-sm text-gray-400">Class: {data?.class_name}</p>
                 </div>
                 <button onClick={() => setActiveModal(null)} className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">✕</button>
              </div>

              <div className="p-8 space-y-6 flex-1 overflow-y-auto">
                 <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                    <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Register Date</label>
                    <input
                      type="date"
                      value={attDate}
                      onChange={(e) => setAttDate(e.target.value)}
                      className="w-full bg-white border-none rounded-2xl p-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-500"
                    />
                 </div>

                 <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Student Roster</p>
                    {data?.student_results.map((s) => (
                      <div key={s.student_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <span className="text-sm font-bold text-gray-700 truncate w-40">{s.student_name}</span>
                        <select
                          value={attStatuses[s.student_id] || "Present"}
                          onChange={(e) =>
                            setAttStatuses({ ...attStatuses, [s.student_id]: e.target.value })
                          }
                          className="bg-white border-none rounded-xl text-[10px] font-black uppercase text-blue-600 shadow-sm focus:ring-0"
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Sick">Sick</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="p-8 bg-gray-50 flex flex-col gap-4">
                 <button
                    onClick={handleMarkAttendance}
                    disabled={savingAtt}
                    className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition"
                 >
                    {savingAtt ? "Saving Register..." : "Submit Attendance"}
                 </button>
                 {attMessage && (
                   <p className={`text-center text-[10px] font-bold uppercase ${attMessage.includes("failed") ? "text-red-500" : "text-emerald-500"}`}>
                     {attMessage}
                   </p>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Remark Editor Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full p-10">
            <div className="mb-8">
               <h3 className="text-2xl font-black text-gray-900 mb-2">Pastoral Remark</h3>
               <p className="text-sm text-gray-400">Adding class teacher feedback for term processing.</p>
            </div>

            <textarea
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-blue-600 transition"
              rows={6}
              placeholder="Provide a comprehensive feedback on student performance and conduct..."
            />

            <div className="flex gap-4 mt-8">
               <button
                  onClick={() => handleSaveRemark(editingStudent)}
                  disabled={savingRemark}
                  className="flex-1 py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition"
               >
                  {savingRemark ? "Saving..." : "Save Remark"}
               </button>
               <button
                  onClick={() => setEditingStudent(null)}
                  className="flex-1 py-5 bg-gray-100 text-gray-600 rounded-[2rem] font-black hover:bg-gray-200 transition"
               >
                  Cancel
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailModal({ title, onClose, data }: { title: string, onClose: () => void, data: [string, any][] }) {
   return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
         <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full p-10">
            <h2 className="text-2xl font-black text-gray-900 mb-8">{title}</h2>
            <div className="space-y-4">
               {data.map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl">
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{key}</span>
                     <span className="text-xl font-black text-gray-900">{val}</span>
                  </div>
               ))}
            </div>
            <button
               onClick={onClose}
               className="w-full mt-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black hover:bg-black transition"
            >
               Dismiss
            </button>
         </div>
      </div>
   );
}
