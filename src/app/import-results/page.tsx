"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface ClassItem {
  id: string;
  name: string;
}

export default function ImportResultsPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [schoolId, setSchoolId] = useState("");
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (!stored) {
      router.push("/login");
      return;
    }
    const t = JSON.parse(stored);
    if (t.role !== "dean" && t.role !== "headteacher") {
      router.push("/dashboard");
      return;
    }
    setTeacher(t);
    setSchoolId(t.school_id);
    // Fetch school classes
    api.get(`/schools/${t.school_id}/classes`).then((res) => {
      setClasses(res.data || []);
    }).catch(() => {});
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a CSV or Excel file.");
      return;
    }
    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("school_id", schoolId);
    formData.append("teacher_id", teacher.teacher_id);
    formData.append("file", file);
    if (selectedClass) {
      formData.append("class_id", selectedClass);
    }
    try {
      const res = await api.post("/import/results", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message || "Import successful!");
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Import failed");
    } finally {
      setLoading(false);
    }
  };

  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.back()} className="text-gray-500">← Back</button>
          <h1 className="text-xl font-bold text-gray-800">Import Historical Results</h1>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
          <p className="text-sm text-gray-600">
            Upload a CSV or Excel file containing previous term results for analysis. 
            The file should include columns: <span className="font-mono">admission_number</span>, <span className="font-mono">subject</span>, <span className="font-mono">score</span>, <span className="font-mono">exam_type</span>, <span className="font-mono">term</span>, <span className="font-mono">academic_year</span>.
          </p>
          
          <button 
            onClick={() => setShowHelp(!showHelp)}
            className="text-sm text-blue-600 underline"
          >
            {showHelp ? "Hide example" : "Show example"}
          </button>
          
          {showHelp && (
            <div className="bg-gray-100 p-3 rounded-lg text-xs font-mono">
              <p className="font-semibold mb-1">Example CSV:</p>
              <pre>
{`admission_number,subject,score,exam_type,term,academic_year
ADM001,Mathematics,78,EXAM,Term 3 2024,2024
ADM001,English,65,EXAM,Term 3 2024,2024
ADM002,Mathematics,82,EXAM,Term 3 2024,2024`}
              </pre>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Class (optional – limits import to one class)</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
            >
              <option value="">All classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">File (CSV or Excel)</label>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.includes("failed") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
              {message}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Importing..." : "Import Results"}
          </button>
        </div>
      </div>
    </div>
  );
}