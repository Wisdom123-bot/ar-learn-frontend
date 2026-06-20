"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import BackButton from "@/components/BackButton";

interface Template {
  id: string;
  name: string;
  logo_url: string;
  motto: string;
  phone: string;
  email: string;
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
    motto: "",
    phone: "",
    email: "",
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
      motto: "",
      phone: "",
      email: "",
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
      motto: t.motto || "",
      phone: t.phone || "",
      email: t.email || "",
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-black">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Report Card Builder</h1>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Premium Intelligence Suite</p>
          </div>
          <BackButton />
        </div>

        <button
          onClick={openCreate}
          className="mb-8 px-6 py-3 bg-gray-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 shadow-xl transition-all active:scale-95"
        >
          + New Template
        </button>

        {message && (
          <div className={`mb-6 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
            message.toLowerCase().includes("error") || message.toLowerCase().includes("failed")
              ? "bg-red-50 text-red-600 border border-red-100"
              : "bg-emerald-50 text-emerald-700 border border-emerald-100"
          }`}>
            <div className={`h-2 w-2 rounded-full ${message.toLowerCase().includes("error") ? "bg-red-500" : "bg-emerald-500"}`}></div>
            {message}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Architecture...</p>
          </div>
        ) : templates.length === 0 && !showForm ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-gray-100 shadow-sm">
            <div className="text-6xl mb-6">📄</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">No active templates</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">Build your first custom report card template to start issuing professional documents.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((t) => (
              <div
                key={t.id}
                className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-blue-200 transition-all"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                     <h3 className="text-lg font-black text-gray-900 leading-tight">{t.name}</h3>
                     <div className="flex -space-x-2">
                        <span
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: t.primary_color }}
                        ></span>
                        <span
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: t.secondary_color }}
                        ></span>
                     </div>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Last Modified</p>
                  <p className="text-xs font-medium text-gray-600 mb-6">{new Date(t.updated_at).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(t)}
                    className="flex-1 py-3 bg-gray-50 text-blue-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                  >
                    Configure
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="px-4 py-3 bg-gray-50 text-red-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8 md:p-10">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">
                    {editingId ? "Modify Template" : "New Architecture"}
                  </h2>
                  <button onClick={() => setShowForm(false)} className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-900 transition-all">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Identity Section */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Institutional Identity</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1">Template Label</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="e.g. End of Term 1"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1">School Motto</label>
                        <input
                          type="text"
                          value={form.motto}
                          onChange={(e) => setForm({ ...form, motto: e.target.value })}
                          className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Strive for Excellence"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1">
                        Logo URL
                        <span className="ml-2 lowercase font-medium text-gray-300 tracking-normal">(PNG/JPG/SVG, transparent bg recommended)</span>
                      </label>
                      <input
                        type="url"
                        value={form.logo_url}
                        onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="https://your-school.com/logo.png"
                      />
                      <p className="mt-2 text-[10px] text-gray-400 leading-relaxed font-medium italic">
                        Tip: Upload your logo to a service like PostImages or ImgBB and paste the direct link here. Use high-resolution images for crisp printing.
                      </p>
                    </div>
                  </div>

                  {/* Communication Section */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Communication Interface</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1">Contact Phone</label>
                        <input
                          type="text"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="+254 700 000 000"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1">Official Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="info@school.ac.ke"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Aesthetic Section */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Visual Signature</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-500 uppercase">Primary</label>
                        <input
                          type="color"
                          value={form.primary_color}
                          onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                          className="h-10 w-10 border-none rounded-lg cursor-pointer bg-transparent"
                        />
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-500 uppercase">Secondary</label>
                        <input
                          type="color"
                          value={form.secondary_color}
                          onChange={(e) => setForm({ ...form, secondary_color: e.target.value })}
                          className="h-10 w-10 border-none rounded-lg cursor-pointer bg-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Structure Section */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Data Matrix</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { key: "show_attendance", label: "Attendance Metrics" },
                        { key: "show_fee_status", label: "Financial Status" },
                        { key: "show_teacher_remarks", label: "Professional Remarks" },
                        { key: "show_overall_evaluation", label: "AI Executive Summary" },
                      ].map((opt) => (
                        <label key={opt.key} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-blue-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={(form as any)[opt.key]}
                            onChange={(e) => setForm({ ...form, [opt.key]: e.target.checked })}
                            className="h-5 w-5 rounded-lg border-gray-200 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-gray-100">
                    <button
                      type="submit"
                      className="flex-1 py-5 bg-gray-900 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-blue-600 shadow-2xl transition-all active:scale-95"
                    >
                      {editingId ? "Update System" : "Initialize Template"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-8 py-5 bg-gray-100 text-gray-400 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-gray-200 hover:text-gray-900 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
