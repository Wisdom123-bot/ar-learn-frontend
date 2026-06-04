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
      const res = await api.get(`/students/search`, {
        params: { q: value.trim() },
      });
      setResults(res.data || []);
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
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search student..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          className="w-full pl-10 pr-8 border border-gray-500 rounded-lg p-2 text-sm text-black placeholder-gray-600"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); setShowDropdown(false); }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute bg-white border border-gray-300 rounded-lg shadow mt-1 w-full z-50 max-h-40 overflow-y-auto">
          {results.map((student) => (
            <div
              key={student.id}
              onClick={() => goToProfile(student.id)}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm flex justify-between"
            >
              <span className="text-black">{student.name}</span>
              <span className="text-black text-xs">{student.admission_number}</span>
            </div>
          ))}
        </div>
      )}
      {showDropdown && query.length >= 2 && results.length === 0 && (
        <div className="absolute bg-white border border-gray-300 rounded-lg shadow mt-1 w-full z-50 p-2 text-sm text-black">
          No student found.
        </div>
      )}
    </div>
  );
}