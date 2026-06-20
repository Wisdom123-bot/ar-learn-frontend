"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Teacher {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
}

interface ClassItem {
  id: string;
  name: string;
}

interface TimetableEntry {
  id: string;
  class_id: string;
  class_name: string;
  subject_name: string;
  teacher_name: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

import { useAuthStore } from "@/lib/store";

export default function TimetablePage() {
  const router = useRouter();
  const { user: teacher } = useAuthStore();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [viewType, setViewType] = useState<"class" | "teacher">("class");
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Add form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    subject_id: "",
    teacher_id: "",
    day_of_week: "Monday",
    start_time: "08:00",
    end_time: "08:40",
  });

  useEffect(() => {
    if (!teacher) {
      router.push("/login");
      return;
    }
    if (teacher.school_id) {
      api.get(`/schools/${teacher.school_id}/classes`).then((res) => {
        const classes = res.data || [];
        setClasses(classes);
        if (classes.length > 0 && !selectedClass) {
          setSelectedClass(classes[0].id);
        }
      }).catch(() => {});
      // Fetch school's teachers
      api.get(`/schools/${teacher.school_id}/teachers`).then((res) => {
        const teachers = res.data || [];
        setTeachers(teachers);
        if (!selectedTeacher) {
          setSelectedTeacher(teacher.teacher_id);
        }
      }).catch(() => {});
      // Fetch subjects
      api.get("/subjects", { params: { school_id: teacher.school_id } }).then((res) => setSubjects(res.data || [])).catch(() => {});
    }
  }, [teacher, router, selectedClass, selectedTeacher]);

  useEffect(() => {
    if (viewType === "class" && !selectedClass) return;
    if (viewType === "teacher" && !selectedTeacher) return;

    setLoading(true);
    const endpoint = viewType === "class"
      ? `/timetable/class/${selectedClass}`
      : `/timetable/teacher/${selectedTeacher}`;

    api.get(endpoint)
      .then((res) => setTimetable(res.data))
      .catch((err) => {
        console.error("Timetable fetch failed:", err);
        setTimetable([]);
      })
      .finally(() => setLoading(false));
  }, [selectedClass, selectedTeacher, viewType]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !form.subject_id || !form.teacher_id) return;
    const payload = {
      school_id: teacher?.school_id,
      entries: [
        {
          class_id: selectedClass,
          subject_id: form.subject_id,
          teacher_id: form.teacher_id || teacher?.teacher_id,
          day_of_week: form.day_of_week,
          start_time: form.start_time,
          end_time: form.end_time,
        },
      ],
    };
    try {
      const res = await api.post("/timetable/bulk", payload);
      setMessage(res.data.message || "Entry added");
      setShowForm(false);
      // Refresh timetable
      if (viewType === "class" && selectedClass) {
        api.get(`/timetable/class/${selectedClass}`).then((r) => setTimetable(r.data));
      } else if (viewType === "teacher" && selectedTeacher) {
        api.get(`/timetable/teacher/${selectedTeacher}`).then((r) => setTimetable(r.data));
      }
    } catch (err: unknown) {
      const detail = (err as any).response?.data?.detail;
      setMessage(detail || "Failed to add entry");
    }
  };

  const handleDelete = async (entryId: string) => {
    try {
      await api.delete(`/timetable/${entryId}`);
      setTimetable((prev) => prev.filter((e) => e.id !== entryId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Group by day
  const grouped: Record<string, TimetableEntry[]> = {};
  DAYS.forEach((d) => (grouped[d] = []));
  timetable.forEach((e) => grouped[e.day_of_week]?.push(e));
  // Sort each day by start_time
  Object.values(grouped).forEach((entries) =>
    entries.sort((a, b) => a.start_time.localeCompare(b.start_time))
  );


  const handleDownloadPDF = () => {
    const id = viewType === "class" ? selectedClass : selectedTeacher;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/timetable/pdf/${viewType}/${id}`;
    window.open(url, "_blank");
  };

  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-gray-500">
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-800">School Timetable</h1>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition"
        >
          📄 Download PDF
        </button>
      </div>

      {/* View switcher */}
      <div className="flex gap-2 mb-4 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
         <button
            onClick={() => setViewType("class")}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition ${viewType === "class" ? "bg-gray-900 text-white shadow-md" : "text-gray-400 hover:bg-gray-50"}`}
         >
            Class View
         </button>
         <button
            onClick={() => setViewType("teacher")}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition ${viewType === "teacher" ? "bg-gray-900 text-white shadow-md" : "text-gray-400 hover:bg-gray-50"}`}
         >
            Teacher View
         </button>
      </div>

      {/* Selectors */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {viewType === "class" ? (
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm font-bold text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Select Teacher</label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm font-bold text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Weekly view */}
      {loading ? (
        <p className="text-center text-gray-400 py-8">Loading...</p>
      ) : (
        <div className="space-y-4">
          {DAYS.map((day) => (
            <div key={day} className="bg-white rounded-xl shadow-sm p-3">
              <h3 className="font-semibold text-gray-700 mb-2">{day}</h3>
              {grouped[day].length === 0 ? (
                <p className="text-sm text-gray-400">No lessons</p>
              ) : (
                <ul className="space-y-2">
                  {grouped[day].map((entry) => (
                    <li
                      key={entry.id}
                      className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-2xl border border-gray-100"
                    >
                      <div>
                        <p className="font-black text-gray-900">{entry.subject_name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                           {entry.start_time.slice(0,5)} – {entry.end_time.slice(0,5)} • {viewType === "class" ? entry.teacher_name : entry.class_name}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="h-8 w-8 flex items-center justify-center bg-white border border-gray-100 text-red-400 rounded-xl hover:text-red-600 shadow-sm transition"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add entry button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="mt-4 w-full py-2.5 border border-blue-500 text-blue-600 rounded-lg font-medium text-sm"
      >
        {showForm ? "Cancel" : "+ Add Lesson"}
      </button>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 bg-white p-4 rounded-xl shadow-sm space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <select
              value={form.subject_id}
              onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
              className="w-full border rounded-lg p-2 text-sm"
              required
            >
              <option value="">Choose...</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          {/* Since we may not have teacher list, we'll just use the current teacher ID */}
          <input type="hidden" value={form.teacher_id || teacher.teacher_id} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Day</label>
              <select
                value={form.day_of_week}
                onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}
                className="w-full border rounded-lg p-2 text-sm"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Start</label>
                <input
                  type="time"
                  value={form.start_time}
                  onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">End</label>
                <input
                  type="time"
                  value={form.end_time}
                  onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm"
                  required
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-semibold"
          >
            Save Lesson
          </button>
        </form>
      )}

      {message && (
        <p className={`mt-3 text-sm p-2 rounded-lg ${message.includes("Failed") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}