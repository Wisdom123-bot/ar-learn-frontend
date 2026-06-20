"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import ClassCategorizedList from "@/components/ClassCategorizedList";

interface Student {
  id: string;
  name: string;
  admission_number: string;
  access_code: string;
  class_name: string;
}

import { useAuthStore } from "@/lib/store";

export default function StudentListPage() {
  const router = useRouter();
  const { user: teacher } = useAuthStore();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!teacher) {
      router.push("/login");
      return;
    }
    if (teacher.role !== "headteacher" && teacher.role !== "dean") {
      router.push("/dashboard");
      return;
    }
    api.get(`/students/school/${teacher.school_id}`)
      .then((res) => setStudents(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [teacher, router]);

  if (!teacher) return null;

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admission_number.toLowerCase().includes(search.toLowerCase()) ||
      s.class_name.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Student List</h1>
            <p className="text-sm text-gray-500">{teacher.school_name}</p>
          </div>
          <button onClick={() => router.back()} className="text-gray-500 text-sm">
            ← Back
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
          <input
            type="text"
            placeholder="Search by name, admission number or class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-500 rounded-lg p-2 text-sm text-black placeholder-gray-400"
          />

          {loading ? (
            <p className="text-center text-gray-400 py-10">Loading students…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No students found.</p>
          ) : (
            <ClassCategorizedList students={filtered} />
          )}
        </div>
      </div>
    </div>
  );
}