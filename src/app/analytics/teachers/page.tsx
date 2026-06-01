"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface TeacherPerformance {
  teacher_id: string;
  teacher_name: string;
  current_mean: number;
  previous_mean: number | null;
  change: number | null;
  school_subject_mean: number | null;
  value_add: number | null;
  risk_student_count: number;
}

export default function TeacherAnalyticsPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [schoolId, setSchoolId] = useState("");
  const [term, setTerm] = useState("Term 1 2025");
  const [previousTerm, setPreviousTerm] = useState("Term 3 2024");
  const [data, setData] = useState<TeacherPerformance[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (!stored) {
      router.push("/login");
      return;
    }
    const t = JSON.parse(stored);
    setTeacher(t);
    if (t.school_id) {
      setSchoolId(t.school_id);
      fetchData(t.school_id, term, previousTerm);
    }
  }, []);

  const fetchData = async (sid: string, t: string, pt: string) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await api.get("/analytics/teachers", {
        params: { school_id: sid, term: t, previous_term: pt || undefined },
      });
      setData(res.data.teachers || []);
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Failed to load teacher analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(schoolId, term, previousTerm);
  };

  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => router.back()} className="text-gray-500">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-gray-800">Teacher Performance</h1>
      </div>

      {/* Filters */}
      <form onSubmit={handleFilter} className="bg-white p-4 rounded-xl shadow-sm mb-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Current Term</label>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
              placeholder="Term 1 2025"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Previous Term</label>
            <input
              type="text"
              value={previousTerm}
              onChange={(e) => setPreviousTerm(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
              placeholder="Term 3 2024"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold"
        >
          Apply
        </button>
      </form>

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-400 py-10">Loading…</p>
      ) : message ? (
        <p className="text-center text-red-500 py-10">{message}</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-400 py-10">No teacher performance data for this term.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2 font-medium">Teacher</th>
                <th className="p-2 font-medium text-center">Current Mean</th>
                <th className="p-2 font-medium text-center">Previous Mean</th>
                <th className="p-2 font-medium text-center">Change</th>
                <th className="p-2 font-medium text-center">School Subj Mean</th>
                <th className="p-2 font-medium text-center">Value‑Add</th>
                <th className="p-2 font-medium text-center">At‑Risk Students</th>
              </tr>
            </thead>
            <tbody>
              {data.map((t) => (
                <tr key={t.teacher_id} className="border-t hover:bg-gray-50">
                  <td className="p-2 font-medium">{t.teacher_name}</td>
                  <td className="p-2 text-center">{t.current_mean}</td>
                  <td className="p-2 text-center">{t.previous_mean ?? "—"}</td>
                  <td className={`p-2 text-center ${t.change !== null && t.change > 0 ? "text-green-600" : t.change !== null && t.change < 0 ? "text-red-600" : "text-gray-500"}`}>
                    {t.change !== null ? (t.change > 0 ? `↑ ${t.change}` : `↓ ${Math.abs(t.change)}`) : "—"}
                  </td>
                  <td className="p-2 text-center">{t.school_subject_mean ?? "—"}</td>
                  <td className={`p-2 text-center font-medium ${t.value_add !== null && t.value_add > 0 ? "text-green-600" : t.value_add !== null && t.value_add < 0 ? "text-red-600" : "text-gray-500"}`}>
                    {t.value_add !== null ? (t.value_add > 0 ? `+${t.value_add}` : t.value_add) : "—"}
                  </td>
                  <td className="p-2 text-center">
                    {t.risk_student_count > 0 ? (
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        {t.risk_student_count}
                      </span>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}