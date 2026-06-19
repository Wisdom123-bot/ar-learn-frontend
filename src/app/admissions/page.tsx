"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import BackButton from "@/components/BackButton";

interface ClassItem {
  id: string;
  name: string;
}

export default function AdmissionsPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [tab, setTab] = useState<"student" | "teacher">("student");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Student form
  const [studentName, setStudentName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");

  // Teacher form
  const [teacherName, setTeacherName] = useState("");

  if (!teacher) return null;

  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (!stored) {
      router.push("/login");
      return;
    }
    const t = JSON.parse(stored);
    if (t.role !== "headteacher" && t.role !== "dean") {
      router.push("/dashboard");
      return;
    }
    setTeacher(t);
    // Load classes for student admission
    api.get(`/schools/${t.school_id}/classes`).then((res) => {
      setClasses(res.data || []);
      if (res.data.length > 0) setSelectedClass(res.data[0].id);
    });
  }, [router]);

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !selectedClass) {
      setMessage("Please fill all fields.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post(
        "/admissions/student",
        {
          full_name: studentName.trim(),
          class_id: selectedClass,
          admission_number: admissionNumber.trim() || undefined,
        },
        { headers: { Authorization: `Bearer ${teacher.teacher_id}` } }
      );
      setMessage(`Student admitted: ${res.data.student.name} (Adm: ${res.data.student.admission_number})`);
      setStudentName("");
      setAdmissionNumber("");
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Failed to admit student.");
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim()) {
      setMessage("Please enter a name.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post(
        "/admissions/teacher",
        { full_name: teacherName.trim(), role: "teacher" },
        { headers: { Authorization: `Bearer ${teacher.teacher_id}` } }
      );
      setMessage(`Teacher admitted: ${res.data.teacher.name} (Code: ${res.data.teacher.teacher_code})`);
      setTeacherName("");
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Failed to admit teacher.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4 text-black">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <h1 className="text-xl font-bold text-black">Admissions</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("student")}
            className={`px-4 py-2 rounded-lg font-medium ${
              tab === "student" ? "bg-blue-600 text-white" : "bg-white border border-gray-500 text-black"
            }`}
          >
            Add Student
          </button>
          <button
            onClick={() => setTab("teacher")}
            className={`px-4 py-2 rounded-lg font-medium ${
              tab === "teacher" ? "bg-blue-600 text-white" : "bg-white border border-gray-500 text-black"
            }`}
          >
            Add Teacher
          </button>
        </div>

        {tab === "student" ? (
          <form onSubmit={handleStudentSubmit} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
            <h2 className="font-semibold text-lg">New Student Admission</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full border border-gray-500 rounded-lg p-2 text-sm text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full border border-gray-500 rounded-lg p-2 text-sm text-black"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Admission Number (optional – auto‑generated if blank)</label>
              <input
                type="text"
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value)}
                className="w-full border border-gray-500 rounded-lg p-2 text-sm text-black"
                placeholder="Leave blank to auto‑generate"
              />
            </div>

            {message && <p className="text-sm text-green-700 bg-green-50 p-2 rounded">{message}</p>}

            <button type="submit" disabled={loading} className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold">
              {loading ? "Admitting..." : "Admit Student"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleTeacherSubmit} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
            <h2 className="font-semibold text-lg">New Teacher Admission</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full border border-gray-500 rounded-lg p-2 text-sm text-black"
                required
              />
            </div>
            {message && <p className="text-sm text-green-700 bg-green-50 p-2 rounded">{message}</p>}
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold">
              {loading ? "Admitting..." : "Admit Teacher"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}