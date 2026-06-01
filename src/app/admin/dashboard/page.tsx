"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface School {
  id: string;
  name: string;
  county: string;
  student_count: number;
  teacher_count: number;
  is_active: boolean;
  created_at: string;
}

interface Teacher {
  id: string;
  name: string;
  teacher_code: string;
  role: string;
}

interface Student {
  id: string;
  name: string;
  admission_number: string;
  access_code: string;
  class_name: string;
}

interface SchoolDetails {
  school_name: string;
  teachers: Teacher[];
  students: Student[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [showChangePw, setShowChangePw] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwMessage, setPwMessage] = useState("");

  // For expanding school details
  const [expandedSchool, setExpandedSchool] = useState<string | null>(null);
  const [schoolDetails, setSchoolDetails] = useState<SchoolDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin_token");
    if (!stored) {
      router.push("/admin/login");
      return;
    }
    setToken(stored);
    fetchSchools(stored);
  }, []);

  const fetchSchools = async (authToken: string) => {
    try {
      const res = await api.get("/admin/schools", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setSchools(res.data || []);
    } catch (err: any) {
      if (err.response?.status === 403) {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (schoolId: string, suspend: boolean) => {
    try {
      await api.put(`/admin/schools/${schoolId}/suspend?suspend=${suspend}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchools((prev) =>
        prev.map((s) => (s.id === schoolId ? { ...s, is_active: !suspend } : s))
      );
      setMessage(`School ${suspend ? "suspended" : "reactivated"} successfully.`);
    } catch (err: any) {
      setMessage("Action failed.");
    }
  };

  const handleDelete = async (schoolId: string, name: string) => {
    if (!confirm(`PERMANENTLY DELETE "${name}" and ALL its data? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/schools/${schoolId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchools((prev) => prev.filter((s) => s.id !== schoolId));
      setMessage(`"${name}" has been permanently deleted.`);
    } catch (err: any) {
      setMessage("Delete failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage("");
    try {
      await api.put(
        "/admin/change-password",
        { old_password: oldPw, new_password: newPw },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("admin_token");
      router.push("/admin/login");
    } catch (err: any) {
      setPwMessage(err.response?.data?.detail || "Failed to change password");
    }
  };

  const toggleDetails = async (schoolId: string) => {
    if (expandedSchool === schoolId) {
      setExpandedSchool(null);
      setSchoolDetails(null);
      return;
    }
    setExpandedSchool(schoolId);
    setLoadingDetails(true);
    try {
      const res = await api.get(`/admin/schools/${schoolId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchoolDetails(res.data);
    } catch {
      setSchoolDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Ar‑Learn Admin</h1>
          <p className="text-gray-400 text-sm">{schools.length} schools registered</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowChangePw(!showChangePw)}
            className="px-3 py-1.5 text-sm border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
          >
            {showChangePw ? "Cancel" : "Change Password"}
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Change Password Form */}
      {showChangePw && (
        <div className="bg-gray-800 p-4 rounded-xl mb-4 border border-gray-700">
          <h3 className="font-semibold text-lg mb-3">Change Admin Password</h3>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <input
              type="password"
              placeholder="Current password"
              value={oldPw}
              onChange={(e) => setOldPw(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              required
            />
            <input
              type="password"
              placeholder="New password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              required
            />
            {pwMessage && <p className="text-sm text-red-400">{pwMessage}</p>}
            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded font-semibold">
              Update Password
            </button>
          </form>
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 bg-gray-800 rounded-lg text-sm text-green-400 border border-gray-700">
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-400 py-20">Loading schools…</p>
      ) : schools.length === 0 ? (
        <p className="text-center text-gray-400 py-20">No schools registered yet.</p>
      ) : (
        <div className="space-y-3">
          {schools.map((school) => (
            <div key={school.id} className={`bg-gray-800 border rounded-xl p-4 ${school.is_active ? "border-gray-700" : "border-red-700 opacity-70"}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{school.name}</h3>
                    {!school.is_active && (
                      <span className="px-2 py-0.5 bg-red-900 text-red-300 text-xs rounded-full">Suspended</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">
                    {school.county} · {school.student_count} students · {school.teacher_count} teachers
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Joined: {new Date(school.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleDetails(school.id)}
                    className="px-3 py-1.5 text-sm rounded-lg font-medium bg-gray-700 text-gray-200 hover:bg-gray-600"
                  >
                    {expandedSchool === school.id ? "Hide Details" : "View Details"}
                  </button>
                  <button
                    onClick={() => handleSuspend(school.id, school.is_active)}
                    className={`px-3 py-1.5 text-sm rounded-lg font-medium ${school.is_active ? "bg-yellow-700 text-yellow-200 hover:bg-yellow-600" : "bg-green-700 text-green-200 hover:bg-green-600"}`}
                  >
                    {school.is_active ? "Suspend" : "Reactivate"}
                  </button>
                  <button
                    onClick={() => handleDelete(school.id, school.name)}
                    className="px-3 py-1.5 text-sm bg-red-700 text-red-200 rounded-lg font-medium hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Expanded Details Panel */}
              {expandedSchool === school.id && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  {loadingDetails ? (
                    <p className="text-sm text-gray-400">Loading...</p>
                  ) : schoolDetails ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Teachers */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Teachers</h4>
                        {schoolDetails.teachers.length === 0 ? (
                          <p className="text-xs text-gray-500">No teachers</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-gray-700">
                                  <th className="text-left p-1">Name</th>
                                  <th className="text-left p-1">Code</th>
                                  <th className="text-left p-1">Role</th>
                                </tr>
                              </thead>
                              <tbody>
                                {schoolDetails.teachers.map((t) => (
                                  <tr key={t.id} className="border-t border-gray-700">
                                    <td className="p-1">{t.name}</td>
                                    <td className="p-1 font-mono">{t.teacher_code}</td>
                                    <td className="p-1 capitalize">{t.role}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {/* Students */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Students</h4>
                        {schoolDetails.students.length === 0 ? (
                          <p className="text-xs text-gray-500">No students</p>
                        ) : (
                          <div className="overflow-x-auto max-h-60 overflow-y-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-gray-700 sticky top-0">
                                  <th className="text-left p-1">Name</th>
                                  <th className="text-left p-1">Admission No</th>
                                  <th className="text-left p-1">Class</th>
                                  <th className="text-left p-1">Access Code</th>
                                </tr>
                              </thead>
                              <tbody>
                                {schoolDetails.students.map((s) => (
                                  <tr key={s.id} className="border-t border-gray-700">
                                    <td className="p-1">{s.name}</td>
                                    <td className="p-1 font-mono">{s.admission_number}</td>
                                    <td className="p-1">{s.class_name}</td>
                                    <td className="p-1 font-mono">{s.access_code}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-red-400">Failed to load details.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}