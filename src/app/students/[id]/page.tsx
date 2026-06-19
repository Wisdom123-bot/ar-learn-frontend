"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import StudentProfileView from "@/components/StudentProfileView";
import BackButton from "@/components/BackButton";

export default function StudentProfilePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [teacher, setTeacher] = useState<any>(null);
  const [term, setTerm] = useState("Term 1 2025");

  if (!teacher) return null;

  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (!stored) {
      router.push("/login");
      return;
    }
    setTeacher(JSON.parse(stored));
  }, [router]);


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
              <BackButton />
              <h1 className="text-2xl font-bold text-gray-900">Student Intelligence</h1>
           </div>

           <div className="flex bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 gap-2">
              <div className="px-4 py-2 flex flex-col">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selected Term</span>
                 <input
                    type="text"
                    value={term}
                    onChange={e => setTerm(e.target.value)}
                    className="text-sm font-bold text-gray-800 border-none p-0 focus:ring-0 w-32"
                 />
              </div>
              <button
                onClick={() => {
                   const params = new URLSearchParams({ term });
                   window.open(`${process.env.NEXT_PUBLIC_API_URL}/print/report/${id}?${params.toString()}`, "_blank");
                }}
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition"
              >
                Print Report Card
              </button>
           </div>
        </div>

        <StudentProfileView
          studentId={id}
          term={term}
          teacherRole={teacher.role}
          teacherId={teacher.teacher_id}
        />
      </div>
    </div>
  );
}
