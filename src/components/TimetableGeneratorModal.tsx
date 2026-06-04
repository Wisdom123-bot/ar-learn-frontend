"use client";

import { useState } from "react";
import api from "@/lib/api";

interface BreakEntry {
  start_time: string;
  end_time: string;
  label: string;
}

export default function TimetableGeneratorModal({
  schoolId,
  onClose,
}: {
  schoolId: string;
  onClose: () => void;
}) {
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("15:30");
  const [periodDuration, setPeriodDuration] = useState(40);
  const [breaks, setBreaks] = useState<BreakEntry[]>([
    { start_time: "10:40", end_time: "11:00", label: "Morning Break" },
    { start_time: "12:40", end_time: "13:20", label: "Lunch Break" },
  ]);
  const [prioritizeWeak, setPrioritizeWeak] = useState(false);
  const [previousTerm, setPreviousTerm] = useState("Term 3 2024");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const addBreak = () => {
    setBreaks([...breaks, { start_time: "", end_time: "", label: "" }]);
  };

  const updateBreak = (index: number, field: keyof BreakEntry, value: string) => {
    const updated = [...breaks];
    updated[index][field] = value;
    setBreaks(updated);
  };

  const removeBreak = (index: number) => {
    setBreaks(breaks.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setMessage("");
    const payload = {
      start_time: startTime,
      end_time: endTime,
      period_duration: periodDuration,
      breaks: breaks.filter((b) => b.start_time && b.end_time),
      prioritize_weak_subjects: prioritizeWeak,
      previous_term: prioritizeWeak ? previousTerm : undefined,
    };
    try {
      const res = await api.post(`/timetable-auto/generate/${schoolId}`, payload);
      setMessage(res.data.message);
      setTimeout(onClose, 1500);
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Failed to generate timetable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 text-black">
        <h2 className="text-xl font-bold mb-4">🗓️ Timetable Generator</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">School Start</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full border border-gray-500 rounded-lg p-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">School End</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full border border-gray-500 rounded-lg p-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Period Duration (minutes)</label>
            <input type="number" value={periodDuration} onChange={(e) => setPeriodDuration(Number(e.target.value))} className="w-full border border-gray-500 rounded-lg p-2 text-sm" min={20} max={120} />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Breaks</label>
              <button onClick={addBreak} className="text-xs text-blue-600">+ Add Break</button>
            </div>
            {breaks.map((b, i) => (
              <div key={i} className="flex gap-2 mb-2 items-center">
                <input type="time" value={b.start_time} onChange={(e) => updateBreak(i, "start_time", e.target.value)} className="border border-gray-500 rounded p-1 text-sm w-24" />
                <input type="time" value={b.end_time} onChange={(e) => updateBreak(i, "end_time", e.target.value)} className="border border-gray-500 rounded p-1 text-sm w-24" />
                <input type="text" value={b.label} onChange={(e) => updateBreak(i, "label", e.target.value)} placeholder="Label" className="flex-1 border border-gray-500 rounded p-1 text-sm" />
                <button onClick={() => removeBreak(i)} className="text-red-500 text-xs">✕</button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" checked={prioritizeWeak} onChange={(e) => setPrioritizeWeak(e.target.checked)} className="rounded" />
            <span className="text-sm">Prioritize weak subjects from previous term</span>
          </div>
          {prioritizeWeak && (
            <div>
              <label className="block text-sm font-medium mb-1">Previous Term</label>
              <input type="text" value={previousTerm} onChange={(e) => setPreviousTerm(e.target.value)} className="w-full border border-gray-500 rounded-lg p-2 text-sm" placeholder="e.g. Term 3 2024" />
            </div>
          )}

          {message && <p className="text-sm text-green-600">{message}</p>}

          <div className="flex gap-2 pt-2">
            <button onClick={handleGenerate} disabled={loading} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-semibold">
              {loading ? "Generating..." : "Generate Timetable"}
            </button>
            <button onClick={onClose} className="flex-1 py-2.5 bg-gray-200 text-black rounded-lg font-semibold">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}