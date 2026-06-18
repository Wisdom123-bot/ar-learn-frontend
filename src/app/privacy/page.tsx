"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 font-sans selection:bg-blue-100">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center font-bold text-white text-lg">A</div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">Ar‑Learn</span>
          </Link>
          <Link href="/" className="text-sm font-bold text-[#2563EB]">Back to Home</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-20 px-6">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Privacy Policy</h1>
        <p className="text-sm font-bold text-slate-400 mb-12 uppercase tracking-widest">Last Updated: June 18, 2026</p>

        <div className="space-y-12 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">1. Data Collection & Security</h2>
            <p>
              Ar-Learn is committed to protecting the sensitive data of Kenyan schools, students, and staff.
              We collect information necessary for school administration, including student academic records,
              attendance, and institutional financial data.
            </p>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                How we protect your data:
              </h3>
              <ul className="grid md:grid-cols-2 gap-4 text-sm font-medium">
                <li className="flex gap-2">✔ Bank-grade AES-256 Encryption</li>
                <li className="flex gap-2">✔ Secure JWT Authentication</li>
                <li className="flex gap-2">✔ Daily Automated Backups</li>
                <li className="flex gap-2">✔ Multi-tenant Isolation</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">2. No Unauthorized Access</h2>
            <p>
              We operate under a strict "No Access" policy. Your school's data is isolated in private database
              containers. Ar-Learn staff cannot access your specific student records or financial data
              unless explicitly requested for technical support purposes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">3. Kenyan Data Protection Act</h2>
            <p>
              Ar-Learn is fully compliant with the <strong>Kenya Data Protection Act (2019)</strong>.
              All data is stored and processed with the highest level of confidentiality, ensuring the
              privacy rights of students and parents are always upheld.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">4. Third-Party Sharing</h2>
            <p>
              We do not sell, lease, or trade your data to third parties. Data is only shared with
              integrated services (like SMS providers) strictly for functionality you have enabled.
            </p>
          </section>
        </div>

        <div className="mt-20 pt-10 border-t border-slate-200 text-center">
          <p className="text-sm font-medium text-slate-400">Questions? Contact our Data Protection Officer at privacy@ar-learn.com</p>
        </div>
      </main>
    </div>
  );
}
