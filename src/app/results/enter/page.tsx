"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Assignment {
  class_id: string;
  class_name: string;
  subject_id: string;
  subject_name: string;
  is_class_teacher: boolean;
}

interface Student {
  id: string;
  name: string;
  admission_number: string;
}

interface ResultRow {
  student_id: string;
  score: string;
  remarks: string;
}

export default function EnterResultsPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [examType, setExamType] = useState("CAT");
  const [term, setTerm] = useState("Term 1 2025");
  const [academicYear, setAcademicYear] = useState("2025");
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
    // Fetch teacher’s assignments (class‑subject pairs)
    api.get(`/teachers/${t.teacher_id}/assignments`).then((res) => {
      setAssignments(res.data);
      if (res.data.length > 0) setSelectedAssignment(res.data[0]);
    }).catch(console.error);
  }, [router]);

  // When assignment changes, fetch students of that class
  useEffect(() => {
    if (!selectedAssignment) return;
    api.get(`/teachers/${teacher.teacher_id}/students`)
      .then((res) => {
        // Filter students belonging to the selected class
        const classStudents = res.data.filter((s: any) => s.class_id === selectedAssignment.class_id);
        setStudents(classStudents);
        setResults(
          classStudents.map((s: any) => ({
            student_id: s.id,
            score: "",
            remarks: "",
          }))
        );
      })
      .catch(console.error);
  }, [selectedAssignment, teacher]);

  const handleScoreChange = (studentId: string, value: string) => {
    setResults((prev) =>
      prev.map((r) => (r.student_id === studentId ? { ...r, score: value } : r))
    );
  };

  const handleRemarksChange = (studentId: string, value: string) => {
    setResults((prev) =>
      prev.map((r) => (r.student_id === studentId ? { ...r, remarks: value } : r))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setLoading(true);
    setMessage("");
    const payload = {
      teacher_id: teacher.teacher_id,
      term,
      academic_year: academicYear,
      results: results.map((r) => ({
        student_id: r.student_id,
        subject_id: selectedAssignment.subject_id,
        class_id: selectedAssignment.class_id,
        exam_type: examType,
        score: parseFloat(r.score) || 0,
        remarks: r.remarks,
      })),
    };
    try {
      const res = await api.post("/results/submit", payload);
      setMessage(res.data.message || "Results submitted!");
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-500">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-gray-800">Enter Results</h1>
      </div>

      {/* Selector: Class & Subject */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4 space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Class & Subject</label>
          <select
            className="w-full border rounded-lg p-2 text-sm"
            value={selectedAssignment ? `${selectedAssignment.class_id}|${selectedAssignment.subject_id}` : ""}
            onChange={(e) => {
              const [class_id, subject_id] = e.target.value.split("|");
              const found = assignments.find(
                (a) => a.class_id === class_id && a.subject_id === subject_id
              );
              setSelectedAssignment(found || null);
            }}
          >
            {assignments.map((a) => (
              <option
                key={`${a.class_id}|${a.subject_id}`}
                value={`${a.class_id}|${a.subject_id}`}
              >
                {a.class_name} – {a.subject_name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Exam Type</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
            >
              <option value="CAT">CAT</option>
              <option value="EXAM">EXAM</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Term</label>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
              placeholder="e.g. Term 1 2025"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Academic Year</label>
          <input
            type="text"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm"
            placeholder="2025"
          />
        </div>
      </div>

      {/* Students Table */}
      {students.length > 0 ? (
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="text-left p-2 font-medium">Student</th>
                    <th className="w-20 p-2 font-medium">Score</th>
                    <th className="w-40 p-2 font-medium">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, idx) => {
                    const student = students.find((s) => s.id === r.student_id);
                    return (
                      <tr key={r.student_id} className="border-t">
                        <td className="p-2">
                          <p className="font-medium">{student?.name}</p>
                          <p className="text-xs text-gray-400">{student?.admission_number}</p>
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={r.score}
                            onChange={(e) => handleScoreChange(r.student_id, e.target.value)}
                            className="w-full border rounded-lg p-1.5 text-center text-sm"
                            min="0"
                            max="100"
                            placeholder="0"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={r.remarks}
                            onChange={(e) => handleRemarksChange(r.student_id, e.target.value)}
                            className="w-full border rounded-lg p-1.5 text-sm"
                            placeholder="Optional"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-lg mb-4 text-sm ${message.includes("failed") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Results"}
          </button>
        </form>
      ) : (
        <p className="text-center text-gray-400 py-10">
          No students in this class.
        </p>
      )}
    </div>
  );
}