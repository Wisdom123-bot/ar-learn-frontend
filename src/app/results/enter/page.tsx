"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import api, { validatedGet } from "@/lib/api";
import BackButton from "@/components/BackButton";
import { TeacherSchema, AssignmentSchema, StudentSchema, type Assignment, type Teacher } from "@/lib/schemas";
import { z } from "zod";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";

interface ResultRow {
  student_id: string;
  score: string;
  remarks: string;
}

const PAGE_SIZE = 50;

export default function EnterResultsPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [examType, setExamType] = useState("CAT");
  const [term, setTerm] = useState("Term 1 2025");
  const [academicYear, setAcademicYear] = useState("2025");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  // AI CBC State
  const [analyzingFile, setAnalyzingFile] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (!stored) {
      router.push("/login");
      return;
    }
    try {
      setTeacher(TeacherSchema.parse(JSON.parse(stored)));
    } catch (e) {
      console.error("Failed to parse teacher from storage", e);
      router.push("/login");
    }
  }, [router]);

  // TanStack Query for Assignments
  const { data: assignments = [] } = useQuery({
    queryKey: ["assignments", teacher?.teacher_id],
    queryFn: () => validatedGet(`/teachers/${teacher?.teacher_id}/assignments`, z.array(AssignmentSchema)),
    enabled: !!teacher?.teacher_id,
  });

  useEffect(() => {
    if (assignments.length > 0 && !selectedAssignment) {
      setSelectedAssignment(assignments[0]);
    }
  }, [assignments, selectedAssignment]);

  // TanStack Query for Students
  const { data: allStudents = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ["students", teacher?.teacher_id],
    queryFn: () => validatedGet(`/teachers/${teacher?.teacher_id}/students`, z.array(StudentSchema)),
    enabled: !!teacher?.teacher_id,
  });

  const students = useMemo(() => {
    if (!selectedAssignment) return [];
    return allStudents.filter((s) => s.class_id === selectedAssignment.class_id);
  }, [allStudents, selectedAssignment]);

  useEffect(() => {
    setResults(
      students.map((s) => ({
        student_id: s.id,
        score: "",
        remarks: "",
      }))
    );
    setCurrentPage(0);
  }, [students]);

  // Distribution Data for Visualization
  const distributionData = useMemo(() => {
    const bins = [
      { name: "0-20", count: 0, color: "#ef4444" },
      { name: "21-40", count: 0, color: "#f97316" },
      { name: "41-60", count: 0, color: "#eab308" },
      { name: "61-80", count: 0, color: "#22c55e" },
      { name: "81-100", count: 0, color: "#3b82f6" },
    ];

    results.forEach((r) => {
      const s = parseFloat(r.score);
      if (isNaN(s)) return;
      if (s <= 20) bins[0].count++;
      else if (s <= 40) bins[1].count++;
      else if (s <= 60) bins[2].count++;
      else if (s <= 80) bins[3].count++;
      else bins[4].count++;
    });

    return bins;
  }, [results]);

  // Filter students based on search query (MEMOIZED to prevent infinite loop)
  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.admission_number.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  // Pagination logic
  const totalPages = useMemo(() => Math.ceil(filteredStudents.length / PAGE_SIZE), [filteredStudents]);
  const startIdx = currentPage * PAGE_SIZE;
  const paginatedStudents = useMemo(() => filteredStudents.slice(startIdx, startIdx + PAGE_SIZE), [filteredStudents, startIdx]);

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [filteredStudents.length, totalPages, currentPage]);

  if (!teacher) return null;

  const handleAiAnalyze = async (file: File) => {
    setAnalyzingFile(true);
    setAiAnalysisResult(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/cbc/analyze-project", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAiAnalysisResult(res.data.analysis);
    } catch (err) {
      console.error("AI Analysis failed", err);
    } finally {
      setAnalyzingFile(false);
    }
  };

  const handleScoreChange = (studentId: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && (numValue < 0 || numValue > 100)) return;

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

    if (!teacher || !selectedAssignment) return;

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
    } catch (err: unknown) {
      const detail = (err as any).response?.data?.detail;
      setMessage(detail || "Submission failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4 text-black">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <BackButton />
        <h1 className="text-xl font-bold text-black" aria-level={1}>Enter Results</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Selector: Class & Subject */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm space-y-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Exam Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Class & Subject</label>
              <select
                aria-label="Select Class and Subject"
                className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm text-black focus:ring-2 focus:ring-blue-500 transition-all outline-none"
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
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Exam Type</label>
                <select
                  aria-label="Select Exam Type"
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm text-black focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                >
                  <option value="CAT">CAT</option>
                  <option value="EXAM">EXAM</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Term</label>
                <input
                  aria-label="Analysis Term"
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  placeholder="e.g. Term 1 2025"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Academic Year</label>
              <input
                aria-label="Academic Year"
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                placeholder="2025"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Search Student</label>
              <input
                aria-label="Search students by name or admission number"
                type="text"
                placeholder="Name or admission number..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* AI Assistant Module (New) */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">✨</div>
           <div className="relative z-10">
              <h2 className="text-sm font-black uppercase tracking-widest mb-4">AI CBC Project Assessor</h2>
              <div className="flex flex-col gap-4">
                 <p className="text-xs font-medium text-blue-100 leading-relaxed">
                    Upload a photo of a student's project. Our Intelligence engine will identify competencies and suggest a professional remark.
                 </p>
                 <div className="relative">
                    <input
                       type="file"
                       accept="image/*"
                       capture="environment"
                       onChange={(e) => e.target.files?.[0] && handleAiAnalyze(e.target.files[0])}
                       className="hidden"
                       id="cbc-upload"
                       disabled={analyzingFile}
                    />
                    <label
                       htmlFor="cbc-upload"
                       className={`flex items-center justify-center gap-3 w-full py-3 bg-white text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-blue-50 transition-all ${analyzingFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                       {analyzingFile ? "Analyzing Architecture..." : "📷 Analyze Student Work"}
                    </label>
                 </div>

                 {aiAnalysisResult && (
                    <div className="mt-2 p-4 bg-white/10 rounded-xl border border-white/20 animate-in zoom-in-95 duration-500">
                       <p className="text-[10px] font-black uppercase text-blue-200">AI Suggested Assessment</p>
                       <p className="text-sm font-bold mt-1">{aiAnalysisResult.competency}: {aiAnalysisResult.level}</p>
                       <p className="text-[10px] text-blue-100 italic mt-2 leading-tight">"{aiAnalysisResult.remark}"</p>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Real-time Visualization */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100" role="region" aria-label="Score Distribution Chart">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                 <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
                 <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Live Insights</h2>
              </div>
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">Distribution</span>
           </div>
           <div className="h-40 w-full min-h-[160px] min-w-0">
              <ResponsiveContainer width="100%" height="100%" minHeight={160} minWidth={0} debounce={50}>
                <BarChart data={distributionData} aria-label="Score Distribution Bar Chart">
                   <XAxis dataKey="name" hide />
                   <Tooltip
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '12px', border: 'none', fontSize: '12px', fontWeight: 'bold'}}
                   />
                   <Bar dataKey="count" radius={[4, 4, 0, 0]} aria-label="Count per score range">
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                   </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-4 flex justify-between text-[10px] font-bold text-gray-400 uppercase">
              <span>Fail</span>
              <span>Average</span>
              <span>Excellent</span>
           </div>
        </div>
      </div>

      {/* Students Table */}
      {isLoadingStudents ? (
        <div className="flex items-center justify-center py-20" aria-busy="true">
           <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredStudents.length > 0 ? (
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-4 border border-gray-100">
            <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 450px)" }}>
              <table className="w-full text-sm border-collapse" aria-label="Students results entry table">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="text-left p-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest border-b">Student</th>
                    <th className="w-28 p-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest border-b text-center">Score</th>
                    <th className="p-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest border-b">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedStudents.map((student) => {
                    const resultRow = results.find((r) => r.student_id === student.id);
                    if (!resultRow) return null;
                    const scoreNum = parseFloat(resultRow.score);
                    const scoreColor = isNaN(scoreNum) ? "bg-gray-100" :
                                     scoreNum < 40 ? "bg-red-100 text-red-600" :
                                     scoreNum < 70 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700";

                    return (
                      <tr key={student.id} className="hover:bg-blue-50/20 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-black text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{student.name}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{student.admission_number}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="relative">
                            <input
                              aria-label={`Score for ${student.name}`}
                              type="number"
                              value={resultRow.score}
                              onChange={(e) => handleScoreChange(student.id, e.target.value)}
                              className={`w-full border-none rounded-xl p-2.5 text-center text-sm font-black focus:ring-2 focus:ring-blue-500 outline-none transition-all ${scoreColor}`}
                              min="0"
                              max="100"
                              placeholder="-"
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          <input
                            aria-label={`Remarks for ${student.name}`}
                            type="text"
                            value={resultRow.remarks}
                            onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                            className="w-full bg-gray-50 border border-transparent rounded-xl p-2.5 text-sm text-gray-700 placeholder-gray-300 focus:bg-white focus:border-gray-200 focus:ring-0 outline-none transition-all"
                            placeholder="Add observation..."
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
            <nav className="flex items-center justify-between mb-6 px-2" aria-label="Pagination">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 0}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-white text-gray-600 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 disabled:opacity-30 transition-all"
              >
                <span>←</span> Previous
              </button>
              <div className="flex gap-1">
                 {Array.from({length: totalPages}).map((_, i) => (
                   <button
                      key={i}
                      type="button"
                      aria-current={currentPage === i ? "page" : undefined}
                      aria-label={`Go to page ${i + 1}`}
                      onClick={() => goToPage(i)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}
                   >
                      {i + 1}
                   </button>
                 ))}
              </div>
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-white text-gray-600 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 disabled:opacity-30 transition-all"
              >
                Next <span>→</span>
              </button>
            </nav>
          )}

          {message && (
            <div className={`p-4 rounded-2xl mb-6 text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 ${
              message.toLowerCase().includes("failed") ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"
            }`} role="alert">
              <div className={`h-2 w-2 rounded-full ${message.toLowerCase().includes("failed") ? "bg-red-500" : "bg-emerald-500"}`}></div>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-blue-600 shadow-xl hover:shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-gray-900"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                 <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 <span>PROCESSING...</span>
              </div>
            ) : "SUBMIT RESULTS"}
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
           <div className="text-4xl mb-4">🔍</div>
           <h3 className="text-xl font-bold text-gray-900 mb-1">No matching students</h3>
           <p className="text-gray-400 text-sm">Check your search query or class selection.</p>
        </div>
      )}
    </div>
  );
}
