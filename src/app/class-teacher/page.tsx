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

  const fetchDashboard = async (teacherId: string, t: string) => {
    setLoading(true);
    try {
      const res = await api.get("/class-teacher/dashboard", {
        params: { teacher_id: teacherId, term: t },
      });
      setData(res.data);
      // Initialize attendance statuses for all students to "Present"
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
    } catch (err: any) {
      setAttMessage(err.response?.data?.detail || "Failed to save attendance");
    } finally {
      setSavingAtt(false);
    }
  };

  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Class Teacher Dashboard</h1>
            {data && <p className="text-sm text-gray-500">{data.class_name}</p>}
          </div>
          <div className="flex items-center gap-4">
            <StudentSearch />
            <NotificationBell schoolId={teacher.school_id} teacherId={teacher.teacher_id} />
            <button onClick={() => router.back()} className="text-gray-500 text-sm">← Back</button>
          </div>
        </div>

        {/* Term filter */}
        <div className="bg-white p-3 rounded-xl shadow-sm mb-4 flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1">Term</label>
            <input
              type="text"
              value={term}
              onChange={(e) => {
                setTerm(e.target.value);
                fetchDashboard(teacher.teacher_id, e.target.value);
              }}
              className="w-full border rounded-lg p-2 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading…</div>
        ) : message ? (
          <div className="text-center text-red-500 py-10">{message}</div>
        ) : data ? (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <p className="text-xs text-gray-500">Class Mean</p>
                <p className="text-xl font-bold text-blue-600">
                  {data.student_results.length > 0
                    ? (data.student_results.reduce((sum, s) => sum + s.overall_mean, 0) / data.student_results.length).toFixed(1)
                    : "—"}
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <p className="text-xs text-gray-500">Top Student</p>
                <p className="text-lg font-semibold text-green-600">
                  {data.top_students[0]?.name || "—"}
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <p className="text-xs text-gray-500">At Risk</p>
                <p className="text-xl font-bold text-red-600">{data.at_risk_students.length}</p>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <p className="text-xs text-gray-500">Attendance</p>
                <p className="text-xl font-bold text-green-600">
                  {data.attendance_summary.present}
                  <span className="text-xs text-gray-400 ml-1">present</span>
                </p>
              </div>
            </div>

            {/* Attendance & Discipline */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl shadow-sm p-3">
                <h3 className="font-semibold text-sm mb-2">Attendance</h3>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span className="text-green-600">Present: {data.attendance_summary.present}</span>
                  <span className="text-red-600">Absent: {data.attendance_summary.absent}</span>
                  <span className="text-yellow-600">Sick: {data.attendance_summary.sick}</span>
                  <span className="text-orange-600">Suspended: {data.attendance_summary.suspended}</span>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-3">
                <h3 className="font-semibold text-sm mb-2">Discipline</h3>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span className="text-red-600">Major: {data.discipline_summary.Major}</span>
                  <span className="text-yellow-600">Minor: {data.discipline_summary.Minor}</span>
                  <span className="text-green-600">Positive: {data.discipline_summary.Positive}</span>
                </div>
              </div>
            </div>

            {/* Top & At-Risk Students */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl shadow-sm p-3">
                <h3 className="font-semibold text-sm mb-2">Top Students</h3>
                {data.top_students.length === 0 ? (
                  <p className="text-xs text-gray-400">No data</p>
                ) : (
                  <ul className="space-y-1">
                    {data.top_students.map((s, i) => (
                      <li key={i} className="flex justify-between text-sm">
                        <span>{s.name}</span>
                        <span className="font-medium text-green-600">{s.mean}%</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="bg-white rounded-xl shadow-sm p-3">
                <h3 className="font-semibold text-sm mb-2">At Risk</h3>
                {data.at_risk_students.length === 0 ? (
                  <p className="text-xs text-green-600">None</p>
                ) : (
                  <ul className="space-y-1">
                    {data.at_risk_students.map((s, i) => (
                      <li key={i} className="flex justify-between text-sm">
                        <span>{s.name}</span>
                        <span className="font-medium text-red-600">{s.mean}%</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Student Results Table with Remarks */}
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
              <div className="max-h-[60vh] overflow-y-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="text-left p-2">Student</th>
                      <th className="p-2 text-center">Overall</th>
                      <th className="p-2 text-left">Class Teacher Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.student_results.map((s) => (
                      <tr key={s.student_id} className="border-t hover:bg-gray-50">
                        <td className="p-2">
                          <p className="font-medium">{s.student_name}</p>
                          <p className="text-xs text-gray-400">{s.admission_number}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            {Object.entries(s.subjects).map(([subj, score]) => (
                              <span key={subj} className="mr-2">{subj}: {score}%</span>
                            ))}
                          </div>
                        </td>
                        <td className="p-2 text-center font-semibold">
                          <span className={s.overall_mean >= 50 ? "text-green-600" : "text-red-600"}>
                            {s.overall_mean}%
                          </span>
                        </td>
                        <td className="p-2">
                          {editingStudent === s.student_id ? (
                            <div className="flex gap-1">
                              <input
                                type="text"
                                value={remarkText}
                                onChange={(e) => setRemarkText(e.target.value)}
                                className="border rounded p-1 text-xs flex-1"
                                placeholder="Add remark..."
                              />
                              <button
                                onClick={() => handleSaveRemark(s.student_id)}
                                disabled={savingRemark}
                                className="text-xs bg-blue-600 text-white px-2 rounded"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingStudent(s.student_id);
                                setRemarkText("");
                              }}
                              className="text-xs text-blue-600"
                            >
                              + Add Remark
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Attendance Marking Section */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Mark Attendance for Today</h3>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={attDate}
                  onChange={(e) => setAttDate(e.target.value)}
                  className="border rounded-lg p-2 text-sm w-full max-w-xs"
                />
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto mb-3">
                {data.student_results.map((s) => (
                  <div key={s.student_id} className="flex items-center gap-3">
                    <span className="text-sm w-32 truncate">{s.student_name}</span>
                    <select
                      value={attStatuses[s.student_id] || "Present"}
                      onChange={(e) =>
                        setAttStatuses({ ...attStatuses, [s.student_id]: e.target.value })
                      }
                      className="border rounded p-1 text-sm flex-1"
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Sick">Sick</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                ))}
              </div>
              <button
                onClick={handleMarkAttendance}
                disabled={savingAtt}
                className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-medium"
              >
                {savingAtt ? "Saving..." : "Save Attendance"}
              </button>
              {attMessage && (
                <p className={`mt-2 text-sm ${attMessage.includes("failed") ? "text-red-600" : "text-green-600"}`}>
                  {attMessage}
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}