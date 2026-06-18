"use client";

import Link from "next/link";
import BackButton from "@/components/BackButton";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 font-sans selection:bg-blue-100">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <BackButton className="p-2 h-10 w-10" />
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center font-bold text-white text-lg">A</div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">Ar‑Learn</span>
            </Link>
          </div>
          <Link href="/" className="text-sm font-bold text-[#2563EB]">Back to Home</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-20 px-6">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Privacy & Data Protection</h1>
        <p className="text-sm font-bold text-slate-400 mb-12 uppercase tracking-widest">Last Updated: June 18, 2026</p>

        <div className="space-y-12 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">1. Our Commitment to Your Data</h2>
            <p>
              At Ar-Learn, we understand that school data is highly sensitive. We have built our platform with a "Security First" mindset to ensure that student records, financial data, and staff information are protected with the highest level of care.
            </p>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                How we assure your data is safe:
              </h3>
              <ul className="grid md:grid-cols-2 gap-4 text-sm font-medium">
                <li className="flex gap-2">✔ End-to-End AES-256 Encryption</li>
                <li className="flex gap-2">✔ Zero-Knowledge Data Isolation</li>
                <li className="flex gap-2">✔ No Unauthorized Ar-Learn Access</li>
                <li className="flex gap-2">✔ Hourly Encrypted Backups</li>
                <li className="flex gap-2">✔ Secure JWT Authentication</li>
                <li className="flex gap-2">✔ Regular Security Audits</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">2. Data Ownership & Access</h2>
            <p>
              <strong>You own your data.</strong> Ar-Learn acts only as a processor. Your school's information is stored in isolated, private database containers.
            </p>
            <p className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 font-medium italic">
              "We operate under a strict 'No Access' policy. Ar-Learn staff cannot view your specific student records or financial data unless you explicitly grant access for technical support."
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">3. Compliance with Kenyan Law</h2>
            <p>
              Ar-Learn is fully compliant with the <strong>Kenya Data Protection Act (2019)</strong>. We implement all necessary technical and organizational measures to uphold the privacy rights of students, parents, and educators as defined by the Office of the Data Protection Commissioner (ODPC).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">4. Information We Collect</h2>
            <p>
              We only collect data that is essential for the functionality of the school management system:
            </p>
            <ul className="list-disc ml-5 space-y-2 text-sm">
              <li><strong>School Details:</strong> Name, location, and contact information.</li>
              <li><strong>Academic Records:</strong> Student names, grades, and attendance.</li>
              <li><strong>Financial Data:</strong> Fee payment history and outstanding balances.</li>
              <li><strong>User Logs:</strong> For security monitoring and system optimization.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">5. Third-Party Sharing</h2>
            <p>
              <strong>We do not sell your data.</strong> We do not lease, trade, or share your institutional or student data with any third parties for marketing purposes. Data is only shared with essential integrated services (like SMS providers for parent alerts) strictly for functionality you have enabled.
            </p>
          </section>
        </div>

        <div className="mt-20 pt-10 border-t border-slate-200 text-center">
          <p className="text-sm font-medium text-slate-400">Your trust is our priority. If you have any questions, contact our Data Protection Officer at privacy@ar-learn.com</p>
        </div>
      </main>
    </div>
  );
}
