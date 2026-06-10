"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import BackButton from "@/components/BackButton";

export default function ParentLoginPage() {
  const router = useRouter();
  const [schoolName, setSchoolName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName || !studentName) {
      setError("School name and student name are required.");
      return;
    }
    if (!admissionNumber && !accessCode) {
      setError("Please provide either admission number or access code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/parents/login", {
        school_name: schoolName.trim(),
        student_name: studentName.trim(),
        admission_number: admissionNumber.trim() || undefined,
        access_code: accessCode.trim() || undefined,
      });

      // Store student info for parent dashboard
      localStorage.setItem("parent", JSON.stringify(res.data));
      router.push("/parents/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">Parent Portal</h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          View your child's progress
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School Name
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="e.g. Moi Educational Centre"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admission Number
            </label>
            <input
              type="text"
              value={admissionNumber}
              onChange={(e) => setAdmissionNumber(e.target.value)}
              placeholder="e.g. SCH2025/001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Access Code
            </label>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="e.g. AB12CD34"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            {loading ? "Signing in..." : "View Student Progress"}
          </button>
        </form>
        <p className="text-xs text-center text-gray-400 mt-4">
          Use the admission number or access code provided by the school.
        </p>
      </div>
    </main>
  );
}