"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NotificationBell from "@/components/NotificationBell";
import api from "@/lib/api";
import StudentSearch from "@/components/StudentSearch";
import OnboardingTour from "@/components/OnboardingTour";
import SubscriptionModal from "@/components/SubscriptionModal";
import { useAuthStore } from "@/lib/store";

interface Student {
  id: string;
  name: string;
  admission_number: string;
  class_id: string;
  class_name: string;
}

function ClassCard({ classId, classInfo, router }: { classId: string; classInfo: { name: string; students: Student[] }; router: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <svg width="60" height="60" viewBox="0 0 20 20" fill="currentColor">
             <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.07 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl font-black">
            {classInfo.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 leading-tight">Students of {classInfo.name}</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Enrollment</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {classInfo.students.length} Students
          </span>
          <span className="text-[10px] font-black text-gray-400 uppercase group-hover:text-blue-600 transition-colors flex items-center gap-1">
            {isExpanded ? "Collapse" : "View List"}
            <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          {classInfo.students.map((s) => (
            <div
              key={s.id}
              onClick={() => router.push(`/students/${s.id}`)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 hover:border-blue-200 transition-all cursor-pointer flex items-center justify-between group/item"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                  {s.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{s.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{s.admission_number}</p>
                </div>
              </div>
              <div className="text-gray-300 group-hover/item:text-blue-500 transition-colors">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user: teacher, logout } = useAuthStore();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscription State
  const [subStatus, setSubStatus] = useState<any>(null);
  const [showSubModal, setShowSubModal] = useState(false);

  useEffect(() => {
    if (!teacher) {
      router.push("/login");
      return;
    }

    // Fetch students
    api
      .get(`/teachers/${teacher.teacher_id}/students`)
      .then((res) => setStudents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));

    // Fetch subscription status
    api.get("/subscription/status")
      .then(res => {
        setSubStatus(res.data);
      })
      .catch(console.error);
  }, [teacher, router]);

  if (!teacher) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };


  const onboardingSteps = [
    { target: "#quick-actions", title: "Quick Actions", content: "Access all your essential tools like Results Entry and Attendance here.", position: "bottom" as const },
    { target: "#student-list", title: "Student List", content: "View all students assigned to your classes. Click any student to see their deep analytics profile.", position: "top" as const },
    { target: "#student-search-container", title: "Smart Search", content: "Instantly find any student by name or admission number.", position: "bottom" as const },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <OnboardingTour steps={onboardingSteps} tourKey="teacher_dashboard" />
      <SubscriptionModal
        isOpen={showSubModal}
        onClose={() => setShowSubModal(false)}
        status={subStatus}
      />

      {/* Subscription Banner */}
      {subStatus?.has_pending && (
        <div className="mb-6 p-4 bg-blue-600 text-white rounded-[2rem] shadow-lg shadow-blue-200 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
              </div>
              <div>
                 <p className="font-black text-sm uppercase tracking-wider">Verification in Progress</p>
                 <p className="text-xs font-bold text-blue-100">Our team is reviewing your M-Pesa payment. Hang tight!</p>
              </div>
           </div>
           <div className="hidden sm:block text-[10px] font-black uppercase bg-white/20 px-3 py-1 rounded-full">
              ETA: ~10 Mins
           </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-black">Welcome, {teacher.name}</h1>
            {subStatus?.tier !== "basic" && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                subStatus?.tier === "elite" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
              }`}>
                {subStatus?.tier}
              </span>
            )}
          </div>
          <p className="text-sm text-black">{teacher.school_name}</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSubModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-black shadow-lg shadow-blue-100 hover:scale-105 transition-transform"
          >
            Subscription
          </button>
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

      {/* Class Cards Grid */}
      {loading ? (
        <div className="text-center text-black py-10">Loading…</div>
      ) : students.length === 0 ? (
        <div className="text-center text-black py-10">
          No classes or students assigned yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(
            students.reduce((acc, s) => {
              const classId = s.class_id;
              if (!acc[classId]) acc[classId] = { name: s.class_name || "Unassigned", students: [] };
              acc[classId].students.push(s);
              return acc;
            }, {} as Record<string, { name: string; students: Student[] }>)
          ).map(([classId, classInfo]) => (
            <ClassCard key={classId} classId={classId} classInfo={classInfo} router={router} />
          ))}
        </div>
      )}
    </div>
  );
}