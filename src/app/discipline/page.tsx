"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import BackButton from "@/components/BackButton";

interface DisciplineRecord {
  id: string;
  student_id: string;
  student_name: string;
  class_id: string;
  class_name: string;
  teacher_name: string;
  incident_date: string;
  category: string;
  description: string;
  action_taken: string;
}

interface Student {
  id: string;
  name: string;
}

interface ClassItem {
  id: string;
  name: string;
}

export default function DisciplinePage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [schoolId, setSchoolId] = useState("");
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [records, setRecords] = useState<DisciplineRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Add form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    student_id: "",
    incident_date: new Date().toISOString().split("T")[0],
    category: "Minor",
    description: "",
    action_taken: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (!stored) {
      router.push("/login");
      return;
    }
    const t = JSON.parse(stored);
    setTeacher(t);
    setSchoolId(t.school_id);
    // Fetch classes the teacher is assigned to
    api.get(`/schools/${t.school_id}/classes`).then((res) => {
      setClasses(res.data || []);
      if (res.data.length > 0) {
        setSelectedClassId(res.data[0].id);
      }
    }).catch(() => {});
  }, [router]);

  if (!teacher) return null;

  // Load students when class changes
  useEffect(() => {
    if (!teacher || !selectedClassId) return;
    // Get students in class
    api.get(`/teachers/${teacher.teacher_id}/students`).then((res) => {
      const classStudents = res.data.filter((s: any) => s.class_id === selectedClassId);
      setStudents(classStudents);
    }).catch(() => setStudents([]));
    // Load discipline records for this class
    loadRecords(selectedClassId);
  }, [selectedClassId, teacher]);

  const loadRecords = async (classId: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/discipline/class/${classId}`);
      setRecords(res.data || []);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.student_id || !form.description) {
      setMessage("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      await api.post("/discipline/record", {
        student_id: form.student_id,
        class_id: selectedClassId,
        teacher_id: teacher.teacher_id,
        incident_date: form.incident_date,
        category: form.category,
        description: form.description,
        action_taken: form.action_taken,
      });
      setMessage("Record added successfully.");
      setShowForm(false);
      setForm({
        student_id: "",
        incident_date: new Date().toISOString().split("T")[0],
        category: "Minor",
        description: "",
        action_taken: "",
      });
      loadRecords(selectedClassId);
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Failed to add record.");
    } finally {
      setSubmitting(false);
    }
  };

  const categoryColor = (cat: string) => {
    if (cat === "Positive") return "bg-green-100 text-green-800";
    if (cat === "Major") return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <h1 className="text-xl font-bold text-gray-800">Discipline Records</h1>
        </div>

        {/* Class selector */}
        <div className="flex gap-2 mb-4">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="flex-1 border rounded-lg p-2 text-sm"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
          >
            {showForm ? "Cancel" : "+ Add"}
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-sm mb-4 space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Student</label>
              <select
                value={form.student_id}
                onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                className="w-full border rounded-lg p-2 text-sm"
                required
              >
                <option value="">Select student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={form.incident_date}
                  onChange={(e) => setForm({ ...form, incident_date: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm"
                >
                  <option value="Minor">Minor</option>
                  <option value="Major">Major</option>
                  <option value="Positive">Positive</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border rounded-lg p-2 text-sm"
                rows={2}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Action Taken (optional)</label>
              <input
                type="text"
                value={form.action_taken}
                onChange={(e) => setForm({ ...form, action_taken: e.target.value })}
                className="w-full border rounded-lg p-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-semibold"
            >
              {submitting ? "Saving..." : "Save Record"}
            </button>
            {message && <p className="text-sm text-center text-gray-600">{message}</p>}
          </form>
        )}

        {/* Records list */}
        {loading ? (
          <p className="text-center text-gray-400 py-10">Loading...</p>
        ) : records.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No discipline records found.</p>
        ) : (
          <div className="space-y-3">
            {records.map((r) => (
              <div key={r.id} className="bg-white p-3 rounded-xl shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{r.student_name}</p>
                    <p className="text-xs text-gray-500">{r.incident_date} · {r.teacher_name}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColor(r.category)}`}>
                    {r.category}
                  </span>
                </div>
                <p className="text-sm mt-1">{r.description}</p>
                {r.action_taken && (
                  <p className="text-xs text-gray-500 mt-1">Action: {r.action_taken}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}