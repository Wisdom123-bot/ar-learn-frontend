import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Ar‑Learn</h1>
        <p className="text-sm text-gray-500 mb-6">
          School Management & Analytics Platform
        </p>

        <div className="space-y-3">
          <Link
            href="/schools/register"
            className="block w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
             Register a School
          </Link>

          <Link
            href="/login"
            className="block w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
          >
             Login
          </Link>

          <Link
            href="/parents/login"
            className="block w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
          >
             Parent Portal
          </Link>

          <Link
            href="/admin/login"
            className="block w-full py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition"
          >
             Admin Panel
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Designed for Kenyan schools · Supporting up to 100,000 students
        </p>
      </div>
    </main>
  );
}