"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import api from "@/lib/api";
import { SchoolSchema, TeacherSchema, type School, type Teacher } from "@/lib/schemas";

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

  // Security: Brute-force protection
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  // Check lockout on mount and when lockoutUntil changes
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutUntil) {
      const now = Date.now();
      if (now >= lockoutUntil) {
        setLockoutUntil(null);
        setFailedAttempts(0);
      } else {
        timer = setTimeout(() => {
          setLockoutUntil(null);
          setFailedAttempts(0);
        }, lockoutUntil - now);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [lockoutUntil]);

  // ---------- Auto‑login if session exists ----------
  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log("Auto-login session data:", parsed);
        const user = TeacherSchema.parse(parsed);
        if (user.role === "headteacher") {
          router.push("/headteacher/dashboard");
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Session validation failed:", err);
        localStorage.removeItem("teacher");
      }
    }
  }, [router]);

  // Search schools
  const handleSearch = async () => {
    if (schoolQuery.trim().length < 2) return;
    setSearching(true);
    try {
      const res = await api.get("/auth/schools/search", {
        params: { name: schoolQuery.trim() },
      });
      // Validate array of schools
      const validatedSchools = z.array(SchoolSchema).parse(res.data);
      setSchools(validatedSchools);
    } catch (err) {
      console.error("School search validation failed:", err);
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

    // Brute-force check
    if (lockoutUntil && Date.now() < lockoutUntil) {
      setError(`Too many failed attempts. Try again in ${Math.ceil((lockoutUntil - Date.now()) / 1000)} seconds.`);
      return;
    }

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

      console.log("Login raw response:", res.data);

      // Validate response with Zod
      console.log("Validating response data:", res.data);
      const user = TeacherSchema.parse({
        ...res.data,
      });
      console.log("Validation success:", user);

      localStorage.setItem("teacher", JSON.stringify(user));
      setFailedAttempts(0); // Reset on success

      // Redirect based on role
      if (user.role === "headteacher") {
        router.push("/headteacher/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      console.error("Login full error:", err);
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 5) {
        const lockoutTime = Date.now() + 30000; // 30 seconds lockout
        setLockoutUntil(lockoutTime);
        setError("Too many failed attempts. You are locked out for 30 seconds.");
      } else {
        const detail = (err as any).response?.data?.detail;
        setError(detail || "Login failed. Check your details.");
      }
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
                  disabled={loading || (lockoutUntil !== null)}
                  className="w-full py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  {loading ? "Signing in..." : lockoutUntil !== null ? "Locked Out" : "Sign In"}
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