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

const PAGE_SIZE = 50;

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
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (!stored) {
      router.push("/login");
      return;
    }
    const t = JSON.parse(stored);
    setTeacher(t);
    api.get(`/teachers/${t.teacher_id}/assignments`).then((res) => {
      setAssignments(res.data);
      if (res.data.length > 0) setSelectedAssignment(res.data[0]);
    }).catch(console.error);
  }, [router]);

  useEffect(() => {
    if (!selectedAssignment || !teacher) return;
    api.get(`/teachers/${teacher.teacher_id}/students`)
      .then((res) => {
        const classStudents = res.data.filter((s: any) => s.class_id === selectedAssignment.class_id);
        setStudents(classStudents);
        setResults(
          classStudents.map((s: any) => ({
            student_id: s.id,
            score: "",
            remarks: "",
          }))
        );
        setCurrentPage(0);  // reset to first page when class changes
      })
      .catch(console.error);
  }, [selectedAssignment, teacher]);

  // Filter students based on search query
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admission_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE);
  const startIdx = currentPage * PAGE_SIZE;
  const paginatedStudents = filteredStudents.slice(startIdx, startIdx + PAGE_SIZE);

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) setCurrentPage(page);
  };

  // Ensure current page is valid when filteredStudents changes
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [filteredStudents.length, totalPages, currentPage]);

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

    const filledResults = results.filter((r) => r.score.trim() !== "");
    if (filledResults.length === 0) {
      setMessage("Please enter at least one score.");
      setLoading(false);
      return;
    }

    const payload = {
      teacher_id: teacher.teacher_id,
      term,
      academic_year: academicYear,
      results: filledResults.map((r) => ({
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
    <div className="min-h-screen bg-gray-50 p-4 text-black">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-black font-medium">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-black">Enter Results</h1>
      </div>

      {/* Selector: Class & Subject */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-black mb-1">Class & Subject</label>
          <select
            className="w-full border border-gray-500 rounded-lg p-2 text-sm text-black"
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
              <option key={`${a.class_id}|${a.subject_id}`} value={`${a.class_id}|${a.subject_id}`}>
                {a.class_name} – {a.subject_name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Exam Type</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full border border-gray-500 rounded-lg p-2 text-sm text-black"
            >
              <option value="CAT">CAT</option>
              <option value="EXAM">EXAM</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Term</label>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full border border-gray-500 rounded-lg p-2 text-sm text-black placeholder-gray-400"
              placeholder="e.g. Term 1 2025"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Academic Year</label>
          <input
            type="text"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="w-full border border-gray-500 rounded-lg p-2 text-sm text-black placeholder-gray-400"
            placeholder="2025"
          />
        </div>

        {/* Search Student */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">Search Student</label>
          <input
            type="text"
            placeholder="Type name or admission number..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(0);  // reset to first page on new search
            }}
            className="w-full border border-gray-500 rounded-lg p-2 text-sm text-black placeholder-gray-400"
          />
        </div>
      </div>

      {/* Students Table with Pagination */}
      {filteredStudents.length > 0 ? (
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
            <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 400px)" }}>
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="text-left p-2 font-medium text-black">Student</th>
                    <th className="w-20 p-2 font-medium text-black">Score</th>
                    <th className="w-40 p-2 font-medium text-black">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student) => {
                    const resultRow = results.find((r) => r.student_id === student.id);
                    if (!resultRow) return null;
                    return (
                      <tr key={student.id} className="border-t">
                        <td className="p-2">
                          <p className="font-medium text-black">{student.name}</p>
                          <p className="text-xs text-black">{student.admission_number}</p>
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={resultRow.score}
                            onChange={(e) => handleScoreChange(student.id, e.target.value)}
                            className="w-full border border-gray-500 rounded-lg p-1.5 text-center text-sm text-black"
                            min="0"
                            max="100"
                            placeholder="0"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={resultRow.remarks}
                            onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                            className="w-full border border-gray-500 rounded-lg p-1.5 text-sm text-black placeholder-gray-400"
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-3 py-1 text-sm bg-gray-200 text-black rounded disabled:opacity-50"
              >
                ← Previous
              </button>
              <span className="text-sm text-black">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="px-3 py-1 text-sm bg-gray-200 text-black rounded disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          )}

          {message && (
            <div className={`p-3 rounded-lg mb-4 text-sm ${
              message.toLowerCase().includes("failed") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
            }`}>
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
        <p className="text-center text-black py-10">
          {students.length === 0 ? "No students in this class." : "No students match your search."}
        </p>
      )}
    </div>
  );
}