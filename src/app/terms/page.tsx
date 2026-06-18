"use client";

import Link from "next/link";

export default function TermsPage() {
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
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Terms of Service</h1>
        <p className="text-sm font-bold text-slate-400 mb-12 uppercase tracking-widest">Last Updated: June 18, 2026</p>

        <div className="space-y-12 leading-relaxed text-sm md:text-base">
          <section className="space-y-4">
             <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
             <p>By registering a school on Ar-Learn, you agree to comply with and be bound by these Terms of Service. These terms constitute a legally binding agreement between your institution and Ar-Learn.</p>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-bold text-slate-900">2. Description of Service</h2>
             <p>Ar-Learn provides a cloud-based school management platform including student analytics, fee tracking, and AI-driven administrative tools.</p>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-bold text-slate-900">3. User Responsibilities</h2>
             <ul className="list-disc ml-5 space-y-2">
                <li>You are responsible for maintaining the confidentiality of your school codes and staff login credentials.</li>
                <li>You ensure that all student data uploaded complies with local educational regulations.</li>
                <li>Unauthorized use of the system to scrape data or bypass security is strictly prohibited.</li>
             </ul>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-bold text-slate-900">4. Subscriptions & Payments</h2>
             <p>Fees are billed based on the selected tier (Basic or Premium). Failure to maintain a valid subscription may result in limited access to analytics and AI tools.</p>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-bold text-slate-900">5. Limitation of Liability</h2>
             <p>Ar-Learn is provided "as-is". While we maintain 99.9% uptime and state-of-the-art security, we are not liable for any indirect or consequential damages arising from the use of the platform.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
