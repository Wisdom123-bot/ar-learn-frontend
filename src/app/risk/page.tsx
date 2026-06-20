"use client";

import { useAuthStore } from "@/lib/store";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import BackButton from "@/components/BackButton";

interface RiskFlag {
  student_id: string;
  student_name: string;
  admission_number: string;
  class_name: string;
  current_mean: number | null;
  attendance_pct: number | null;
  risk_flags: string[];
}

interface MLRiskStudent {
  student_id: string;
  student_name: string;
  subject_risks: {
    subject_name: string;
    risk_probability: number;
  }[];
  overall_risk: number;
}

import { useAuthStore } from "@/lib/store";

function RiskContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get("class_id") || "";

  const { user: teacher } = useAuthStore();
  const [ruleRisks, setRuleRisks] = useState<RiskFlag[]>([]);
  const [mlRisks, setMlRisks] = useState<MLRiskStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedClass, setSelectedClass] = useState(classId);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [term, setTerm] = useState(searchParams.get("term") || "Term 1 2025");

  useEffect(() => {
    if (!teacher) {
      router.push("/login");
      return;
    }

    api.get(`/schools/${teacher.school_id}/classes`).then((res) => {
      setClasses(res.data || []);
      if (!classId && res.data.length > 0) {
        setSelectedClass(res.data[0].id);
        fetchRisk(res.data[0].id, term);
      } else if (classId) {
        fetchRisk(classId, term);
      }
    }).catch(() => setLoading(false));
  }, [router, classId, term, teacher]);

  if (!teacher) return null;

  const fetchRisk = async (cid: string, t: string) => {
    setLoading(true);
    setMessage("");
    try {
      const ruleRes = await api.get(`/risk/class/${cid}?term=${encodeURIComponent(t)}`);
      setRuleRisks(ruleRes.data || []);

      try {
        const mlRes = await api.get(`/ml-risk/class/${cid}?term=${encodeURIComponent(t)}`);
        setMlRisks(mlRes.data.students || []);
      } catch {
        setMlRisks([]);
      }
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Failed to load risk data");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClass) fetchRisk(selectedClass, term);
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <h1 className="text-xl font-bold text-gray-800">Risk Alerts</h1>
        </div>

        {/* Filter */}
        <form onSubmit={handleFilter} className="bg-white p-3 rounded-xl shadow-sm mb-4 flex gap-2 items-end flex-wrap">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-medium mb-1">Term</label>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
            />
          </div>
          <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium">
            Load
          </button>
        </form>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading risk data…</div>
        ) : message ? (
          <div className="text-center text-red-500 py-10">{message}</div>
        ) : (
          <div className="space-y-6">
            {/* Rule-based Flags */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="font-semibold text-gray-800 mb-3">🚨 Rule‑Based Alerts</h2>
              {ruleRisks.filter(r => r.risk_flags.length > 0).length === 0 ? (
                <p className="text-sm text-green-600">No rule‑based risks detected.</p>
              ) : (
                <div className="space-y-3">
                  {ruleRisks.filter(r => r.risk_flags.length > 0).map((student) => (
                    <div key={student.student_id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{student.student_name}</p>
                          <p className="text-xs text-gray-500">{student.admission_number} · {student.class_name}</p>
                        </div>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                          {student.risk_flags.length} flag{student.risk_flags.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {student.risk_flags.map((flag, i) => (
                          <li key={i} className="text-xs text-gray-600">{flag}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ML Predictions */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="font-semibold text-gray-800 mb-3">🤖 ML Risk Predictions</h2>
              {mlRisks.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No ML predictions available yet. The model will train automatically once the system has enough data (50+ students, 2+ terms of results).
                </p>
              ) : (
                <div className="space-y-3">
                  {mlRisks.map((student) => (
                    <div key={student.student_id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{student.student_name}</p>
                          <p className="text-xs text-gray-500">Overall Risk: <span className="font-bold text-red-600">{Math.round(student.overall_risk * 100)}%</span></p>
                        </div>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {student.subject_risks.slice(0, 5).map((risk, i) => (
                          <li key={i} className="text-xs text-gray-600 flex justify-between">
                            <span>{risk.subject_name}</span>
                            <span className="font-medium text-red-600">{Math.round(risk.risk_probability * 100)}%</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RiskPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading risk data…</div>}>
      <RiskContent />
    </Suspense>
  );
}