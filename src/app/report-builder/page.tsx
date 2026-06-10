"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Template {
  id: string;
  name: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  show_attendance: boolean;
  show_fee_status: boolean;
  show_teacher_remarks: boolean;
  show_overall_evaluation: boolean;
  created_at: string;
  updated_at: string;
}

export default function ReportBuilderPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [schoolId, setSchoolId] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "Default Template",
    logo_url: "",
    primary_color: "#1e3a8a",
    secondary_color: "#f0f4ff",
    show_attendance: true,
    show_fee_status: true,
    show_teacher_remarks: true,
    show_overall_evaluation: true,
  });

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
    if (!t.is_premium) {
      alert("Custom report card builder is a premium feature. Please upgrade to access.");
      router.push("/dashboard");
      return;
    }
    setTeacher(t);
    setSchoolId(t.school_id);
    fetchTemplates(t.school_id);
  }, [router]);

  const fetchTemplates = async (sid: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/report-builder/${sid}`);
      setTemplates(res.data || []);
    } catch (err) {
      setMessage("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({
      name: "",
      logo_url: "",
      primary_color: "#1e3a8a",
      secondary_color: "#f0f4ff",
      show_attendance: true,
      show_fee_status: true,
      show_teacher_remarks: true,
      show_overall_evaluation: true,
    });
    setShowForm(true);
  };

  const openEdit = (t: Template) => {
    setEditingId(t.id);
    setForm({
      name: t.name,
      logo_url: t.logo_url,
      primary_color: t.primary_color,
      secondary_color: t.secondary_color,
      show_attendance: t.show_attendance,
      show_fee_status: t.show_fee_status,
      show_teacher_remarks: t.show_teacher_remarks,
      show_overall_evaluation: t.show_overall_evaluation,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      if (editingId) {
        await api.put(`/report-builder/${schoolId}/${editingId}`, form);
        setMessage("Template updated.");
      } else {
        await api.post(`/report-builder/${schoolId}`, form);
        setMessage("Template created.");
      }
      setShowForm(false);
      fetchTemplates(schoolId);
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Error saving template");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    await api.delete(`/report-builder/${schoolId}/${id}`);
    fetchTemplates(schoolId);
  };

  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">Report Card Builder</h1>
          <button onClick={() => router.back()} className="text-gray-500 text-sm">
            ← Back
          </button>
        </div>

        <button
          onClick={openCreate}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
        >
          + New Template
        </button>

        {message && (
          <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm text-gray-700">
            {message}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-400 py-10">Loading templates…</p>
        ) : templates.length === 0 && !showForm ? (
          <p className="text-center text-gray-400 py-10">
            No templates yet. Create one to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {templates.map((t) => (
              <div
                key={t.id}
                className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold">{t.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <span
                      className="w-5 h-5 rounded-full border"
                      style={{ backgroundColor: t.primary_color }}
                    ></span>
                    <span
                      className="w-5 h-5 rounded-full border"
                      style={{ backgroundColor: t.secondary_color }}
                    ></span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(t)} className="text-sm text-blue-600">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-sm text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-lg font-bold mb-4">
                {editingId ? "Edit Template" : "New Template"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Template Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border rounded-lg p-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Logo URL</label>
                  <input
                    type="url"
                    value={form.logo_url}
                    onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                    className="w-full border rounded-lg p-2 text-sm"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Primary Color</label>
                    <input
                      type="color"
                      value={form.primary_color}
                      onChange={(e) =>
                        setForm({ ...form, primary_color: e.target.value })
                      }
                      className="w-full h-10 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Secondary Color</label>
                    <input
                      type="color"
                      value={form.secondary_color}
                      onChange={(e) =>
                        setForm({ ...form, secondary_color: e.target.value })
                      }
                      className="w-full h-10 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { key: "show_attendance", label: "Attendance Section" },
                    { key: "show_fee_status", label: "Fee Status Section" },
                    { key: "show_teacher_remarks", label: "Subject Teacher Remarks" },
                    { key: "show_overall_evaluation", label: "Overall Evaluation" },
                  ].map((opt) => (
                    <label key={opt.key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={(form as any)[opt.key]}
                        onChange={(e) =>
                          setForm({ ...form, [opt.key]: e.target.checked })
                        }
                        className="rounded"
                      />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-semibold"
                  >
                    {editingId ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}