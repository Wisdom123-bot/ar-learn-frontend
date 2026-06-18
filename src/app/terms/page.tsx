"use client";

import Link from "next/link";
import BackButton from "@/components/BackButton";

export default function TermsPage() {
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
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Terms of Service</h1>
        <p className="text-sm font-bold text-slate-400 mb-12 uppercase tracking-widest">Last Updated: June 18, 2026</p>

        <div className="space-y-12 leading-relaxed text-sm md:text-base">
          <section className="space-y-4">
             <h2 className="text-xl font-bold text-slate-900">1. Agreement to Terms</h2>
             <p>By accessing or using Ar-Learn, you agree to be bound by these Terms of Service and our Privacy Policy. If you are registering on behalf of a school or institution, you represent that you have the authority to bind that institution to these terms.</p>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-bold text-slate-900">2. Description of Service</h2>
             <p>Ar-Learn provides a comprehensive cloud-based school management platform. Services include student information management, academic analytics, fee tracking, attendance monitoring, and communication tools. We reserve the right to modify or discontinue any part of the service with reasonable notice.</p>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-bold text-slate-900">3. Account Registration & Security</h2>
             <ul className="list-disc ml-5 space-y-2">
                <li><strong>One-Time Registration:</strong> School registration is a one-time process. Once registered, you will be provided with unique access codes for your staff and students.</li>
                <li><strong>Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and access codes. Any activity under your school's account is your responsibility.</li>
                <li><strong>Accuracy:</strong> You agree to provide accurate and complete information during the registration process.</li>
             </ul>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-bold text-slate-900">4. Data Use & Privacy</h2>
             <p>Your use of Ar-Learn is also governed by our Privacy Policy. You agree that you have the necessary consent from parents or legal guardians to upload and process student data on our platform in accordance with the Kenya Data Protection Act.</p>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-bold text-slate-900">5. Payment & Subscriptions</h2>
             <p>Access to certain features may require a paid subscription. Fees are non-refundable except as required by law. Failure to pay subscription fees may result in the suspension of access to premium features or data analytics.</p>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-bold text-slate-900">6. Prohibited Activities</h2>
             <p>You may not use Ar-Learn to:</p>
             <ul className="list-disc ml-5 space-y-2">
                <li>Upload malicious code or interfere with system security.</li>
                <li>Scrape data or use automated systems to access the platform without authorization.</li>
                <li>Use the service for any illegal purposes or in violation of educational regulations.</li>
             </ul>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-bold text-slate-900">7. Limitation of Liability</h2>
             <p>Ar-Learn is provided on an "AS IS" and "AS AVAILABLE" basis. To the maximum extent permitted by law, Ar-Learn shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the service.</p>
          </section>

          <section className="space-y-4">
             <h2 className="text-xl font-bold text-slate-900">8. Governing Law</h2>
             <p>These terms are governed by and construed in accordance with the laws of the Republic of Kenya. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Kenya.</p>
          </section>

          <div className="mt-20 pt-10 border-t border-slate-200">
            <p className="text-sm text-slate-500">For questions regarding these terms, please contact us at legal@ar-learn.com</p>
          </div>
        </div>
      </main>
    </div>
  );
}
