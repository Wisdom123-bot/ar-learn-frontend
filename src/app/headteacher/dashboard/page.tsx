"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import dynamic from "next/dynamic";
import StudentSearch from "@/components/StudentSearch";
import NotificationBell from "@/components/NotificationBell";

interface DashboardData {
  school_mean: number;
  best_class: { class_name: string; mean_score: number } | null;
  worst_class: { class_name: string; mean_score: number } | null;
  best_subject: { subject_name: string; mean_score: number } | null;
  worst_subject: { subject_name: string; mean_score: number } | null;
  top_teachers: any[];
  bottom_teachers: any[];
  risk_student_count: number;
  risk_sample: { student_name: string; mean_score: number }[];
  attendance_summary: { present: number; absent: number; sick: number; suspended: number };
  fee_outstanding: number;
  fee_cleared_count: number;
  cbc_weakest_competencies: { competency: string; BE: number; AE: number }[];
}

export default function HeadteacherDashboardPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [schoolId, setSchoolId] = useState("");
  const [term, setTerm] = useState("Term 1 2025");
  const [previousTerm, setPreviousTerm] = useState("Term 3 2024");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fee management
  const [searchAdm, setSearchAdm] = useState("");
  const [feeStudent, setFeeStudent] = useState<any>(null);
  const [feeLoading, setFeeLoading] = useState(false);
  const [feeMessage, setFeeMessage] = useState("");
  const [newBalance, setNewBalance] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [showFeePanel, setShowFeePanel] = useState(false);

  // Export dropdown
  const [showExportMenu, setShowExportMenu] = useState(false);
  const PremiumCharts = dynamic(() => import("@/components/PremiumCharts"), { ssr: false });
  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (!stored) {
      router.push("/login");
      return;
    }
    const t = JSON.parse(stored);
    if (t.role !== "headteacher") {
      router.push("/dashboard");
      return;
    }
    setTeacher(t);
    if (t.school_id) {
      setSchoolId(t.school_id);
      fetchDashboard(t.school_id, term, previousTerm);
    }
  }, []);

  const fetchDashboard = async (sid: string, t: string, pt: string) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await api.get("/headteacher/dashboard", {
        params: { school_id: sid, term: t, previous_term: pt || undefined },
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
    fetchDashboard(schoolId, term, previousTerm);
  };

  // --- Fee functions ---
  const searchFeeStudent = async () => {
    if (!searchAdm.trim()) return;
    setFeeLoading(true);
    setFeeMessage("");
    setFeeStudent(null);
    try {
      const res = await api.get(`/fees/student/${searchAdm.trim()}`, {
        params: { term },
      });
      setFeeStudent(res.data);
    } catch (err: any) {
      setFeeMessage(err.response?.data?.detail || "Student not found or fee error");
    } finally {
      setFeeLoading(false);
    }
  };

  const handleUpdateBalance = async () => {
    if (!feeStudent || !newBalance) return;
    try {
      await api.post("/fees/balance/add", {
        student_id: feeStudent.student_id,
        term,
        balance: parseFloat(newBalance),
      });
      setFeeMessage("Balance updated.");
      searchFeeStudent(); // refresh
    } catch (err: any) {
      setFeeMessage(err.response?.data?.detail || "Failed to update balance");
    }
  };

  const handleRecordPayment = async () => {
    if (!feeStudent || !paymentAmount) return;
    try {
      const res = await api.post("/fees/payment/record", {
        student_id: feeStudent.student_id,
        amount: parseFloat(paymentAmount),
        term,
        recorded_by: teacher.teacher_id,
      });
      setFeeMessage(`Payment recorded. Receipt: ${res.data.receipt_number}`);
      setPaymentAmount("");
      searchFeeStudent(); // refresh
    } catch (err: any) {
      setFeeMessage(err.response?.data?.detail || "Failed to record payment");
    }
  };

  const handleExport = (type: string, format: string) => {
    const base = `${process.env.NEXT_PUBLIC_API_URL}/exports`;
    let url = "";
    if (type === "students") {
      url = `${base}/students/${schoolId}?format=${format}`;
    } else if (type === "results") {
      url = `${base}/results/${schoolId}?term=${encodeURIComponent(term)}&format=${format}`;
    } else if (type === "fees") {
      url = `${base}/fees/${schoolId}?term=${encodeURIComponent(term)}&format=${format}`;
    }
    if (url) window.open(url, "_blank");
    setShowExportMenu(false);
  };

  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Headteacher Dashboard</h1>
          <p className="text-sm text-gray-500">{teacher.school_name}</p>
          {teacher.is_premium && teacher.slug && (
            <div className="flex items-center gap-2 mt-1">
              {teacher.logo_url && (
                <img src={teacher.logo_url} alt="Logo" className="h-8 w-8 rounded-full" />
              )}
              <span className="text-xs text-blue-600 font-mono">{teacher.slug}.ar-learn.com</span>
            </div>
          )}
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
              Export
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
          <button onClick={() => router.push("/dashboard")} className="text-gray-500 text-sm">
            ← Main Dashboard
          </button>
        </div>
      </div>

      {/* Term Filter */}
      <form onSubmit={handleFilter} className="bg-white p-3 rounded-xl shadow-sm mb-4 flex gap-2 items-end flex-wrap">
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs font-medium mb-1">Term</label>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm"
          />
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs font-medium mb-1">Prev Term</label>
          <input
            type="text"
            value={previousTerm}
            onChange={(e) => setPreviousTerm(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm"
          />
        </div>
        <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium">
          Apply
        </button>
      </form>

      {/* Fee Management Button */}
      <button
        onClick={() => setShowFeePanel(!showFeePanel)}
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium"
      >
        {showFeePanel ? "Hide Fee Management" : "Fee Management"}
      </button>

      {showFeePanel && (
        <div className="bg-white p-4 rounded-xl shadow-sm mb-4 space-y-3">
          <h3 className="font-semibold text-gray-800">Fee Management</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Student admission number"
              value={searchAdm}
              onChange={(e) => setSearchAdm(e.target.value)}
              className="flex-1 border rounded-lg p-2 text-sm"
            />
            <button
              onClick={() => router.push("/students")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium"
            >
              Student List
            </button>
            <button onClick={searchFeeStudent} disabled={feeLoading} className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm">
              {feeLoading ? "..." : "Search"}
            </button>
          </div>
          {feeMessage && <p className="text-sm text-gray-600">{feeMessage}</p>}
          {feeStudent && (
            <div className="border rounded-lg p-3 space-y-3">
              <p className="font-medium">{feeStudent.student_name}</p>
              <p className="text-sm">
                Balance: <span className="font-bold text-red-600">KES {feeStudent.balance.toLocaleString()}</span>
                {feeStudent.cleared && <span className="text-green-600 ml-2">(Cleared)</span>}
              </p>
              {/* Update balance */}
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="text-xs">New Balance (KES)</label>
                  <input
                    type="number"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                    className="w-full border rounded p-1.5 text-sm"
                  />
                </div>
                <button onClick={handleUpdateBalance} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm">Set Balance</button>
              </div>
              {/* Record payment */}
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="text-xs">Payment Amount (KES)</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full border rounded p-1.5 text-sm"
                  />
                </div>
                <button onClick={handleRecordPayment} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm">Record Payment</button>
              </div>
              {/* Recent payments */}
              {feeStudent.payments && feeStudent.payments.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-1">Recent Payments</p>
                  {feeStudent.payments.slice(0, 5).map((p: any, i: number) => (
                    <div key={i} className="text-xs text-gray-500 flex justify-between">
                      <span>{p.date} · {p.receipt_number}</span>
                      <span>KES {p.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading dashboard…</div>
      ) : message ? (
        <div className="text-center text-red-500 py-10">{message}</div>
      ) : data ? (
        <div className="space-y-4">
          {/* School overview cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500">School Mean</p>
              <p className="text-2xl font-bold text-blue-600">{data.school_mean}</p>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500">At‑Risk Students</p>
              <p className="text-2xl font-bold text-red-600">{data.risk_student_count}</p>
            </div>
          </div>
          {/* Premium Charts – only visible when is_premium is true */}
          {teacher.is_premium && (
            <PremiumCharts schoolId={teacher.school_id} term={term} />
          )}
          {/* Best / Worst Class & Subject */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500">Best Class</p>
              <p className="text-lg font-semibold text-gray-800">
                {data.best_class?.class_name || "—"}
              </p>
              <p className="text-sm text-green-600">{data.best_class?.mean_score}%</p>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500">Worst Class</p>
              <p className="text-lg font-semibold text-gray-800">
                {data.worst_class?.class_name || "—"}
              </p>
              <p className="text-sm text-red-600">{data.worst_class?.mean_score}%</p>
            </div>
          </div>

          {/* Best / Worst Subject */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500">Best Subject</p>
              <p className="text-lg font-semibold text-gray-800">
                {data.best_subject?.subject_name || "—"}
              </p>
              <p className="text-sm text-green-600">{data.best_subject?.mean_score}%</p>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500">Worst Subject</p>
              <p className="text-lg font-semibold text-gray-800">
                {data.worst_subject?.subject_name || "—"}
              </p>
              <p className="text-sm text-red-600">{data.worst_subject?.mean_score}%</p>
            </div>
          </div>

          {/* Teacher Performance */}
          <div className="bg-white rounded-xl shadow-sm p-3">
            <h3 className="font-semibold text-gray-800 mb-2">Top Teachers (Value‑Add)</h3>
            {data.top_teachers.length === 0 ? (
              <p className="text-xs text-gray-400">No data</p>
            ) : (
              <ul className="space-y-2">
                {data.top_teachers.map((t: any) => (
                  <li key={t.teacher_id} className="flex justify-between text-sm">
                    <span>{t.teacher_name}</span>
                    <span className={t.value_add >= 0 ? "text-green-600" : "text-red-600"}>
                      {t.value_add > 0 ? "+" : ""}{t.value_add}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-3">
            <h3 className="font-semibold text-gray-800 mb-2">Needs Support</h3>
            {data.bottom_teachers.length === 0 ? (
              <p className="text-xs text-gray-400">No data</p>
            ) : (
              <ul className="space-y-2">
                {data.bottom_teachers.map((t: any) => (
                  <li key={t.teacher_id} className="flex justify-between text-sm">
                    <span>{t.teacher_name}</span>
                    <span className={t.value_add >= 0 ? "text-green-600" : "text-red-600"}>
                      {t.value_add > 0 ? "+" : ""}{t.value_add}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Attendance Summary */}
          <div className="bg-white rounded-xl shadow-sm p-3">
            <h3 className="font-semibold text-gray-800 mb-2">Attendance</h3>
            <div className="grid grid-cols-4 gap-2 text-center text-sm">
              <div><p className="text-green-600 font-bold">{data.attendance_summary.present}</p><p className="text-xs text-gray-500">Present</p></div>
              <div><p className="text-red-600 font-bold">{data.attendance_summary.absent}</p><p className="text-xs text-gray-500">Absent</p></div>
              <div><p className="text-yellow-600 font-bold">{data.attendance_summary.sick}</p><p className="text-xs text-gray-500">Sick</p></div>
              <div><p className="text-orange-600 font-bold">{data.attendance_summary.suspended}</p><p className="text-xs text-gray-500">Suspended</p></div>
            </div>
          </div>

          {/* Fee Summary (school‑wide) */}
          <div className="bg-white rounded-xl shadow-sm p-3">
            <h3 className="font-semibold text-gray-800 mb-2">Fees (School‑wide)</h3>
            <div className="flex justify-between text-sm">
              <span>Outstanding: <span className="font-bold text-red-600">KES {data.fee_outstanding.toLocaleString()}</span></span>
              <span>Cleared: <span className="font-bold text-green-600">{data.fee_cleared_count}</span></span>
            </div>
          </div>

          {/* CBC Weakest Competencies */}
          {data.cbc_weakest_competencies.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-3">
              <h3 className="font-semibold text-gray-800 mb-2">Weakest Competencies (CBC)</h3>
              <ul className="space-y-1 text-sm">
                {data.cbc_weakest_competencies.map((c, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{c.competency}</span>
                    <span className="text-red-600">{c.BE + c.AE} students BE/AE</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* At‑Risk Students List */}
          {data.risk_sample.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-3">
              <h3 className="font-semibold text-gray-800 mb-2">At‑Risk Students</h3>
              <ul className="space-y-1 text-sm">
                {data.risk_sample.map((s, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{s.student_name}</span>
                    <span className="text-red-600">{s.mean_score}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}