"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotificationBell from "@/components/NotificationBell";
import api from "@/lib/api";
import StudentSearch from "@/components/StudentSearch";

interface Student {
  id: string;
  name: string;
  admission_number: string;
  class_id: string;
  class_name: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (!stored) {
      router.push("/login");
      return;
    }
    const t = JSON.parse(stored);
    setTeacher(t);
    // Fetch assigned students
    api
      .get(`/teachers/${t.teacher_id}/students`)
      .then((res) => setStudents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("teacher");
    router.push("/login");
  };

  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Welcome, {teacher.name}
          </h1>
          <p className="text-sm text-gray-500">{teacher.school_name}</p>
        </div>
        <div className="flex items-center gap-4">
          <StudentSearch />
          <NotificationBell schoolId={teacher.school_id} teacherId={teacher.teacher_id} />
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {[
          { label: "Enter Results", href: "/results/enter" },
          { label: "Take Attendance", href: "/attendance" },
          { label: "View Analytics", href: "/analytics" },
          { label: "Risk Alerts", href: "/risk" },
          { label: "Report Cards", href: "/reports" },
          { label: "Fees", href: "/fees" },
          { label: "Teacher Analytics", href: "/analytics/teachers" },
          { label: "Headteacher Dashboard", href: "/headteacher/dashboard" },
          { label: "Class Teacher Hub", href: "/class-teacher" },
          { label: "Dean Dashboard", href: "/dean" },
          { label: "Assign Teacher", href: "/assign" },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => router.push(action.href)}
            className="p-3 bg-white rounded-xl shadow-sm text-center text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Student List */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Your Students ({students.length})
      </h2>
      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading…</div>
      ) : students.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          No students assigned yet.
        </div>
      ) : (
        <div className="space-y-2">
          {students.map((s) => (
            <div
              key={s.id}
              className="bg-white p-3 rounded-xl shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-800">{s.name}</p>
                <p className="text-xs text-gray-500">
                  {s.admission_number} · {s.class_name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}