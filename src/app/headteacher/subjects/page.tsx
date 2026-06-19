"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import BackButton from "@/components/BackButton";

interface Subject {
  id: string;
  name: string;
}

export default function ManageSubjectsPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);
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
    fetchSubjects(t.school_id);
  }, []);

  if (!teacher) return null;

  const fetchSubjects = async (schoolId: string) => {
    setLoading(true);
    try {
      const res = await api.get("/subjects", { params: { school_id: schoolId } });
      setSubjects(res.data || []);
    } catch (err) {
      console.error("Failed to fetch subjects", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    setMessage("");
    try {
      const res = await api.post("/subjects/", {
        name: newSubjectName.trim(),
        school_id: teacher.school_id,
      });
      setSubjects([...subjects, res.data]);
      setNewSubjectName("");
      setMessage("Subject added successfully");
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Failed to add subject");
    }
  };

  const handleEdit = (s: Subject) => {
    setEditingId(s.id);
    setEditName(s.name);
  };

  const handleUpdate = async () => {
    if (!editingId || !editName.trim()) return;
    try {
      const res = await api.put(`/subjects/${editingId}`, { name: editName.trim() });
      setSubjects(subjects.map((s) => (s.id === editingId ? res.data : s)));
      setEditingId(null);
      setMessage("Subject updated");
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will fail if results or assignments are linked.")) return;
    try {
      await api.delete(`/subjects/${id}`);
      setSubjects(subjects.filter((s) => s.id !== id));
      setMessage("Subject deleted");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Delete failed");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <BackButton />
          <h1 className="text-xl font-bold text-gray-800">Manage Subjects</h1>
        </div>

        {/* Add New Subject */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Add New Subject</h2>
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="e.g. Music"
              className="flex-1 border rounded-lg p-2 text-sm text-black"
              required
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Add
            </button>
          </form>
        </div>

        {/* Subjects List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {subjects.map((s) => (
                <li key={s.id} className="p-4 flex items-center justify-between">
                  {editingId === s.id ? (
                    <div className="flex gap-2 w-full">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 border rounded p-1 text-sm text-black"
                      />
                      <button onClick={handleUpdate} className="text-green-600 text-xs font-bold">Save</button>
                      <button onClick={() => setEditingId(null)} className="text-gray-400 text-xs">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <span className="text-gray-800 font-medium">{s.name}</span>
                      <div className="flex gap-3">
                        <button onClick={() => handleEdit(s)} className="text-blue-600 text-xs">Edit</button>
                        <button onClick={() => handleDelete(s.id)} className="text-red-500 text-xs">Delete</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
              {subjects.length === 0 && (
                <li className="p-8 text-center text-gray-400 italic">No subjects defined</li>
              )}
            </ul>
          )}
        </div>

        {message && (
          <p className={`mt-4 text-center text-sm ${message.includes("failed") || message.includes("Cannot") ? "text-red-600" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
