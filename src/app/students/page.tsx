"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Student {
  id: string;
  name: string;
  admission_number: string;
  access_code: string;
  class_name: string;
}

export default function StudentListPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
    setTeacher(t);
    api.get(`/students/school/${t.school_id}`)
      .then((res) => setStudents(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admission_number.toLowerCase().includes(search.toLowerCase()) ||
      s.class_name.toLowerCase().includes(search.toLowerCase())
  );

  if (!teacher) return null;

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
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Admission No</th>
                    <th className="text-left p-2">Class</th>
                    <th className="text-left p-2">Access Code</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => router.push(`/students/${s.id}`)}
                      className="border-t hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="p-2 font-medium">{s.name}</td>
                      <td className="p-2 font-mono text-xs">{s.admission_number}</td>
                      <td className="p-2">{s.class_name}</td>
                      <td className="p-2 font-mono text-xs text-blue-600">{s.access_code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}