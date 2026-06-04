"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import StudentSearch from "@/components/StudentSearch";
import NotificationBell from "@/components/NotificationBell";
import TimetableGeneratorModal from "@/components/TimetableGeneratorModal";

interface DeanDashboardData {
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

export default function DeanDashboardPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [data, setData] = useState<DeanDashboardData | null>(null);
  const [term, setTerm] = useState("Term 1 2025");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Export dropdown
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (!stored) {
      router.push("/login");
      return;
    }
    const t = JSON.parse(stored);
    setTeacher(t);
    if (t.role !== "dean" && t.role !== "headteacher") {
      router.push("/dashboard");
      return;
    }
    fetchDashboard(t.school_id, term);
  }, []);
  const [showTimetableModal, setShowTimetableModal] = useState(false);
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
      url = `${base}/students/${teacher.school_id}?format=${format}`;
    } else if (type === "results") {
      url = `${base}/results/${teacher.school_id}?term=${encodeURIComponent(term)}&format=${format}`;
    } else if (type === "fees") {
      url = `${base}/fees/${teacher.school_id}?term=${encodeURIComponent(term)}&format=${format}`;
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
            <button onClick={() => router.back()} className="text-gray-500 text-sm">
              ← Back
            </button>
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
              <div className="bg-white rounded-xl shadow-sm p-4">
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
              <div className="bg-white rounded-xl shadow-sm p-4">
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

            {/* Risk Students by Class */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="font-semibold text-gray-800 mb-3">Academic Risk by Class</h2>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-red-600">{data.risk_student_count}</span>
                <span className="text-sm text-gray-500">students at risk</span>
              </div>
              {Object.keys(data.risk_by_class).length === 0 ? (
                <p className="text-sm text-gray-400">No risk data available.</p>
              ) : (
                <ul className="space-y-2">
                  {Object.entries(data.risk_by_class).map(([className, count]) => (
                    <li key={className} className="flex justify-between text-sm">
                      <span>{className}</span>
                      <span className="text-red-600 font-medium">{count} students</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}