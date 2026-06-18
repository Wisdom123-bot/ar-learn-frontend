"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NotificationBell from "@/components/NotificationBell";
import api from "@/lib/api";
import StudentSearch from "@/components/StudentSearch";
import OnboardingTour from "@/components/OnboardingTour";

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

  const onboardingSteps = [
    { target: "#quick-actions", title: "Quick Actions", content: "Access all your essential tools like Results Entry and Attendance here.", position: "bottom" as const },
    { target: "#student-list", title: "Student List", content: "View all students assigned to your classes. Click any student to see their deep analytics profile.", position: "top" as const },
    { target: "#student-search-container", title: "Smart Search", content: "Instantly find any student by name or admission number.", position: "bottom" as const },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <OnboardingTour steps={onboardingSteps} tourKey="teacher_dashboard" />
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-black">Welcome, {teacher.name}</h1>
          <p className="text-sm text-black">{teacher.school_name}</p>
        </div>
        <div className="flex items-center gap-4">
          <div id="student-search-container">
            <StudentSearch />
          </div>
          <NotificationBell schoolId={teacher.school_id} teacherId={teacher.teacher_id} />
          <Link
            href="/privacy"
            target="_blank"
            className="text-sm font-medium text-gray-500 hover:text-blue-600 transition"
          >
            Privacy Policy
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm border border-gray-500 rounded-lg text-black hover:bg-gray-100"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div id="quick-actions" className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {[
          { label: "Enter Results", href: "/results/enter" },
          { label: "Take Attendance", href: "/attendance" },
          { label: "Analytics Hub", href: "/analytics" },
          { label: "Risk Alerts", href: "/risk" },
          { label: "Report Cards", href: "/reports" },
          { label: "Fees", href: "/fees" },
          { label: "My Timetable", href: "/timetable" },
          ...(teacher.role === "headteacher" || teacher.role === "dean"
            ? [
                { label: "Teacher Rankings", href: "/analytics/teachers" },
                { label: "Headteacher Dashboard", href: "/headteacher/dashboard" },
                { label: "Dean Dashboard", href: "/dean" },
                { label: "Assign Teacher", href: "/assign" },
              ]
            : [
                { label: "Class Teacher Hub", href: "/class-teacher" },
              ]
          ),
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => router.push(action.href)}
            className="p-3 bg-white rounded-xl shadow-sm text-center text-sm font-medium text-black hover:bg-blue-50 hover:text-blue-600 transition"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Student List */}
      <div id="student-list" className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-black">
          Your Students ({students.length})
        </h2>
        {(teacher.role === "headteacher" || teacher.role === "dean") && (
          <button
            onClick={() => router.push("/students")}
            className="text-xs text-blue-600 font-bold uppercase hover:underline"
          >
            View All Classes
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center text-black py-10">Loading…</div>
      ) : students.length === 0 ? (
        <div className="text-center text-black py-10">
          No students assigned yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {students.map((s) => (
            <div
              key={s.id}
              onClick={() => router.push(`/students/${s.id}`)}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {s.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-black group-hover:text-blue-600 transition-colors">{s.name}</p>
                  <p className="text-xs text-gray-500">
                    {s.admission_number} • <span className="text-blue-500 font-medium">{s.class_name}</span>
                  </p>
                </div>
                <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}