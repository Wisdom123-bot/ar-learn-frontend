"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Assignment {
  class_id: string;
  class_name: string;
  subject_id: string;
  subject_name: string;
}

interface Student {
  id: string;
  name: string;
  admission_number: string;
}

interface AttendanceRow {
  student_id: string;
  status: "Present" | "Absent" | "Sick" | "Suspended";
}

export default function AttendancePage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRow[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (!stored) {
      router.push("/login");
      return;
    }
    const t = JSON.parse(stored);
    setTeacher(t);
    // Fetch teacher assignments to get class list
    api.get(`/teachers/${t.teacher_id}/assignments`).then((res) => {
      setAssignments(res.data);
      if (res.data.length > 0) setSelectedClassId(res.data[0].class_id);
    }).catch(console.error);
  }, [router]);

  // When selected class changes, fetch its students
  useEffect(() => {
    if (!teacher || !selectedClassId) return;
    api.get(`/teachers/${teacher.teacher_id}/students`)
      .then((res) => {
        const classStudents = res.data.filter(
          (s: any) => s.class_id === selectedClassId
        );
        setStudents(classStudents);
        setAttendance(
          classStudents.map((s: any) => ({
            student_id: s.id,
            status: "Present",
          }))
        );
      })
      .catch(console.error);
  }, [selectedClassId, teacher]);

  const handleStatusChange = (studentId: string, status: AttendanceRow["status"]) => {
    setAttendance((prev) =>
      prev.map((a) => (a.student_id === studentId ? { ...a, status } : a))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) return;
    setLoading(true);
    setMessage("");
    const payload = {
      class_id: selectedClassId,
      recorded_by: teacher.teacher_id,
      records: attendance.map((a) => ({
        student_id: a.student_id,
        date,
        status: a.status,
      })),
    };
    try {
      const res = await api.post("/attendance/record", payload);
      setMessage(res.data.message || "Attendance saved");
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Failed to record attendance");
    } finally {
      setLoading(false);
    }
  };

  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-500">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-gray-800">Take Attendance</h1>
      </div>

      {/* Class & Date selector */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4 space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Class</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm"
          >
            {assignments.map((a) => (
              <option key={a.class_id} value={a.class_id}>
                {a.class_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm"
          />
        </div>
      </div>

      {/* Student list with status toggles */}
      {students.length > 0 ? (
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="text-left p-2 font-medium">Student</th>
                    <th className="w-32 p-2 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((row) => {
                    const student = students.find((s) => s.id === row.student_id);
                    return (
                      <tr key={row.student_id} className="border-t">
                        <td className="p-2">
                          <p className="font-medium">{student?.name}</p>
                          <p className="text-xs text-gray-400">{student?.admission_number}</p>
                        </td>
                        <td className="p-2">
                          <select
                            value={row.status}
                            onChange={(e) =>
                              handleStatusChange(row.student_id, e.target.value as any)
                            }
                            className="w-full border rounded-lg p-1.5 text-sm text-center"
                          >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Sick">Sick</option>
                            <option value="Suspended">Suspended</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-lg mb-4 text-sm ${message.toLowerCase().includes("failed") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Attendance"}
          </button>
        </form>
      ) : (
        <p className="text-center text-gray-400 py-10">No students in this class.</p>
      )}
    </div>
  );
}