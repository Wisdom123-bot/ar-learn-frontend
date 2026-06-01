"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function StudentSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    try {
      // Use the /students/by-admission?admission=... or create a general search endpoint
      // For simplicity, we'll search by admission number (exact match)
      const res = await api.get(`/students/by-admission?admission=${encodeURIComponent(value.trim())}`);
      if (res.data) setResults([res.data]);
      else setResults([]);
      setShowDropdown(true);
    } catch {
      setResults([]);
      setShowDropdown(true);
    }
  };

  const goToProfile = (studentId: string) => {
    router.push(`/students/${studentId}`);
    setShowDropdown(false);
    setQuery("");
  };

  return (
    <div className="relative w-full max-w-xs">
      <input
        type="text"
        placeholder="Search student (admission no)..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full border rounded-lg p-2 text-sm"
        onFocus={() => results.length > 0 && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />
      {showDropdown && results.length > 0 && (
        <div className="absolute bg-white border rounded-lg shadow mt-1 w-full z-50 max-h-40 overflow-y-auto">
          {results.map((student) => (
            <div
              key={student.id}
              onClick={() => goToProfile(student.id)}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm flex justify-between"
            >
              <span>{student.name}</span>
              <span className="text-gray-400">{student.admission_number}</span>
            </div>
          ))}
        </div>
      )}
      {showDropdown && query.length >= 2 && results.length === 0 && (
        <div className="absolute bg-white border rounded-lg shadow mt-1 w-full z-50 p-2 text-sm text-gray-400">
          No student found.
        </div>
      )}
    </div>
  );
}