"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface ClassInput {
  name: string;
  target_mean_score: string;
}

interface RegisteredClass {
  id: string;
  name: string;
}

export default function SchoolRegistrationPage() {
  const router = useRouter();
  const [schoolName, setSchoolName] = useState("");
  const [county, setCounty] = useState("");
  const [studentCount, setStudentCount] = useState("");
  const [teacherCount, setTeacherCount] = useState("");
  const [headteacherName, setHeadteacherName] = useState("");
  const [deanName, setDeanName] = useState("");
  const [classes, setClasses] = useState<ClassInput[]>([{ name: "", target_mean_score: "" }]);
  const [teacherNames, setTeacherNames] = useState<string[]>([""]);
  const [subjects, setSubjects] = useState<string[]>(["Mathematics", "English", "Kiswahili", "Science", "Social Studies"]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Success response data
  const [teacherCodes, setTeacherCodes] = useState<string[]>([]);
  const [headteacherCode, setHeadteacherCode] = useState("");
  const [deanCode, setDeanCode] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [registeredClasses, setRegisteredClasses] = useState<RegisteredClass[]>([]);

  // Student PDF upload
  const [selectedClassId, setSelectedClassId] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  // Teacher name handlers
  const addTeacherRow = () => setTeacherNames([...teacherNames, ""]);
  const removeTeacherRow = (index: number) => {
    if (teacherNames.length > 1) {
      setTeacherNames(teacherNames.filter((_, i) => i !== index));
    }
  };
  const updateTeacherName = (index: number, value: string) => {
    const updated = [...teacherNames];
    updated[index] = value;
    setTeacherNames(updated);
  };

  // Class handlers
  const addClassRow = () => setClasses([...classes, { name: "", target_mean_score: "" }]);
  const removeClassRow = (index: number) => {
    setClasses(classes.filter((_, i) => i !== index));
  };
  const updateClass = (index: number, field: keyof ClassInput, value: string) => {
    const updated = [...classes];
    updated[index][field] = value;
    setClasses(updated);
  };

  // Subject handlers
  const addSubjectRow = () => setSubjects([...subjects, ""]);
  const removeSubjectRow = (index: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((_, i) => i !== index));
    }
  };
  const updateSubject = (index: number, value: string) => {
    const updated = [...subjects];
    updated[index] = value;
    setSubjects(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setTeacherCodes([]);
    setHeadteacherCode("");
    setDeanCode("");
    setSchoolId("");
    setRegisteredClasses([]);

    const validTeachers = teacherNames.filter((n) => n.trim() !== "");
    if (validTeachers.length === 0 && !headteacherName.trim() && !deanName.trim()) {
      setMessage("Please enter at least one teacher, headteacher, or dean.");
      setLoading(false);
      return;
    }

    const classList = classes.filter((c) => c.name.trim() !== "");
    if (classList.length === 0) {
      setMessage("Please add at least one class.");
      setLoading(false);
      return;
    }

    const subjectList = subjects.filter((s) => s.trim() !== "");
    if (subjectList.length === 0) {
      setMessage("Please add at least one subject.");
      setLoading(false);
      return;
    }

    const payload = {
      school_name: schoolName.trim(),
      county: county.trim(),
      email: email.trim(),
      phone: phone.trim(),
      number_of_students: parseInt(studentCount) || 0,
      number_of_teachers: validTeachers.length,
      headteacher_name: headteacherName.trim() || undefined,
      dean_name: deanName.trim() || undefined,
      teacher_names: validTeachers,
      classes: classList.map((c) => ({
        name: c.name.trim(),
        target_mean_score: parseFloat(c.target_mean_score) || 0,
      })),
      subjects: subjectList,
    };

    try {
      const res = await api.post("/schools/register", payload);
      setSchoolId(res.data.school_id);
      if (res.data.headteacher) {
        setHeadteacherCode(`${res.data.headteacher.name}: ${res.data.headteacher.teacher_code}`);
      }
      if (res.data.dean) {
        setDeanCode(`${res.data.dean.name}: ${res.data.dean.teacher_code}`);
      }
      if (res.data.teachers) {
        setTeacherCodes(res.data.teachers.map((t: any) => `${t.name}: ${t.teacher_code}`));
      }
      if (res.data.classes) {
        setRegisteredClasses(res.data.classes);
      }
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadStudents = async () => {
    if (!selectedClassId || !pdfFile) {
      setUploadMessage("Select a class and a PDF file.");
      return;
    }
    setUploading(true);
    setUploadMessage("");
    const formData = new FormData();
    formData.append("school_id", schoolId);
    formData.append("class_id", selectedClassId);
    formData.append("file", pdfFile);
    try {
      const res = await api.post("/import/students", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadMessage(res.data.message || "Students imported!");
      setPdfFile(null);
      setSelectedClassId("");
    } catch (err: any) {
      setUploadMessage(err.response?.data?.detail || "Import failed");
    } finally {
      setUploading(false);
    }
  };

  const success = headteacherCode || deanCode || teacherCodes.length > 0;

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.back()} className="text-gray-500">← Back</button>
          <h1 className="text-xl font-bold text-gray-800">Register Your School</h1>
        </div>

        {success ? (
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center space-y-4">
            <h2 className="text-lg font-semibold text-green-600"> Registration Successful</h2>

            {/* Headteacher code */}
            {headteacherCode && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Headteacher</p>
                <p className="font-mono text-sm text-gray-900">{headteacherCode}</p>
              </div>
            )}

            {/* Dean code */}
            {deanCode && (
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-purple-800">Dean of Students</p>
                <p className="font-mono text-sm text-gray-900">{deanCode}</p>
              </div>
            )}

            {/* Teacher codes */}
            {teacherCodes.length > 0 && (
              <div>
                <p className="text-sm text-gray-800 mb-2 font-medium">Teachers</p>
                <ul className="bg-gray-100 p-3 rounded-lg text-left space-y-1 text-sm">
                  {teacherCodes.map((code, i) => (
                    <li key={i} className="font-mono text-gray-900">{code}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* PDF Upload */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">Upload Student Lists (PDF)</h3>
              <p className="text-xs text-gray-600 mb-3">
                For each class, upload a PDF with student names. Access codes will be generated automatically.
              </p>
              <div className="text-left space-y-2">
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full border border-gray-500 rounded-lg p-2 text-sm text-gray-900"
                >
                  <option value="">Select class</option>
                  {registeredClasses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-900"
                />
                <button
                  onClick={handleUploadStudents}
                  disabled={uploading}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload Students"}
                </button>
                {uploadMessage && (
                  <p className={`text-sm ${uploadMessage.includes("failed") ? "text-red-600" : "text-green-600"}`}>
                    {uploadMessage}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => router.push("/login")}
              className="w-full py-2.5 bg-emerald-600 text-white rounded-lg font-semibold"
            >
              Go to Login
            </button>
            <p className="text-xs text-gray-500">School ID: {schoolId}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
            {/* School Info */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">School Name</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full border border-gray-500 rounded-lg p-2 text-sm text-gray-900 placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">County</label>
              <input
                type="text"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="w-full border border-gray-500 rounded-lg p-2 text-sm text-gray-900 placeholder-gray-400"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Email (required)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-500 rounded-lg p-2 text-sm text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Phone (required)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-500 rounded-lg p-2 text-sm text-black"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Estimated Students</label>
                <input
                  type="number"
                  value={studentCount}
                  onChange={(e) => setStudentCount(e.target.value)}
                  className="w-full border border-gray-500 rounded-lg p-2 text-sm text-gray-900"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Number of Teachers</label>
                <input
                  type="number"
                  value={teacherCount}
                  onChange={(e) => setTeacherCount(e.target.value)}
                  className="w-full border border-gray-500 rounded-lg p-2 text-sm text-gray-900"
                  min="0"
                />
              </div>
            </div>

            {/* Headteacher & Dean */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Headteacher Name (optional)</label>
                <input
                  type="text"
                  value={headteacherName}
                  onChange={(e) => setHeadteacherName(e.target.value)}
                  placeholder="e.g. Mr. Otieno"
                  className="w-full border border-gray-500 rounded-lg p-2 text-sm text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Dean of Students (optional)</label>
                <input
                  type="text"
                  value={deanName}
                  onChange={(e) => setDeanName(e.target.value)}
                  placeholder="e.g. Ms. Wanjiku"
                  className="w-full border border-gray-500 rounded-lg p-2 text-sm text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Teacher Names (Dynamic Table) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-900">Teacher Names</label>
                <button type="button" onClick={addTeacherRow} className="text-xs text-blue-600 font-medium">
                  + Add Teacher
                </button>
              </div>
              {teacherNames.map((name, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => updateTeacherName(idx, e.target.value)}
                    placeholder="e.g. Alice Wambui"
                    className="flex-1 border border-gray-500 rounded-lg p-2 text-sm text-gray-900 placeholder-gray-400"
                    required
                  />
                  {teacherNames.length > 1 && (
                    <button type="button" onClick={() => removeTeacherRow(idx)} className="text-red-500 text-xs">✕</button>
                  )}
                </div>
              ))}
            </div>

            {/* Classes */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-900">Classes</label>
                <button type="button" onClick={addClassRow} className="text-xs text-blue-600 font-medium">
                  + Add Class
                </button>
              </div>
              {classes.map((cls, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    value={cls.name}
                    onChange={(e) => updateClass(idx, "name", e.target.value)}
                    placeholder="e.g. Grade 1 Orange"
                    className="flex-1 border border-gray-500 rounded-lg p-2 text-sm text-gray-900 placeholder-gray-400"
                    required
                  />
                  <input
                    type="number"
                    value={cls.target_mean_score}
                    onChange={(e) => updateClass(idx, "target_mean_score", e.target.value)}
                    placeholder="Target %"
                    className="w-20 border border-gray-500 rounded-lg p-2 text-sm text-gray-900 placeholder-gray-400"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                  {classes.length > 1 && (
                    <button type="button" onClick={() => removeClassRow(idx)} className="text-red-500 text-xs">✕</button>
                  )}
                </div>
              ))}
            </div>

            {/* Subjects */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-900">School Subjects</label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setSubjects([])} className="text-xs text-red-600 font-medium">
                    Clear All
                  </button>
                  <button type="button" onClick={addSubjectRow} className="text-xs text-blue-600 font-medium">
                    + Add Subject
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {subjects.map((subject, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => updateSubject(idx, e.target.value)}
                      placeholder="e.g. Mathematics"
                      className="flex-1 border border-gray-500 rounded-lg p-2 text-sm text-gray-900 placeholder-gray-400"
                      required
                    />
                    {subjects.length > 1 && (
                      <button type="button" onClick={() => removeSubjectRow(idx)} className="text-red-500 text-xs">✕</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm ${message.includes("failed") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register School"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}