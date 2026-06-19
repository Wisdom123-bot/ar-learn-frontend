"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import dynamic from "next/dynamic";
import StudentSearch from "@/components/StudentSearch";
import NotificationBell from "@/components/NotificationBell";
import TimetableGeneratorModal from "@/components/TimetableGeneratorModal";
import BackButton from "@/components/BackButton";

interface DashboardData {
  school_mean: number;
  best_class: { class_name: string; mean_score: number } | null;
  worst_class: { class_name: string; mean_score: number } | null;
  best_subject: { subject_name: string; mean_score: number } | null;
  worst_subject: { subject_name: string; mean_score: number } | null;
  top_teachers: any[];
  bottom_teachers: any[];
  risk_student_count: number;
  risk_sample: { student_id: string; student_name: string; mean_score: number }[];
  attendance_summary: { present: number; absent: number; sick: number; suspended: number };
  fee_outstanding: number;
  fee_cleared_count: number;
  fee_previous_term_outstanding: number;
  cbc_weakest_competencies: { competency: string; BE: number; AE: number }[];
}

function RiskCard({ group, groupStudents, router }: { group: string; groupStudents: any[]; router: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="flex flex-col gap-3">
       <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gray-900 p-6 rounded-[2rem] shadow-xl text-white hover:bg-gray-800 transition-all cursor-pointer group"
       >
          <div className="flex items-center justify-between mb-4">
             <div>
                <h4 className="text-lg font-black">{group}</h4>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">School-wide Scan</p>
             </div>
             <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">⚠️</div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-400">
               {groupStudents.length} Students At Risk
            </span>
            <span className="text-[10px] font-black uppercase text-gray-500 group-hover:text-white transition-colors flex items-center gap-1">
               {isExpanded ? "Hide" : "Expand"}
               <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor" className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
               </svg>
            </span>
          </div>
       </div>

       {isExpanded && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
             {groupStudents.map((s, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between hover:border-blue-200 transition-all">
                   <div>
                      <p className="text-sm font-bold text-gray-900">{s.student_name}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Mean Score: {s.mean_score}%</p>
                   </div>
                   <button
                      onClick={() => router.push(`/students/${s.student_id}`)}
                      className="text-[10px] font-black text-blue-600 uppercase tracking-tighter"
                   >
                      View Intelligence →
                   </button>
                </div>
             ))}
          </div>
       )}
    </div>
  );
}

const PremiumCharts = dynamic(() => import("@/components/PremiumCharts"), { ssr: false });

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
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [termFee, setTermFee] = useState("");
  const [termFeeAmount, setTermFeeAmount] = useState(0);
  const [deficit, setDeficit] = useState({ term_fee: 0, deficit: 0, total_expected: 0, total_collected: 0 });
  const [showFeeSettings, setShowFeeSettings] = useState(false);
  const [defaulters, setDefaulters] = useState<{ current_term: any[]; previous_term: any[] } | null>(null);
  const [showDefaulters, setShowDefaulters] = useState(false);

  // Export dropdown
  const [showExportMenu, setShowExportMenu] = useState(false);

  if (!teacher) return null;

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

  const fetchTermFee = async () => {
    try {
      const res = await api.get("/fees/term-fee", { params: { school_id: schoolId, term } });
      setTermFeeAmount(res.data.amount || 0);
      setTermFee(String(res.data.amount || ""));
    } catch {}
  };

  const fetchDeficit = async () => {
    try {
      const res = await api.get("/fees/deficit", { params: { school_id: schoolId, term } });
      setDeficit(res.data);
    } catch {}
  };

  const handleSetTermFee = async () => {
    try {
      await api.post("/fees/term-fee", { amount: parseFloat(termFee) || 0 }, { params: { school_id: schoolId, term } });
      setMessage("Term fee updated successfully.");
      fetchTermFee();
      fetchDeficit();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to set term fee");
    }
  };

  const fetchDefaulters = async () => {
    try {
      const res = await api.get("/fees/defaulters", {
        params: { school_id: schoolId, current_term: term, previous_term: previousTerm },
      });
      setDefaulters(res.data);
      setShowDefaulters(true);
    } catch (err: any) {
      alert("Failed to load defaulters list");
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
      searchFeeStudent();
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
      searchFeeStudent();
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

  const handleLogout = () => {
    localStorage.removeItem("teacher");
    router.push("/login");
  };

  useEffect(() => {
    if (schoolId) {
      fetchTermFee();
      fetchDeficit();
    }
  }, [schoolId, term]);


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
          <button
            onClick={() => router.push("/analytics/leaderboard")}
            className="px-3 py-1.5 text-sm font-black bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-600 hover:text-white transition"
          >
            🏆 Leaderboard
          </button>
          <Link
            href="/privacy"
            target="_blank"
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Privacy
          </Link>
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
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition"
          >
            Logout
          </button>
          <BackButton />
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

      {/* Fee Settings & Deficit */}
      <button
        onClick={() => setShowFeeSettings(!showFeeSettings)}
        className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium"
      >
        {showFeeSettings ? "Hide Fee Settings" : "Fee Settings & Deficit"}
      </button>

      {showFeeSettings && (
        <div className="bg-white p-4 rounded-xl shadow-sm mb-4 space-y-3">
          <h3 className="font-semibold text-gray-800">Term Fee Configuration</h3>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="text-xs">Fee per Student (KES)</label>
              <input
                type="number"
                value={termFee}
                onChange={(e) => setTermFee(e.target.value)}
                className="w-full border rounded p-1.5 text-sm"
              />
            </div>
            <button onClick={handleSetTermFee} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm">
              Set Fee
            </button>
          </div>

          {deficit.term_fee > 0 && (
            <div className="space-y-2 mt-3">
              <div className="flex justify-between text-sm">
                <span>Total Expected:</span>
                <span className="font-bold">KES {deficit.total_expected.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Collected:</span>
                <span className="font-bold">KES {deficit.total_collected.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm border-t pt-2">
                <span>School Deficit:</span>
                <span className="font-bold text-red-600">KES {deficit.deficit.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}

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
              {teacher.is_premium && (
                <button onClick={() => setShowTimetableModal(true)} className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium">
                  🗓️ Auto‑Generate Timetable
                </button>
              )}
              <button onClick={() => router.push("/admissions")} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium">
                Admissions
              </button>
              <button onClick={() => router.push("/headteacher/subjects")} className="px-4 py-2 bg-slate-600 text-white rounded-lg text-sm font-medium">
                Manage Subjects
              </button>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="text-xs">New Balance (KES)</label>
                  <input type="number" value={newBalance} onChange={(e) => setNewBalance(e.target.value)} className="w-full border rounded p-1.5 text-sm" />
                </div>
                <button onClick={handleUpdateBalance} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm">Set Balance</button>
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="text-xs">Payment Amount (KES)</label>
                  <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="w-full border rounded p-1.5 text-sm" />
                </div>
                <button onClick={handleRecordPayment} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm">Record Payment</button>
              </div>
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

      {showTimetableModal && (
        <TimetableGeneratorModal schoolId={teacher.school_id} onClose={() => setShowTimetableModal(false)} />
      )}

      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading dashboard…</div>
      ) : message ? (
        <div className="text-center text-red-500 py-10">{message}</div>
      ) : data ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500">School Mean</p>
              <p className="text-2xl font-bold text-blue-600">{data.school_mean}</p>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 group relative">
              <p className="text-xs text-gray-500">Intelligence Suite</p>
              <p className="text-sm font-black text-emerald-600 uppercase tracking-widest mt-1 animate-pulse">Active Model</p>
              <div className="absolute top-2 right-2 h-2 w-2 bg-emerald-500 rounded-full"></div>
            </div>
          </div>
          {teacher.is_premium && <PremiumCharts schoolId={teacher.school_id} term={term} />}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500">Best Class</p>
              <p className="text-lg font-semibold text-gray-800">{data.best_class?.class_name || "—"}</p>
              <p className="text-sm text-green-600">{data.best_class?.mean_score}%</p>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500">Worst Class</p>
              <p className="text-lg font-semibold text-gray-800">{data.worst_class?.class_name || "—"}</p>
              <p className="text-sm text-red-600">{data.worst_class?.mean_score}%</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500">Best Subject</p>
              <p className="text-lg font-semibold text-gray-800">{data.best_subject?.subject_name || "—"}</p>
              <p className="text-sm text-green-600">{data.best_subject?.mean_score}%</p>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500">Worst Subject</p>
              <p className="text-lg font-semibold text-gray-800">{data.worst_subject?.subject_name || "—"}</p>
              <p className="text-sm text-red-600">{data.worst_subject?.mean_score}%</p>
            </div>
          </div>
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
          <div className="bg-white rounded-xl shadow-sm p-3">
            <h3 className="font-semibold text-gray-800 mb-2">Attendance</h3>
            <div className="grid grid-cols-4 gap-2 text-center text-sm">
              <div><p className="text-green-600 font-bold">{data.attendance_summary.present}</p><p className="text-xs text-gray-500">Present</p></div>
              <div><p className="text-red-600 font-bold">{data.attendance_summary.absent}</p><p className="text-xs text-gray-500">Absent</p></div>
              <div><p className="text-yellow-600 font-bold">{data.attendance_summary.sick}</p><p className="text-xs text-gray-500">Sick</p></div>
              <div><p className="text-orange-600 font-bold">{data.attendance_summary.suspended}</p><p className="text-xs text-gray-500">Suspended</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3">
            <h3 className="font-semibold text-gray-800 mb-2">Fees (School‑wide)</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>This Term Outstanding:</span>
                <span className="font-bold text-red-600">KES {data.fee_outstanding.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Last Term Outstanding:</span>
                <span className="font-bold text-orange-600">KES {data.fee_previous_term_outstanding.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Students Cleared:</span>
                <span className="font-bold text-green-600">{data.fee_cleared_count}</span>
              </div>
              <button
                onClick={fetchDefaulters}
                className="w-full mt-2 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200"
              >
                View Defaulters List
              </button>
            </div>
          </div>

          {showDefaulters && defaulters && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 text-black">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Defaulters Breakdown</h2>
                  <button onClick={() => setShowDefaulters(false)} className="text-gray-500 text-xl">✕</button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-red-600 border-b pb-1 mb-2">Current Term ({term})</h4>
                    {defaulters.current_term.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No defaulters found for this term.</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-500 border-b">
                            <th className="pb-2">Name</th>
                            <th className="pb-2">Class</th>
                            <th className="pb-2 text-right">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {defaulters.current_term.map((d, i) => (
                            <tr key={i} className="border-b last:border-0">
                              <td className="py-2">{d.student_name} <span className="text-xs text-gray-400">({d.admission_number})</span></td>
                              <td className="py-2">{d.class_name}</td>
                              <td className="py-2 text-right font-medium">KES {d.balance.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-orange-600 border-b pb-1 mb-2">Last Term ({previousTerm})</h4>
                    {defaulters.previous_term.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No outstanding balances from the last term.</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-500 border-b">
                            <th className="pb-2">Name</th>
                            <th className="pb-2">Class</th>
                            <th className="pb-2 text-right">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {defaulters.previous_term.map((d, i) => (
                            <tr key={i} className="border-b last:border-0">
                              <td className="py-2">{d.student_name} <span className="text-xs text-gray-400">({d.admission_number})</span></td>
                              <td className="py-2">{d.class_name}</td>
                              <td className="py-2 text-right font-medium">KES {d.balance.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
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
          {data.risk_sample.length > 0 && (
            <div className="bg-white rounded-[2rem] shadow-sm p-8 border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                 <span className="p-2 bg-red-50 text-red-600 rounded-xl">🚨</span>
                 Academic Risk by Class
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(
                  data.risk_sample.reduce((acc, s) => {
                    // Group all risk students into a card for HT
                    const group = "Academic Intervention";
                    if (!acc[group]) acc[group] = [];
                    acc[group].push(s);
                    return acc;
                  }, {} as Record<string, any[]>)
                ).map(([group, groupStudents]) => (
                  <RiskCard key={group} group={group} groupStudents={groupStudents} router={router} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}