"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface School {
  id: string;
  name: string;
}

export default function BackupPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin_token");
    if (!stored) {
      router.push("/admin/login");
      return;
    }
    setToken(stored);
    api.get("/admin/schools", { headers: { Authorization: `Bearer ${stored}` } })
      .then(res => setSchools(res.data || []));
  }, [router]);

  const handleExport = () => {
    if (!selectedSchool) return;
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/backup/export/${selectedSchool}`,
      "_blank"
    );
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSchool) return;
    setImporting(true);
    setMessage("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post(`/backup/import/${selectedSchool}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(`Backup imported. Tables: ${JSON.stringify(res.data.tables)}`);
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Backup & Restore</h1>
          <button onClick={() => router.push("/admin/dashboard")} className="text-gray-400 text-sm">
            ← Admin Dashboard
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select School</label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm text-white"
            >
              <option value="">-- Choose a school --</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleExport}
              disabled={!selectedSchool}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              📥 Download Backup
            </button>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <label className="block text-sm font-medium mb-2">📤 Restore from Backup</label>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={!selectedSchool || importing}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-700 file:text-white hover:file:bg-blue-600"
            />
          </div>

          {message && (
            <div className="p-3 bg-gray-700 rounded-lg text-sm text-green-400">
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}