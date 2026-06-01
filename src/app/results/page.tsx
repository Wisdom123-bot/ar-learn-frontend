"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface ClassItem {
  id: string;
  name: string;
}

export default function ReportsPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [term, setTerm] = useState("Term 1 2025");
  const [message, setMessage] = useState("");
  const [printingAll, setPrintingAll] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (!stored) {
      router.push("/login");
      return;
    }
    const t = JSON.parse(stored);
    setTeacher(t);
    if (t.school_id) {
      api.get(`/schools/${t.school_id}/classes`).then((res) => {
        setClasses(res.data || []);
        if (res.data.length > 0) setSelectedClass(res.data[0].id);
      }).catch(() => {});
    }
  }, [router]);

  const downloadClassReports = () => {
    if (!selectedClass) return;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/reports/class/${selectedClass}?term=${encodeURIComponent(term)}`;
    window.open(url, "_blank");
  };

  const downloadSchoolReports = () => {
    if (!teacher?.school_id) return;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/reports/school/${teacher.school_id}?term=${encodeURIComponent(term)}`;
    window.open(url, "_blank");
  };

  // Print individual report card (opens printable HTML)
  const printReportCard = (studentId: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/print/report/${studentId}?term=${encodeURIComponent(term)}`;
    window.open(url, "_blank");
  };

  // Print fee statement for a student
  const printFeeStatement = (studentId: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/print/fee/${studentId}?term=${encodeURIComponent(term)}`;
    window.open(url, "_blank");
  };

  // Bulk print all students in the selected class
  const printAllReportCards = async () => {
    if (!selectedClass) return;
    setPrintingAll(true);
    try {
      const res = await api.get(`/teachers/${teacher.teacher_id}/students`);
      const classStudents = res.data.filter((s: any) => s.class_id === selectedClass);
      classStudents.forEach((student: any, index: number) => {
        setTimeout(() => {
          window.open(
            `${process.env.NEXT_PUBLIC_API_URL}/print/report/${student.id}?term=${encodeURIComponent(term)}`,
            "_blank"
          );
        }, index * 1000); // stagger by 1 second to avoid browser popup blocking
      });
    } catch (err) {
      setMessage("Failed to fetch student list.");
    } finally {
      setPrintingAll(false);
    }
  };

  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.back()} className="text-gray-500">← Back</button>
          <h1 className="text-xl font-bold text-gray-800">Report Cards & Printing</h1>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Term</label>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
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

          <button
            onClick={downloadClassReports}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold"
          >
            Download Class Reports (ZIP)
          </button>

          {(teacher.role === "headteacher" || teacher.role === "dean") && (
            <button
              onClick={downloadSchoolReports}
              className="w-full py-2.5 bg-green-600 text-white rounded-lg font-semibold"
            >
              Download All School Reports (ZIP)
            </button>
          )}

          <div className="border-t pt-4">
            <h2 className="font-semibold text-gray-800 mb-2">🖨️ Print Individual</h2>
            <p className="text-xs text-gray-500 mb-3">
              Search for a student by admission number to print their report card or fee statement.
            </p>
            {/* Search + print buttons will be handled by a separate small component, but for simplicity we can just reuse the fee search? We'll add a quick search input here. */}
            <div className="flex gap-2">
              <input
                id="student-search"
                type="text"
                placeholder="Admission number"
                className="flex-1 border rounded-lg p-2 text-sm"
              />
              <button
                onClick={() => {
                  const adm = (document.getElementById("student-search") as HTMLInputElement)?.value;
                  if (adm) {
                    // Look up student ID from admission number using a quick API call
                    api.get(`/students/by-admission?admission=${encodeURIComponent(adm)}`)
                      .then((res) => {
                        if (res.data && res.data.id) {
                          printReportCard(res.data.id);
                        } else {
                          setMessage("Student not found.");
                        }
                      })
                      .catch(() => setMessage("Student not found."));
                  }
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm"
              >
                Print Report
              </button>
              <button
                onClick={() => {
                  const adm = (document.getElementById("student-search") as HTMLInputElement)?.value;
                  if (adm) {
                    api.get(`/students/by-admission?admission=${encodeURIComponent(adm)}`)
                      .then((res) => {
                        if (res.data && res.data.id) {
                          printFeeStatement(res.data.id);
                        } else {
                          setMessage("Student not found.");
                        }
                      })
                      .catch(() => setMessage("Student not found."));
                  }
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
              >
                Print Fee Statement
              </button>
            </div>
            {message && <p className="text-sm text-red-500 mt-2">{message}</p>}
          </div>

          <div className="border-t pt-4">
            <h2 className="font-semibold text-gray-800 mb-2">🖨️ Print All Report Cards for Class</h2>
            <p className="text-xs text-gray-500 mb-3">
              Opens each student's report card in a new tab (printer dialog will appear).
            </p>
            <button
              onClick={printAllReportCards}
              disabled={printingAll}
              className="w-full py-2.5 bg-orange-600 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {printingAll ? "Opening..." : "Print All Report Cards for Selected Class"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}