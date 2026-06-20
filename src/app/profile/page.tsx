"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface TeacherProfile {
  teacher: {
    id: string;
    name: string;
    teacher_code: string;
    role: string;
    phone: string;
    school_name: string;
  };
  assignments: {
    class_name: string;
    subject_name: string;
    is_class_teacher: boolean;
  }[];
  timetable: {
    day_of_week: string;
    start_time: string;
    end_time: string;
    subjects: { name: string } | null;
  }[];
}

import { useAuthStore } from "@/lib/store";

export default function TeacherProfilePage() {
  const router = useRouter();
  const { user: teacher } = useAuthStore();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Phone editing
  const [editingPhone, setEditingPhone] = useState(false);
  const [phone, setPhone] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);

  useEffect(() => {
    if (!teacher) {
      router.push("/login");
      return;
    }
    fetchProfile(teacher.teacher_id);
  }, [teacher, router]);

  if (!teacher) return null;

  const fetchProfile = async (teacherId: string) => {
    try {
      const res = await api.get(`/teachers/${teacherId}/profile`);
      setProfile(res.data);
      setPhone(res.data.teacher.phone || "");
    } catch (err: any) {
      setMessage("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePhone = async () => {
    if (!teacher) return;
    setSavingPhone(true);
    try {
      await api.put(`/teachers/${teacher.teacher_id}/phone`, { phone });
      setEditingPhone(false);
      fetchProfile(teacher.teacher_id);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to update phone");
    } finally {
      setSavingPhone(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
          <button onClick={() => router.back()} className="text-gray-500 text-sm">
            ← Back
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-10">Loading profile…</p>
        ) : message ? (
          <p className="text-center text-red-500 py-10">{message}</p>
        ) : profile ? (
          <div className="space-y-4">
            {/* Basic Info Card */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h2 className="font-semibold text-gray-800 mb-3">Personal Information</h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="text-gray-500">Name:</span> {profile.teacher.name}</p>
                <p><span className="text-gray-500">Code:</span> <span className="font-mono">{profile.teacher.teacher_code}</span></p>
                <p><span className="text-gray-500">Role:</span> <span className="capitalize">{profile.teacher.role}</span></p>
                <p><span className="text-gray-500">School:</span> {profile.teacher.school_name}</p>
                <p>
                  <span className="text-gray-500">Phone:</span>{" "}
                  {editingPhone ? (
                    <span className="inline-flex gap-2 items-center">
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="border rounded p-1 text-sm w-36"
                      />
                      <button
                        onClick={handleSavePhone}
                        disabled={savingPhone}
                        className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPhone(false)}
                        className="text-xs text-gray-500"
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <>
                      {profile.teacher.phone || "Not set"}{" "}
                      <button
                        onClick={() => setEditingPhone(true)}
                        className="text-xs text-blue-600 ml-1"
                      >
                        Edit
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Assignments */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h2 className="font-semibold text-gray-800 mb-3">My Classes & Subjects</h2>
              {profile.assignments.length === 0 ? (
                <p className="text-sm text-gray-400">No assignments yet.</p>
              ) : (
                <ul className="space-y-2">
                  {profile.assignments.map((a, i) => (
                    <li key={i} className="flex justify-between text-sm border-b pb-1">
                      <span>{a.class_name} – {a.subject_name}</span>
                      {a.is_class_teacher && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                          Class Teacher
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Timetable */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h2 className="font-semibold text-gray-800 mb-3">My Timetable</h2>
              {profile.timetable.length === 0 ? (
                <p className="text-sm text-gray-400">No timetable entries.</p>
              ) : (
                <div className="space-y-2">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => {
                    const entries = profile.timetable.filter((e) => e.day_of_week === day);
                    if (entries.length === 0) return null;
                    return (
                      <div key={day}>
                        <p className="text-xs font-medium text-gray-500 mb-1">{day}</p>
                        {entries.map((e, i) => (
                          <div key={i} className="flex justify-between text-sm pl-2">
                            <span>{e.subjects?.name || "—"}</span>
                            <span className="text-gray-400">
                              {e.start_time?.slice(0, 5)} – {e.end_time?.slice(0, 5)}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}