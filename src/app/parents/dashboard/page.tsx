"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface ParentData {
  student_id: string;
  name: string;
  admission_number: string;
  class_name: string;
  school_name: string;
}

interface ResultItem {
  subject: string;
  exam_type: string;
  score: number;
  remarks: string;
}

interface AttendanceData {
  student_name: string;
  total_days: number;
  attendance_pct: number;
  breakdown: {
    present: number;
    absent: number;
    sick: number;
    suspended: number;
  };
}

interface FeeData {
  student_name: string;
  term: string;
  balance: number;
  cleared: boolean;
  payments: {
    amount: number;
    date: string;
    receipt_number: string;
  }[];
}

export default function ParentDashboardPage() {
  const router = useRouter();
  const [parent, setParent] = useState<ParentData | null>(null);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [attendance, setAttendance] = useState<AttendanceData | null>(null);
  const [fees, setFees] = useState<FeeData | null>(null);
  const [term, setTerm] = useState("Term 1 2025");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("parent");
    if (!stored) {
      router.push("/parents/login");
      return;
    }
    const p = JSON.parse(stored);
    setParent(p);
    fetchStudentData(p.student_id, term);
  }, []);

  const fetchStudentData = async (studentId: string, t: string) => {
    setLoading(true);
    try {
      const [resResults, resAttendance, resFees] = await Promise.all([
        api.get(`/parents/student/${studentId}/results?term=${encodeURIComponent(t)}`),
        api.get(`/parents/student/${studentId}/attendance`),
        api.get(`/parents/student/${studentId}/fees?term=${encodeURIComponent(t)}`),
      ]);
      setResults(resResults.data);
      setAttendance(resAttendance.data);
      setFees(resFees.data);
    } catch (err) {
      console.error("Failed to fetch student data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!parent) return;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/parents/student/${parent.student_id}/report?term=${encodeURIComponent(term)}`;
    window.open(url, "_blank");
  };

  const handleLogout = () => {
    localStorage.removeItem("parent");
    router.push("/parents/login");
  };

  if (!parent) return null;

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Welcome, {parent.name}</h1>
            <p className="text-sm text-gray-500">
              {parent.school_name} · {parent.class_name}
            </p>
            <p className="text-xs text-gray-400">Admission: {parent.admission_number}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Log out
          </button>
        </div>

        {/* Term selector */}
        <div className="bg-white p-3 rounded-xl shadow-sm flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1">Term</label>
            <input
              type="text"
              value={term}
              onChange={(e) => {
                setTerm(e.target.value);
                fetchStudentData(parent.student_id, e.target.value);
              }}
              className="w-full border rounded-lg p-2 text-sm"
            />
          </div>
          <button
            onClick={handleDownloadReport}
            className="py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium"
          >
            📄 Report Card
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading...</div>
        ) : (
          <>
            {/* Results */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="font-semibold text-gray-800 mb-3">Results</h2>
              {results.length === 0 ? (
                <p className="text-sm text-gray-400">No results for this term yet.</p>
              ) : (
                <ul className="space-y-2">
                  {results.map((r, i) => (
                    <li key={i} className="flex justify-between text-sm border-b pb-1">
                      <span>{r.subject} ({r.exam_type})</span>
                      <span className="font-medium">{r.score}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Attendance */}
            {attendance && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="font-semibold text-gray-800 mb-3">Attendance</h2>
                <p className="text-sm">Attendance: <span className="font-bold">{attendance.attendance_pct}%</span> ({attendance.total_days} days)</p>
                <div className="grid grid-cols-4 gap-2 mt-2 text-xs text-center">
                  <div><span className="text-green-600 font-bold">{attendance.breakdown.present}</span><br />Present</div>
                  <div><span className="text-red-600 font-bold">{attendance.breakdown.absent}</span><br />Absent</div>
                  <div><span className="text-yellow-600 font-bold">{attendance.breakdown.sick}</span><br />Sick</div>
                  <div><span className="text-orange-600 font-bold">{attendance.breakdown.suspended}</span><br />Suspended</div>
                </div>
              </div>
            )}

            {/* Fees */}
            {fees && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="font-semibold text-gray-800 mb-3">Fees</h2>
                <p className="text-sm">
                  Balance: <span className={`font-bold ${fees.cleared ? "text-green-600" : "text-red-600"}`}>
                    KES {fees.balance.toLocaleString()}
                  </span>
                  {fees.cleared && <span className="ml-2 text-green-600 text-xs">(Cleared)</span>}
                </p>
                {fees.payments.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-600 mb-1">Recent Payments</p>
                    {fees.payments.slice(0, 5).map((p, i) => (
                      <div key={i} className="flex justify-between text-xs text-gray-500">
                        <span>{p.date} · {p.receipt_number}</span>
                        <span>KES {p.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}