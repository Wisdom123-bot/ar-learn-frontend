"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import BackButton from "@/components/BackButton";

interface FeeStatus {
  student_id: string;
  student_name: string;
  term: string;
  balance: number;
  cleared: boolean;
  payments: {
    amount: number;
    date: string;
    receipt_number: string;
  }[];
  total_paid: number;
}

export default function FeesPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [searchAdm, setSearchAdm] = useState("");
  const [feeStudent, setFeeStudent] = useState<FeeStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [term, setTerm] = useState("Term 1 2025");

  // Editing fields
  const [newBalance, setNewBalance] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  if (!teacher) return null;

  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (!stored) {
      router.push("/login");
      return;
    }
    setTeacher(JSON.parse(stored));
  }, [router]);

  const searchFeeStudent = async () => {
    if (!searchAdm.trim()) return;
    setLoading(true);
    setMessage("");
    setFeeStudent(null);
    try {
      // Step 1: Get student UUID from admission number
      const studentRes = await api.get(
        `/students/by-admission?admission=${encodeURIComponent(searchAdm.trim())}`
      );
      const studentId = studentRes.data.id;
      if (!studentId) throw new Error("Student not found");

      // Step 2: Fetch fee details using the UUID
      const feeRes = await api.get(`/fees/student/${studentId}`, {
        params: { term },
      });
      setFeeStudent(feeRes.data);
    } catch (err: any) {
      setMessage(
        err.response?.data?.detail || "Student not found or fee error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBalance = async () => {
    if (!feeStudent || !newBalance.trim()) return;
    setActionLoading(true);
    setMessage("");
    try {
      await api.post("/fees/balance/add", {
        student_id: feeStudent.student_id,
        term,
        balance: parseFloat(newBalance),
      });
      setNewBalance("");
      // Refresh
      searchFeeStudent();
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Failed to update balance");
      setActionLoading(false);
    }
  };

  const handleRecordPayment = async () => {
    if (!feeStudent || !paymentAmount.trim()) return;
    setActionLoading(true);
    setMessage("");
    try {
      const res = await api.post("/fees/payment/record", {
        student_id: feeStudent.student_id,
        amount: parseFloat(paymentAmount),
        term,
        recorded_by: teacher.teacher_id,
      });
      setMessage(`Payment recorded. Receipt: ${res.data.receipt_number}`);
      setPaymentAmount("");
      // Refresh
      searchFeeStudent();
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Failed to record payment");
      setActionLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4 text-black">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <h1 className="text-xl font-bold text-black">Fee Management</h1>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Term</label>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full border border-gray-500 rounded-lg p-2 text-sm text-black"
            />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Student admission number"
              value={searchAdm}
              onChange={(e) => setSearchAdm(e.target.value)}
              className="flex-1 border border-gray-500 rounded-lg p-2 text-sm text-black placeholder-gray-600"
            />
            <button
              onClick={searchFeeStudent}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
            >
              {loading ? "..." : "Search"}
            </button>
          </div>

          {message && <p className="text-sm text-red-600">{message}</p>}

          {feeStudent && (
            <div className="border rounded-lg p-4 space-y-4">
              <div>
                <p className="font-medium text-lg">{feeStudent.student_name}</p>
                <p className="text-sm">
                  Balance:{" "}
                  <span className={`font-bold ${feeStudent.cleared ? "text-green-600" : "text-red-600"}`}>
                    KES {feeStudent.balance.toLocaleString()}
                  </span>
                  {feeStudent.cleared && <span className="ml-2 text-green-600 text-xs">(Cleared)</span>}
                </p>
              </div>

              {/* Edit Balance */}
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="text-xs font-medium text-black">Set New Balance (KES)</label>
                  <input
                    type="number"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                    className="w-full border border-gray-500 rounded p-1.5 text-sm text-black"
                    min="0"
                  />
                </div>
                <button
                  onClick={handleUpdateBalance}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"
                >
                  Update Balance
                </button>
              </div>

              {/* Record Payment */}
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="text-xs font-medium text-black">Payment Amount (KES)</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full border border-gray-500 rounded p-1.5 text-sm text-black"
                    min="0"
                  />
                </div>
                <button
                  onClick={handleRecordPayment}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-green-600 text-white rounded text-sm"
                >
                  Record Payment
                </button>
              </div>

              {/* Payment History */}
              {feeStudent.payments.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-1 text-black">Recent Payments</p>
                  {feeStudent.payments.slice(0, 5).map((p, i) => (
                    <div key={i} className="text-xs flex justify-between border-b py-1">
                      <span>{p.date} · {p.receipt_number}</span>
                      <span>KES {p.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}