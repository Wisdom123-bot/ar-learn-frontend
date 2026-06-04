"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface School {
  id: string;
  name: string;
  county: string;
}

const ROLES = [
  { value: "headteacher", label: "Headteacher" },
  { value: "dean", label: "Dean of Students" },
  { value: "teacher", label: "Teacher" },
];

export default function UnifiedLoginPage() {
  const router = useRouter();

  // Step 1: School search
  const [schoolQuery, setSchoolQuery] = useState("");
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [searching, setSearching] = useState(false);

  // Step 2: Role selection
  const [selectedRole, setSelectedRole] = useState("");

  // Step 3: Teacher code
  const [teacherCode, setTeacherCode] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Search schools
  const handleSearch = async () => {
    if (schoolQuery.trim().length < 2) return;
    setSearching(true);
    try {
      const res = await api.get("/auth/schools/search", {
        params: { name: schoolQuery.trim() },
      });
      setSchools(res.data || []);
    } catch {
      setSchools([]);
    } finally {
      setSearching(false);
    }
  };

  // Select a school
  const handleSelectSchool = (school: School) => {
    setSelectedSchool(school);
    setSelectedRole(""); // reset role
    setTeacherCode("");  // reset code
    setError("");
  };

  // Submit login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchool || !selectedRole || !teacherCode.trim()) {
      setError("Please complete all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", {
        school_id: selectedSchool.id,
        role: selectedRole,
        teacher_code: teacherCode.trim().toUpperCase(),
      });

      const user = {
        ...res.data,
        role: selectedRole,
        school_name: selectedSchool.name,
      };
      localStorage.setItem("teacher", JSON.stringify(user));

      // Redirect based on role
      if (selectedRole === "headteacher") {
        router.push("/headteacher/dashboard");
      } else {
        router.push("/dashboard"); // teacher & dean go to main dashboard for now
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed. Check your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSchool = () => {
    setSelectedSchool(null);
    setSelectedRole("");
    setTeacherCode("");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-black mb-6">
          Ar‑Learn Login
        </h1>

        {/* STEP 1: School selection */}
        {!selectedSchool ? (
          <div className="space-y-4">
            <p className="text-sm text-black">Find your school</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={schoolQuery}
                onChange={(e) => setSchoolQuery(e.target.value)}
                placeholder="Enter school name"
                className="flex-1 border border-gray-500 rounded-lg p-2 text-sm text-black placeholder-gray-400"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                disabled={searching}
              >
                {searching ? "..." : "Search"}
              </button>
            </div>
            {schools.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {schools.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSchool(s)}
                    className="w-full text-left p-3 border border-gray-500 rounded-lg hover:bg-blue-50"
                  >
                    <p className="font-medium text-black">{s.name}</p>
                    <p className="text-xs text-black">{s.county}</p>
                  </button>
                ))}
              </div>
            )}
            {searching && <p className="text-sm text-black">Searching...</p>}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-black">Selected school</p>
                <p className="font-semibold text-black">{selectedSchool.name}</p>
                <p className="text-xs text-black">{selectedSchool.county}</p>
              </div>
              <button
                onClick={handleBackToSchool}
                className="text-sm text-blue-600"
              >
                Change
              </button>
            </div>

            {/* STEP 2: Role selection */}
            {!selectedRole ? (
              <div>
                <p className="text-sm text-black mb-2">Select your role</p>
                <div className="space-y-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setSelectedRole(r.value)}
                      className="w-full p-3 border border-gray-500 rounded-lg text-left text-black hover:bg-blue-50"
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* STEP 3: Enter teacher code */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <p className="text-sm text-black mb-1">
                    Logging in as <span className="font-medium text-black">{selectedRole}</span>
                  </p>
                  <label className="block text-xs font-medium text-black mb-1">
                    Teacher Code
                  </label>
                  <input
                    type="text"
                    value={teacherCode}
                    onChange={(e) => setTeacherCode(e.target.value)}
                    placeholder="e.g. ALI1234"
                    className="w-full border border-gray-500 rounded-lg p-2 text-lg tracking-widest uppercase text-black placeholder-gray-400"
                    autoFocus
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>

                <button
                  type="button"
                  onClick={() => { setSelectedRole(""); setTeacherCode(""); setError(""); }}
                  className="w-full text-sm text-black"
                >
                  ← Choose a different role
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </main>
  );
}