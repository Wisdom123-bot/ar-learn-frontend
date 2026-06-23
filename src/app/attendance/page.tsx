"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import BackButton from "@/components/BackButton";
import { useAuthStore } from "@/lib/store";
import offlineManager from "@/lib/OfflineManager";

interface Student {
  id: string;
  name: string;
  admission_number: string;
}

interface AttendanceRow {
  student_id: string;
  status: "Present" | "Absent" | "Sick" | "Suspended";
}

interface ClassItem {
  id: string;
  name: string;
}

const PAGE_SIZE = 50;

export default function AttendancePage() {
  const router = useRouter();
  const { user: teacher } = useAuthStore();

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRow[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  // FIX 1: removed selectedClassId from deps to prevent infinite loop.
  // FIX 2: uses functional updater `prev => prev || ...` so it only sets
  //         the class once and never overwrites a user selection.
  useEffect(() => {
    if (!teacher) {
      router.push("/login");
      return;
    }
    api.get(`/schools/${teacher.school_id}/classes`).then((res) => {
      const data: ClassItem[] = res.data || [];
      setClasses(data);
      if (data.length > 0) {
        setSelectedClassId((prev) => prev || data[0].id);
      }
    });
  }, [teacher, router]);

  // Fetch students whenever the selected class changes
  useEffect(() => {
    if (!selectedClassId) return;
    api
      .get(`/classes/${selectedClassId}/students`)
      .then((res) => {
        const data: Student[] = res.data || [];
        setStudents(data);
        setAttendance(
          data.map((s) => ({
            student_id: s.id,
            status: "Present" as const,
          }))
        );
        setCurrentPage(0);
      })
      .catch(console.error);
  }, [selectedClassId]);

  const handleStatusChange = (
    studentId: string,
    status: AttendanceRow["status"]
  ) => {
    setAttendance((prev) =>
      prev.map((a) => (a.student_id === studentId ? { ...a, status } : a))
    );
  };

  // FIX 3: offlineManager null-checked in both branches before calling saveAction.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) return;
    setLoading(true);
    setMessage("");

    const payload = {
      class_id: selectedClassId,
      recorded_by: teacher?.teacher_id,
      records: attendance.map((a) => ({
        student_id: a.student_id,
        date,
        status: a.status,
      })),
    };

    const saveOffline = async () => {
      if (offlineManager) {
        await offlineManager.saveAction(
          "attendance",
          payload,
          "/attendance/record"
        );
        setMessage(
          "Working Offline: Changes saved locally and will sync when online."
        );
      } else {
        setMessage(
          "Offline mode unavailable. Please reconnect and try again."
        );
      }
    };

    try {
      if (navigator.onLine) {
        const res = await api.post("/attendance/record", payload);
        setMessage(res.data.message || "Attendance saved");
      } else {
        await saveOffline();
      }
    } catch (err: any) {
      if (!navigator.onLine) {
        await saveOffline();
      } else {
        setMessage(
          err.response?.data?.detail || "Failed to record attendance"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtered students with useMemo – no extra renders on keystroke
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.admission_number.toLowerCase().includes(q)
    );
  }, [students, searchQuery]);

  // O(1) lookup map for attendance state
  const attendanceMap = useMemo(() => {
    const map: Record<string, AttendanceRow> = {};
    attendance.forEach((a) => (map[a.student_id] = a));
    return map;
  }, [attendance]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE);
  const startIdx = currentPage * PAGE_SIZE;
  const paginatedStudents = filteredStudents.slice(
    startIdx,
    startIdx + PAGE_SIZE
  );

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) setCurrentPage(page);
  };

  // Reset page if filtered results shrink below current page
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [totalPages, currentPage]);

  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-black">
      <div className="flex items-center gap-4 mb-6">
        <BackButton />
        <h1 className="text-xl font-bold text-black">Take Attendance</h1>
      </div>

      {/* Class, Date & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4 space-y-3">
        {/* FIX 4: was using `assignments` (never populated) — now uses `classes` */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Class
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full border border-gray-500 rounded-lg p-2 text-sm text-black"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-500 rounded-lg p-2 text-sm text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Search Student
          </label>
          <input
            type="text"
            placeholder="Type name or admission number..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(0);
            }}
            className="w-full border border-gray-500 rounded-lg p-2 text-sm text-black placeholder-gray-400"
          />
        </div>
      </div>

      {filteredStudents.length > 0 ? (
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
            <div
              style={{
                maxHeight: "calc(100vh - 400px)",
                overflowY: "auto",
              }}
            >
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="text-left p-2 font-medium text-black">
                      Student
                    </th>
                    <th className="w-32 p-2 font-medium text-center text-black">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student) => {
                    const row = attendanceMap[student.id];
                    if (!row) return null;
                    return (
                      <tr key={student.id} className="border-t">
                        <td className="p-2">
                          <p className="font-medium text-black">
                            {student.name}
                          </p>
                          <p className="text-xs text-black">
                            {student.admission_number}
                          </p>
                        </td>
                        <td className="p-2">
                          <select
                            value={row.status}
                            onChange={(e) =>
                              handleStatusChange(
                                student.id,
                                e.target.value as AttendanceRow["status"]
                              )
                            }
                            className="w-full border border-gray-500 rounded-lg p-1.5 text-sm text-center text-black"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-3 py-1 text-sm bg-gray-200 text-black rounded disabled:opacity-50"
              >
                ← Previous
              </button>
              <span className="text-sm text-black">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="px-3 py-1 text-sm bg-gray-200 text-black rounded disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          )}

          {message && (
            <div
              className={`p-3 rounded-lg mb-4 text-sm ${
                message.toLowerCase().includes("failed") ||
                message.toLowerCase().includes("unavailable")
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-600"
              }`}
            >
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
        <p className="text-center text-black py-10">
          {students.length === 0
            ? "No students in this class."
            : "No students match your search."}
        </p>
      )}
    </div>
  );
}