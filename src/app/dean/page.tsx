"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import StudentSearch from "@/components/StudentSearch";
import NotificationBell from "@/components/NotificationBell";
import TimetableGeneratorModal from "@/components/TimetableGeneratorModal";
import BackButton from "@/components/BackButton";

interface AttendanceDetail {
  student_id: string;
  student_name: string;
  admission_number: string;
  class_name: string;
  status: string;
  date: string;
}

interface DisciplineDetail {
  student_name: string;
  admission_number: string;
  class_name: string;
  category: string;
  description: string;
  incident_date: string;
  action_taken: string;
}

interface DeanDashboardData {
  attendance_summary: {
    present: number;
    absent: number;
    sick: number;
    suspended: number;
  };
  attendance_details: Record<string, AttendanceDetail[]>;
  discipline_summary: {
    Minor: number;
    Major: number;
    Positive: number;
  };
  discipline_details: Record<string, DisciplineDetail[]>;
  attendance_concerns: {
    class_name: string;
    attendance_pct: number;
  }[];
  most_disciplined_classes: {
    class_name: string;
    positive_count: number;
  }[];
  risk_student_count: number;
  risk_by_class: Record<string, number>;
}

function ClassRiskCard({ className, count, router }: { className: string; count: number; router: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
     <div className="flex flex-col gap-3">
        <div
           onClick={() => setIsExpanded(!isExpanded)}
           className="bg-gray-900 p-6 rounded-[2rem] shadow-xl text-white hover:bg-gray-800 transition-all cursor-pointer group"
        >
           <div className="flex items-center justify-between mb-4">
              <div>
                 <h4 className="text-lg font-black">{className}</h4>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Urgent Scan</p>
              </div>
              <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">⚠️</div>
           </div>
           <div className="flex items-center justify-between">
             <span className="text-xs font-bold text-red-400">
                {count} Students At Risk
             </span>
             <span className="text-[10px] font-black uppercase text-gray-500 group-hover:text-white transition-colors flex items-center gap-1">
                {isExpanded ? "Hide" : "Details"}
                <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor" className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                   <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
             </span>
           </div>
        </div>

        {isExpanded && (
           <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
              <p className="text-xs text-gray-500 font-medium">Use the "Student List" module to view individual profiles for {className}.</p>
              <button
                 onClick={() => router.push("/students")}
                 className="mt-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
              >
                 Open Registry →
              </button>
           </div>
        )}
     </div>
  );
}

import { useAuthStore } from "@/lib/store";

export default function DeanDashboardPage() {
  const router = useRouter();
  const { user: teacher } = useAuthStore();
  const [data, setData] = useState<DeanDashboardData | null>(null);
  const [term, setTerm] = useState("Term 1 2025");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Modal for details
  const [detailModal, setDetailModal] = useState<{ title: string; type: 'attendance' | 'discipline', data: any[] } | null>(null);

  // Export dropdown
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showTimetableModal, setShowTimetableModal] = useState(false);

  useEffect(() => {
    if (!teacher) {
      router.push("/login");
      return;
    }
    if (teacher.role !== "dean" && teacher.role !== "headteacher") {
      router.push("/dashboard");
      return;
    }
    fetchDashboard(teacher.school_id, term);
  }, [teacher, router, term]);

  const fetchDashboard = async (schoolId: string, t: string) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await api.get("/dean/dashboard", {
        params: { school_id: schoolId, term: t },
      });
      setData(res.data);
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (teacher) fetchDashboard(teacher.school_id, term);
  };

  const handleExport = (type: string, format: string) => {
    const base = `${process.env.NEXT_PUBLIC_API_URL}/exports`;
    let url = "";
    if (type === "students") {
      url = `${base}/students/${teacher?.school_id}?format=${format}`;
    } else if (type === "results") {
      url = `${base}/results/${teacher?.school_id}?term=${encodeURIComponent(term)}&format=${format}`;
    } else if (type === "fees") {
      url = `${base}/fees/${teacher?.school_id}?term=${encodeURIComponent(term)}&format=${format}`;
    }
    if (url) window.open(url, "_blank");
    setShowExportMenu(false);
  };

  if (!teacher) return null;


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Dean of Students Dashboard</h1>
            <p className="text-sm text-gray-500">{teacher.school_name}</p>
          </div>
          <div className="flex items-center gap-4">
            <StudentSearch />
            <NotificationBell schoolId={teacher.school_id} teacherId={teacher.teacher_id} />
          <button
            onClick={() => router.push("/analytics/leaderboard")}
            className="px-3 py-1.5 text-sm font-black bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-600 hover:text-white transition"
          >
            🏆 Leaderboard
          </button>
            {/* Export button */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                📥 Export
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  <div className="p-2 space-y-1 text-sm">
                    <p className="text-xs text-gray-400 mb-1">Students</p>
                    <button onClick={() => handleExport("students", "csv")} className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">CSV</button>
                    <button onClick={() => handleExport("students", "xlsx")} className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">Excel</button>
                    <hr className="my-1" />
                    <p className="text-xs text-gray-400 mb-1">Results</p>
                    <button onClick={() => handleExport("results", "csv")} className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">CSV</button>
                    <button onClick={() => handleExport("results", "xlsx")} className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">Excel</button>
                    <hr className="my-1" />
                    <p className="text-xs text-gray-400 mb-1">Fees</p>
                    <button onClick={() => handleExport("fees", "csv")} className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">CSV</button>
                    <button onClick={() => handleExport("fees", "xlsx")} className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">Excel</button>
                  </div>
                </div>
              )}
            </div>
            <BackButton />
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => router.push("/assign")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
          >
            Assign Teachers
          </button>
          {teacher.is_premium && (
  <button
    onClick={() => setShowTimetableModal(true)}
    className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium"
  >
    🗓️ Auto‑Generate Timetable
  </button>
)}
{showTimetableModal && (
  <TimetableGeneratorModal
    schoolId={teacher.school_id}
    onClose={() => setShowTimetableModal(false)}
  />
)}
<button
  onClick={() => router.push("/admissions")}
  className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium"
>
  Admissions
</button>
          <button
            onClick={() => router.push("/students")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium"
          >
            Student List
          </button>
          <button
            onClick={() => router.push("/import-results")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium"
          >
            Import Results
          </button>
          
          <button
            onClick={() => router.push("/discipline")}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium"
          >
            Discipline Records
          </button>
        </div>

        {/* Term filter */}
        <form onSubmit={handleFilter} className="bg-white p-3 rounded-xl shadow-sm mb-4 flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1">Term</label>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
            />
          </div>
          <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium">
            Apply
          </button>
        </form>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading dashboard…</div>
        ) : message ? (
          <div className="text-center text-red-500 py-10">{message}</div>
        ) : data ? (
          <div className="space-y-4">
            {/* School-wide Attendance & Discipline */}
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setDetailModal({ title: "Attendance Details", type: 'attendance', data: Object.values(data.attendance_details).flat() })}
                className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:border-blue-300 border border-transparent transition"
              >
                <h2 className="font-semibold text-gray-800 mb-3">Attendance Overview</h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-green-600 font-bold">{data.attendance_summary.present}</span>
                    <span className="text-gray-500 ml-1">Present</span>
                  </div>
                  <div>
                    <span className="text-red-600 font-bold">{data.attendance_summary.absent}</span>
                    <span className="text-gray-500 ml-1">Absent</span>
                  </div>
                  <div>
                    <span className="text-yellow-600 font-bold">{data.attendance_summary.sick}</span>
                    <span className="text-gray-500 ml-1">Sick</span>
                  </div>
                  <div>
                    <span className="text-orange-600 font-bold">{data.attendance_summary.suspended}</span>
                    <span className="text-gray-500 ml-1">Suspended</span>
                  </div>
                </div>
              </div>
              <div
                onClick={() => setDetailModal({ title: "Discipline Details", type: 'discipline', data: Object.values(data.discipline_details).flat() })}
                className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:border-blue-300 border border-transparent transition"
              >
                <h2 className="font-semibold text-gray-800 mb-3">Discipline Overview</h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-red-600 font-bold">{data.discipline_summary.Major}</span>
                    <span className="text-gray-500 ml-1">Major</span>
                  </div>
                  <div>
                    <span className="text-yellow-600 font-bold">{data.discipline_summary.Minor}</span>
                    <span className="text-gray-500 ml-1">Minor</span>
                  </div>
                  <div>
                    <span className="text-green-600 font-bold">{data.discipline_summary.Positive}</span>
                    <span className="text-gray-500 ml-1">Positive</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Drill-down Modal */}
            {detailModal && (
              <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                  <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="font-bold text-lg">{detailModal.title}</h2>
                    <button onClick={() => setDetailModal(null)} className="text-gray-500 hover:text-black">✕</button>
                  </div>
                  <div className="p-4 overflow-y-auto">
                    {detailModal.data.length === 0 ? (
                      <p className="text-center text-gray-500 py-10">No records found.</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                          {detailModal.type === 'attendance' ? (
                            <tr>
                              <th className="p-2 text-left">Student</th>
                              <th className="p-2 text-left">Class</th>
                              <th className="p-2 text-left">Date</th>
                              <th className="p-2 text-left">Status</th>
                            </tr>
                          ) : (
                            <tr>
                              <th className="p-2 text-left">Student</th>
                              <th className="p-2 text-left">Class</th>
                              <th className="p-2 text-left">Date</th>
                              <th className="p-2 text-left">Description</th>
                            </tr>
                          )}
                        </thead>
                        <tbody className="divide-y">
                          {detailModal.data.map((item, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              {detailModal.type === 'attendance' ? (
                                <>
                                  <td className="p-2">
                                    <p className="font-medium">{item.student_name}</p>
                                    <p className="text-[10px] text-gray-400">{item.admission_number}</p>
                                  </td>
                                  <td className="p-2">{item.class_name}</td>
                                  <td className="p-2 text-xs">{item.date}</td>
                                  <td className="p-2">
                                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                       item.status?.toLowerCase() === 'present' ? 'bg-green-100 text-green-700' :
                                       item.status?.toLowerCase() === 'absent' ? 'bg-red-100 text-red-700' :
                                       item.status?.toLowerCase() === 'sick' ? 'bg-yellow-100 text-yellow-700' :
                                       'bg-orange-100 text-orange-700'
                                     }`}>
                                       {item.status}
                                     </span>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="p-2">
                                    <p className="font-medium">{item.student_name}</p>
                                    <p className="text-[10px] text-gray-400">{item.admission_number}</p>
                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                                      item.category === 'Major' ? 'bg-red-100 text-red-700' :
                                      item.category === 'Minor' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-green-100 text-green-700'
                                    }`}>
                                      {item.category}
                                    </span>
                                  </td>
                                  <td className="p-2">{item.class_name}</td>
                                  <td className="p-2 text-xs">{item.incident_date}</td>
                                  <td className="p-2 text-xs">
                                     <p className="font-medium text-gray-700">{item.description}</p>
                                     {item.action_taken && <p className="text-gray-400 mt-1 italic">Action: {item.action_taken}</p>}
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Attendance Concerns */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="font-semibold text-gray-800 mb-3">Attendance Concerns (&lt;75%)</h2>
              {data.attendance_concerns.length === 0 ? (
                <p className="text-sm text-green-600">All classes have good attendance.</p>
              ) : (
                <ul className="space-y-2">
                  {data.attendance_concerns.map((c, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span>{c.class_name}</span>
                      <span className="text-red-600 font-medium">{c.attendance_pct}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Most Disciplined Classes */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="font-semibold text-gray-800 mb-3">Most Disciplined Classes</h2>
              {data.most_disciplined_classes.length === 0 ? (
                <p className="text-sm text-gray-400">No positive discipline records yet.</p>
              ) : (
                <ul className="space-y-2">
                  {data.most_disciplined_classes.map((c, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span>{c.class_name}</span>
                      <span className="text-green-600 font-medium">{c.positive_count} positive</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Academic Risk Cards */}
            <div className="bg-white rounded-[2rem] shadow-sm p-8 border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                 <span className="p-2 bg-red-50 text-red-600 rounded-xl">🚨</span>
                 Academic Risk by Class
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {Object.entries(data.risk_by_class).map(([className, count]) => (
                    <ClassRiskCard key={className} className={className} count={count} router={router} />
                 ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}