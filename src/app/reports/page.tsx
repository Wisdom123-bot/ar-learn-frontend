"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface ClassItem {
  id: string;
  name: string;
}

interface Template {
  id: string;
  name: string;
}

export default function ReportsPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [term, setTerm] = useState("Term 1 2025");
  const [message, setMessage] = useState("");
  const [printingAll, setPrintingAll] = useState(false);
  const [classSize, setClassSize] = useState<number>(0);

  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (!stored) {
      router.push("/login");
      return;
    }
    const t = JSON.parse(stored);
    setTeacher(t);
    if (t.school_id) {
      Promise.all([
        api.get(`/schools/${t.school_id}/classes`),
        api.get(`/report-builder/${t.school_id}`),
      ])
        .then(([classesRes, templatesRes]) => {
          setClasses(classesRes.data || []);
          setTemplates(templatesRes.data || []);
          if (classesRes.data.length > 0) setSelectedClass(classesRes.data[0].id);
          if (templatesRes.data.length > 0) setSelectedTemplate(templatesRes.data[0].id);
        })
        .catch(() => {});
    }
  }, [router]);

  // Fetch class size when selectedClass changes
  useEffect(() => {
    if (!selectedClass) return;
    api.get(`/classes/${selectedClass}/students`)
      .then((res) => setClassSize((res.data || []).length))
      .catch(() => setClassSize(0));
  }, [selectedClass]);

  const buildUrl = (base: string, studentId?: string) => {
    const params = new URLSearchParams();
    params.set("term", term);
    if (selectedTemplate) params.set("template_id", selectedTemplate);
    if (studentId) {
      return `${process.env.NEXT_PUBLIC_API_URL}${base}${studentId}?${params.toString()}`;
    }
    return `${process.env.NEXT_PUBLIC_API_URL}${base}?${params.toString()}`;
  };

  const downloadClassReports = () => {
    if (!selectedClass) return;
    const url = buildUrl(`/reports/class/${selectedClass}`);
    window.open(url, "_blank");
  };

  const downloadSchoolReports = () => {
    if (!teacher?.school_id) return;
    const url = buildUrl(`/reports/school/${teacher.school_id}`);
    window.open(url, "_blank");
  };

  const printReportCard = (studentId: string) => {
    window.open(buildUrl(`/print/report/`, studentId), "_blank");
  };

  const printFeeStatement = (studentId: string) => {
    window.open(buildUrl(`/print/fee/`, studentId), "_blank");
  };

  const printAllReportCards = async () => {
    if (!selectedClass) return;
    setPrintingAll(true);
    try {
      const res = await api.get(`/classes/${selectedClass}/students`);
      const classStudents = res.data || [];
      classStudents.forEach((student: any, index: number) => {
        setTimeout(() => {
          window.open(buildUrl(`/print/report/`, student.id), "_blank");
        }, index * 1000);
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
          <button onClick={() => router.back()} className="text-gray-500">
            ← Back
          </button>
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
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Template (optional)</label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
            >
              <option value="">Default</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
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
            <div className="flex gap-2">
              <input
                id="student-search"
                type="text"
                placeholder="Admission number"
                className="flex-1 border rounded-lg p-2 text-sm"
              />
              <button
                onClick={() => {
                  const adm = (document.getElementById("student-search") as HTMLInputElement)
                    ?.value;
                  if (adm) {
                    api
                      .get(`/students/by-admission?admission=${encodeURIComponent(adm)}`)
                      .then((res) => {
                        if (res.data?.id) printReportCard(res.data.id);
                        else setMessage("Student not found.");
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
                  const adm = (document.getElementById("student-search") as HTMLInputElement)
                    ?.value;
                  if (adm) {
                    api
                      .get(`/students/by-admission?admission=${encodeURIComponent(adm)}`)
                      .then((res) => {
                        if (res.data?.id) printFeeStatement(res.data.id);
                        else setMessage("Student not found.");
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
            <h2 className="font-semibold text-gray-800 mb-2">
              🖨️ Print All Report Cards for Class
            </h2>
            {classSize > 500 ? (
              <p className="text-sm text-red-600 mb-2">
                This class has {classSize} students. Printing all individual reports may
                crash your browser. Please use the <strong>Download Class Reports (ZIP)</strong> button
                instead to get all PDFs at once, then print from your computer.
              </p>
            ) : (
              <button
                onClick={printAllReportCards}
                disabled={printingAll}
                className="w-full py-2.5 bg-orange-600 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {printingAll ? "Opening..." : "Print All Report Cards"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}