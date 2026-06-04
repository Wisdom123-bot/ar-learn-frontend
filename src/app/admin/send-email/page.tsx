"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface School {
  id: string;
  name: string;
  email: string;
}

export default function AdminSendEmailPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [token, setToken] = useState("");
  const [to, setTo] = useState("all");
  const [customEmail, setCustomEmail] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("admin_token");
    if (!stored) {
      router.push("/admin/login");
      return;
    }
    setToken(stored);
    api.get("/admin/schools", { headers: { Authorization: `Bearer ${stored}` } })
      .then((res) => setSchools(res.data || []));
  }, [router]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    let recipient = to;
    if (to === "custom") {
      recipient = customEmail.trim();
    } else if (to === "school") {
      recipient = `school:${selectedSchool}`;
    }
    if (!recipient) {
      setMessage("Please select a recipient.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/admin/send-email", {
        to: recipient,
        subject: subject.trim(),
        body: body.trim(),
      }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage(res.data.message || "Email sent!");
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Send Update / Report</h1>
          <button onClick={() => router.push("/admin/dashboard")} className="text-gray-400 text-sm">
            ← Admin Dashboard
          </button>
        </div>

        <form onSubmit={handleSend} className="bg-gray-800 p-6 rounded-xl space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">To</label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm text-white"
            >
              <option value="all">All Schools</option>
              <option value="school">Specific School</option>
              <option value="custom">Custom Email Address</option>
            </select>
          </div>

          {to === "school" && (
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
          )}

          {to === "custom" && (
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm text-white"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm text-white"
              required
            />
          </div>

          {message && (
            <div className="p-3 bg-gray-700 rounded-lg text-sm text-green-400">{message}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        </form>
      </div>
    </main>
  );
}