"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface TeacherItem {
  id: string;
  name: string;
  teacher_code: string;
  role: string;
}

interface ClassItem {
  id: string;
  name: string;
}

interface SubjectItem {
  id: string;
  name: string;
}

interface AssignmentRow {
  class_id: string;
  subject_id: string;
  is_class_teacher: boolean;
}

export default function AssignTeacherPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);       // logged‑in user
  const [schoolId, setSchoolId] = useState("");
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [assignments, setAssignments] = useState<AssignmentRow[]>([
    { class_id: "", subject_id: "", is_class_teacher: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    setSchoolId(t.school_id);

    // Fetch school's teachers, classes, subjects
    Promise.all([
      api.get(`/schools/${t.school_id}/teachers`),
      api.get(`/schools/${t.school_id}/classes`),
      api.get("/subjects", { params: { school_id: t.school_id } }),
    ]).then(([teachersRes, classesRes, subjectsRes]) => {
      setTeachers(teachersRes.data || []);
      setClasses(classesRes.data || []);
      setSubjects(subjectsRes.data || []);
    }).catch(console.error);
  }, [router]);

  if (!teacher) return null;

  const addRow = () => {
    setAssignments([...assignments, { class_id: "", subject_id: "", is_class_teacher: false }]);
  };

  const removeRow = (index: number) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };

 const updateRow = <K extends keyof AssignmentRow>(
  index: number,
  field: K,
  value: AssignmentRow[K]
) => {
  const updated = [...assignments];
  updated[index][field] = value;
  setAssignments(updated);
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherId) {
      setMessage("Please select a teacher.");
      return;
    }
    const validAssignments = assignments.filter(a => a.class_id && a.subject_id);
    if (validAssignments.length === 0) {
      setMessage("Add at least one class/subject assignment.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      await api.put(`/teachers/${selectedTeacherId}/assign`, {
        assignments: validAssignments,
      });
      setMessage("Assignments saved successfully!");
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Failed to save assignments");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.back()} className="text-gray-500">← Back</button>
          <h1 className="text-xl font-bold text-gray-800">Assign Teacher</h1>
        </div>

        {/* Select Teacher */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
          <label className="block text-sm font-medium mb-1">Select Teacher</label>
          <select
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm"
          >
            <option value="">-- Choose a teacher --</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.teacher_code}) – {t.role}
              </option>
            ))}
          </select>
        </div>

        {/* Assignment Rows */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-sm">Class & Subject Assignments</h2>
              <button type="button" onClick={addRow} className="text-xs text-blue-600 font-medium">+ Add Row</button>
            </div>
            {assignments.map((row, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-start">
                <div className="flex-1">
                  <select
                    value={row.class_id}
                    onChange={(e) => updateRow(idx, "class_id", e.target.value)}
                    className="w-full border rounded-lg p-2 text-sm"
                  >
                    <option value="">Class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <select
                    value={row.subject_id}
                    onChange={(e) => updateRow(idx, "subject_id", e.target.value)}
                    className="w-full border rounded-lg p-2 text-sm"
                  >
                    <option value="">Subject</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-1 pt-1">
                  <input
                    type="checkbox"
                    checked={row.is_class_teacher}
                    onChange={(e) => updateRow(idx, "is_class_teacher", e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-xs text-gray-600">Class Teacher?</span>
                </div>
                {assignments.length > 1 && (
                  <button type="button" onClick={() => removeRow(idx)} className="text-red-500 text-xs pt-2">✕</button>
                )}
              </div>
            ))}
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.includes("failed") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Assignments"}
          </button>
        </form>
      </div>
    </div>
  );
}