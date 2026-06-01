"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface School {
  id: string;
  name: string;
}

interface ClassItem {
  id: string;
  name: string;
}

export default function ImportStudentsPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [file, setFile] = useState<File | null>(null);
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
    // Fetch schools (for simplicity, we'll assume we need at least the teacher's school)
    // In a real admin panel, we'd fetch all schools; for now, just set teacher's school
    // But we can still load all schools if the teacher is headteacher.
    // We'll just fetch the teacher's own school and set it as default.
    if (t.school_id) {
      setSelectedSchool(t.school_id);
      fetchClasses(t.school_id);
      // Also set schools list with at least this school (we can fetch a single school)
      api.get(`/schools/${t.school_id}`).catch(() => {});
      // For now, we'll just hardcode or use a generic approach: we'll put a placeholder if needed.
      // Ideally we'd have a GET /schools endpoint; we'll quickly add one to the backend.
      // But to keep moving, we'll use a manual list or show a message.
      // Let's just assume the teacher's school is the only one they can import to.
    }
  }, [router]);

  const fetchClasses = async (schoolId: string) => {
    // Need a GET /schools/{school_id}/classes endpoint. 
    // For now, we'll query classes directly from the backend via a quick addition:
    // If not available, we can simulate with a generic endpoint. 
    // I'll add a small backend route later. For now, we'll skip class loading and just use a text input for class ID? 
    // Better: we'll add the endpoint now in instructions.
    // We'll proceed with the page assuming we have a GET /schools/{schoolId}/classes.
    try {
      const res = await api.get(`/schools/${schoolId}/classes`);
      setClasses(res.data);
    } catch {
      setClasses([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedSchool || !selectedClass) {
      setMessage("Please fill all fields and select a file.");
      return;
    }
    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("school_id", selectedSchool);
    formData.append("class_id", selectedClass);
    formData.append("file", file);
    try {
      const res = await api.post("/import/students", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message || "Import successful");
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Import failed");
    } finally {
      setLoading(false);
    }
  };

  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-500">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-gray-800">Import Students</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* School selection (readonly if only one) */}
        <div>
          <label className="block text-sm font-medium mb-1">School</label>
          <input
            type="text"
            value={teacher.school_name || selectedSchool}
            readOnly
            className="w-full border rounded-lg p-2 text-sm bg-gray-100"
          />
          <p className="text-xs text-gray-400 mt-1">
            You can only import to your assigned school.
          </p>
        </div>

        {/* Class selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm"
            required
          >
            <option value="">Select a class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* File upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Upload File (PDF, Excel, CSV)
          </label>
          <input
            type="file"
            accept=".pdf,.xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="w-full border rounded-lg p-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-400 mt-1">
            Names should appear in the first column of Excel/CSV, or as plain text lines in PDF.
          </p>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.toLowerCase().includes("failed") || message.toLowerCase().includes("error")
                ? "bg-red-50 text-red-600"
                : "bg-green-50 text-green-600"
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Importing..." : "Start Import"}
        </button>
      </form>
    </div>
  );
}