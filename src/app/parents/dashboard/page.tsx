"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StudentProfileView from "@/components/StudentProfileView";
import BackButton from "@/components/BackButton";

interface ParentData {
  student_id: string;
  name: string;
  admission_number: string;
  class_name: string;
  school_name: string;
}

export default function ParentDashboardPage() {
  const router = useRouter();
  const [parent, setParent] = useState<ParentData | null>(null);
  const [term, setTerm] = useState("Term 1 2025");

  if (!parent) return null;

  useEffect(() => {
    const stored = localStorage.getItem("parent");
    if (!stored) {
      router.push("/parents/login");
      return;
    }
    setParent(JSON.parse(stored));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("parent");
    router.push("/parents/login");
  };


  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Parent Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-5">
             <BackButton />
             <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-emerald-50">
                🏠
             </div>
             <div>
                <h1 className="text-2xl font-black text-gray-900 leading-tight">Parent Portal</h1>
                <p className="text-gray-500 font-medium">Monitoring {parent.name}'s Academic Journey</p>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 flex gap-2">
                <div className="px-4 py-1.5">
                   <p className="text-[10px] font-bold text-gray-400 uppercase">Term View</p>
                   <input
                      type="text"
                      value={term}
                      onChange={e => setTerm(e.target.value)}
                      className="text-sm font-bold text-gray-800 border-none p-0 focus:ring-0 w-28"
                   />
                </div>
                <button
                  onClick={() => {
                    const url = `${process.env.NEXT_PUBLIC_API_URL}/parents/student/${parent.student_id}/report?term=${encodeURIComponent(term)}`;
                    window.open(url, "_blank");
                  }}
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 transition"
                >
                  Download Report
                </button>
             </div>
             <Link
               href="/privacy"
               target="_blank"
               className="p-3 bg-white text-gray-400 rounded-2xl shadow-sm hover:text-blue-600 border border-transparent hover:border-blue-100 transition text-sm font-bold flex items-center gap-2"
               title="Privacy Policy"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="hidden md:inline">Privacy</span>
             </Link>
             <button
               onClick={handleLogout}
               className="p-3 bg-white text-gray-400 rounded-2xl shadow-sm hover:text-rose-500 border border-transparent hover:border-rose-100 transition"
               title="Log Out"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
             </button>
          </div>
        </div>

        <StudentProfileView studentId={parent.student_id} term={term} />
      </div>
    </main>
  );
}
