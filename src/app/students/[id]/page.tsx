"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";

interface StudentProfile {
  student: {
    id: string;
    name: string;
    admission_number: string;
    access_code: string;
    class_name: string;
    school_name: string;
    school_id: string;
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
}

interface MLRisk {
  student_name: string;
  subject_risks: {
    subject_id: string;
    subject_name: string;
    risk_probability: number;
  }[];
  overall_risk: number;
}

export default function StudentProfilePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [teacher, setTeacher] = useState<any>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [mlRisk, setMlRisk] = useState<MLRisk | null>(null);
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState("Term 1 2025");
  const [message, setMessage] = useState("");

  // Remark editing
  const [editingRemark, setEditingRemark] = useState(false);
  const [remarkText, setRemarkText] = useState("");
  const [savingRemark, setSavingRemark] = useState(false);

  // Fee editing
  const [editingFee, setEditingFee] = useState(false);
  const [newBalance, setNewBalance] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [savingFee, setSavingFee] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (!stored) {
      router.push("/login");
      return;
    }
    const t = JSON.parse(stored);
    setTeacher(t);
    if (id) {
      fetchProfile(id, term);
      fetchMLRisk(id, term);
    }
  }, [id, router]);

  const fetchProfile = async (studentId: string, t: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/students/${studentId}/profile`, {
        params: { term: t },
      });
      setProfile(res.data);
    } catch (err: any) {
      setMessage("Failed to load student profile.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMLRisk = async (studentId: string, t: string) => {
    try {
      const res = await api.get(`/ml-risk/student/${studentId}?term=${encodeURIComponent(t)}`);
      if (res.data && res.data.subject_risks?.length > 0) {
        setMlRisk(res.data);
      } else {
        setMlRisk(null);
      }
    } catch {
      setMlRisk(null);
    }
  };

  const handleSaveRemark = async () => {
    if (!teacher || !profile) return;
    setSavingRemark(true);
    try {
      await api.put("/class-teacher/remark", {
        student_id: profile.student.id,
        remark: remarkText,
      }, {
        params: { teacher_id: teacher.teacher_id, term },
      });
      setEditingRemark(false);
      fetchProfile(profile.student.id, term);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to save remark");
    } finally {
      setSavingRemark(false);
    }
  };

  const handleUpdateFee = async () => {
    if (!teacher || !profile) return;
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
          recorded_by: teacher.teacher_id,
        });
      }
      setEditingFee(false);
      setNewBalance("");
      setPaymentAmount("");
      fetchProfile(profile.student.id, term);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to update fee");
    } finally {
      setSavingFee(false);
    }
  };

  const printReport = () => {
    if (!profile) return;
    const params = new URLSearchParams({ term });
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/print/report/${profile.student.id}?${params.toString()}`,
      "_blank"
    );
  };

  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">Student Profile</h1>
          <button onClick={() => router.back()} className="text-gray-500 text-sm">
            ← Back
          </button>
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
                fetchProfile(id, e.target.value);
                fetchMLRisk(id, e.target.value);
              }}
              className="w-full border rounded-lg p-2 text-sm"
            />
          </div>
          <button
            onClick={printReport}
            className="py-2 px-4 bg-indigo-600 text-white rounded-lg text-sm"
          >
            Print Report
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-20">Loading profile…</p>
        ) : message ? (
          <p className="text-center text-red-500 py-10">{message}</p>
        ) : profile ? (
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h2 className="font-bold text-lg">{profile.student.name}</h2>
              <p className="text-sm text-gray-500">
                {profile.student.school_name} · {profile.student.class_name}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div>Admission No: <span className="font-mono">{profile.student.admission_number}</span></div>
                <div>Access Code: <span className="font-mono text-blue-600">{profile.student.access_code}</span></div>
              </div>
            </div>

            {/* ML Risk Prediction */}
            {mlRisk && mlRisk.subject_risks.length > 0 && (
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">
                  🤖 ML Risk Prediction{" "}
                  <span className="text-sm font-normal text-red-600">
                    (Overall: {Math.round(mlRisk.overall_risk * 100)}%)
                  </span>
                </h3>
                <div className="space-y-2">
                  {mlRisk.subject_risks.slice(0, 5).map((risk) => (
                    <div key={risk.subject_name} className="flex justify-between items-center border-b pb-1">
                      <span className="text-sm">{risk.subject_name}</span>
                      <span className={`text-sm font-medium ${risk.risk_probability > 0.7 ? "text-red-600" : risk.risk_probability > 0.4 ? "text-yellow-600" : "text-green-600"}`}>
                        {Math.round(risk.risk_probability * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Probability of scoring below 50% in the next term, based on historical patterns.
                </p>
              </div>
            )}

            {/* Results */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">Results</h3>
              {profile.results.length === 0 ? (
                <p className="text-sm text-gray-400">No approved results for this term.</p>
              ) : (
                <div className="space-y-2">
                  {profile.results.map((subj) => (
                    <div key={subj.subject} className="flex justify-between items-center border-b pb-1">
                      <span className="font-medium">{subj.subject}</span>
                      <span className="text-sm bg-gray-100 px-2 py-0.5 rounded">{subj.average}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Attendance */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">Attendance</h3>
              <p className="text-sm">Rate: <span className="font-bold">{profile.attendance.percentage}%</span> ({profile.attendance.total_days} days)</p>
              <div className="grid grid-cols-4 gap-2 mt-2 text-xs text-center">
                <div><span className="text-green-600 font-bold">{profile.attendance.summary.present}</span><br />Present</div>
                <div><span className="text-red-600 font-bold">{profile.attendance.summary.absent}</span><br />Absent</div>
                <div><span className="text-yellow-600 font-bold">{profile.attendance.summary.sick}</span><br />Sick</div>
                <div><span className="text-orange-600 font-bold">{profile.attendance.summary.suspended}</span><br />Suspended</div>
              </div>
            </div>

            {/* Discipline */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">Discipline</h3>
              {profile.discipline.length === 0 ? (
                <p className="text-sm text-gray-400">No records.</p>
              ) : (
                <div className="space-y-2">
                  {profile.discipline.map((d) => (
                    <div key={d.id} className="border-b pb-1 text-sm">
                      <p><span className="font-medium">{d.category}</span> – {d.incident_date}</p>
                      <p className="text-gray-600">{d.description}</p>
                      {d.action_taken && <p className="text-xs text-gray-400">Action: {d.action_taken}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fee */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">Fees</h3>
              <p className="text-sm">
                Balance: <span className={`font-bold ${profile.fee.cleared ? "text-green-600" : "text-red-600"}`}>
                  KES {profile.fee.balance.toLocaleString()}
                </span>
                {profile.fee.cleared && <span className="ml-2 text-green-600 text-xs">(Cleared)</span>}
              </p>
              {profile.fee.payments.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium mb-1">Payments</p>
                  {profile.fee.payments.map((p, i) => (
                    <div key={i} className="text-xs text-gray-500 flex justify-between">
                      <span>{p.payment_date} · {p.receipt_number}</span>
                      <span>KES {p.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
              {(teacher.role === "headteacher" || teacher.role === "dean") && (
                <div className="mt-3">
                  {!editingFee ? (
                    <button onClick={() => setEditingFee(true)} className="text-sm text-blue-600">
                      Edit Fee
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="number"
                        placeholder="New Balance"
                        value={newBalance}
                        onChange={(e) => setNewBalance(e.target.value)}
                        className="border rounded p-1.5 text-sm w-full"
                      />
                      <input
                        type="number"
                        placeholder="Payment Amount"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="border rounded p-1.5 text-sm w-full"
                      />
                      <div className="flex gap-2">
                        <button onClick={handleUpdateFee} disabled={savingFee} className="bg-green-600 text-white px-3 py-1 rounded text-xs">
                          Save
                        </button>
                        <button onClick={() => setEditingFee(false)} className="text-xs text-gray-500">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Class Teacher Remark */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">Class Teacher Remark</h3>
              {profile.class_teacher_remark ? (
                <p className="text-sm">{profile.class_teacher_remark}</p>
              ) : (
                <p className="text-sm text-gray-400">No remark yet.</p>
              )}
              {(teacher.role === "headteacher" || teacher.role === "dean" || teacher.role === "teacher") && (
                <div className="mt-2">
                  {!editingRemark ? (
                    <button
                      onClick={() => {
                        setEditingRemark(true);
                        setRemarkText(profile.class_teacher_remark);
                      }}
                      className="text-sm text-blue-600"
                    >
                      {profile.class_teacher_remark ? "Edit Remark" : "Add Remark"}
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        value={remarkText}
                        onChange={(e) => setRemarkText(e.target.value)}
                        className="border rounded p-2 text-sm w-full"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button onClick={handleSaveRemark} disabled={savingRemark} className="bg-blue-600 text-white px-3 py-1 rounded text-xs">
                          Save
                        </button>
                        <button onClick={() => setEditingRemark(false)} className="text-xs text-gray-500">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}