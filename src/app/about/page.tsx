// src/app/about/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero */}
      <div className="bg-blue-900 text-white py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-3">Ar‑Learn – Full Documentation</h1>
        <p className="text-blue-100 max-w-3xl mx-auto">
          Everything you need to understand about the intelligent school management
          and analytics platform built for Kenyan schools.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-16">

        {/* 1. Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">1. What is Ar‑Learn?</h2>
          <p className="leading-relaxed text-black">
            Ar‑Learn is a complete, web‑based school management system that integrates
            everyday administrative workflows with advanced analytics and machine learning.
            It supports the <strong>8‑4‑4</strong> and <strong>CBC</strong> curricula and is
            engineered to serve <strong>100,000+ students</strong> while keeping dashboards
            instant and the total monthly cost at zero.
          </p>
          <p className="leading-relaxed mt-2 text-black">
            From student registration to report card printing, from fee management to
            predictive risk detection, Ar‑Learn automates everything a school does daily.
          </p>
        </section>

        {/* 2. System Architecture */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">2. System Architecture</h2>
          <p className="mb-4 text-black">
            Ar‑Learn follows a modern three‑tier cloud architecture that separates concerns
            and guarantees scalability.
          </p>
          <div className="bg-gray-100 p-6 rounded-xl border border-gray-300 font-mono text-sm text-black space-y-2">
            <div>┌─────────────────────────────────────────┐</div>
            <div>│  FRONTEND  · Next.js 16 + React         │</div>
            <div>│  Hosted on Vercel (free tier)           │</div>
            <div>│  PWA installable, responsive UI         │</div>
            <div>└─────────────────────────────────────────┘</div>
            <div className="text-center font-bold">⇅ HTTPS / REST API</div>
            <div>┌─────────────────────────────────────────┐</div>
            <div>│  BACKEND   · FastAPI + Python 3.11      │</div>
            <div>│  Hosted on Render (free tier)           │</div>
            <div>│  Business logic, ML inference, caching   │</div>
            <div>└─────────────────────────────────────────┘</div>
            <div className="text-center font-bold">⇅ PostgreSQL wire protocol</div>
            <div>┌─────────────────────────────────────────┐</div>
            <div>│  DATABASE  · Supabase PostgreSQL         │</div>
            <div>│  Daily backups, 500 MB free tier        │</div>
            <div>│  Row‑Level Security (RLS)               │</div>
            <div>└─────────────────────────────────────────┘</div>
            <div className="text-center font-bold">⇅ In‑memory cache</div>
            <div>┌─────────────────────────────────────────┐</div>
            <div>│  CACHE     · Upstash Redis (free tier)   │</div>
            <div>│  Accelerates dashboards up to 100x       │</div>
            <div>│  Automatic fallback to live queries      │</div>
            <div>└─────────────────────────────────────────┘</div>
          </div>
          <p className="mt-4 text-black">
            All components run on <strong>free cloud tiers</strong>, allowing a school to
            operate the entire platform at no monthly cost while being ready to scale
            vertically and horizontally.
          </p>
        </section>

        {/* 3. Tech Stack */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">3. Technology Stack</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-black border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-2">Layer</th>
                  <th className="text-left p-2">Technology</th>
                  <th className="text-left p-2">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-2 border">Frontend</td><td className="p-2 border">Next.js 16, React, Tailwind CSS</td><td className="p-2 border">Responsive web app, PWA</td></tr>
                <tr><td className="p-2 border">Backend</td><td className="p-2 border">FastAPI (Python 3.11), Uvicorn</td><td className="p-2 border">REST API, business logic, ML</td></tr>
                <tr><td className="p-2 border">Database</td><td className="p-2 border">PostgreSQL 15 (via Supabase)</td><td className="p-2 border">Reliable relational storage</td></tr>
                <tr><td className="p-2 border">Cache</td><td className="p-2 border">Redis (Upstash)</td><td className="p-2 border">Instant dashboard loading</td></tr>
                <tr><td className="p-2 border">ML/AI</td><td className="p-2 border">scikit‑learn, numpy</td><td className="p-2 border">Predictive risk scoring</td></tr>
                <tr><td className="p-2 border">AI Assistant</td><td className="p-2 border">Rule‑based NLP (Phase 1)</td><td className="p-2 border">Answers school performance questions</td></tr>
                <tr><td className="p-2 border">Authentication</td><td className="p-2 border">bcrypt + Bearer tokens</td><td className="p-2 border">Secure login, role‑based access</td></tr>
                <tr><td className="p-2 border">Storage</td><td className="p-2 border">Supabase Storage</td><td className="p-2 border">Report templates, ML models</td></tr>
                <tr><td className="p-2 border">Hosting</td><td className="p-2 border">Render (backend), Vercel (frontend)</td><td className="p-2 border">Free, auto‑deploy from GitHub</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Database Schema */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">4. Database Design</h2>
          <p className="mb-3 text-black">
            The database contains over 20 tables organized into logical groups:
          </p>
          <ul className="list-disc ml-6 space-y-1 text-black">
            <li><strong>School & Staff:</strong> <code>schools, teachers, teacher_class_subjects, admins</code></li>
            <li><strong>Students & Parents:</strong> <code>students, class_teacher_remarks</code></li>
            <li><strong>Academics:</strong> <code>subjects, competencies, results, cbc_assessments</code></li>
            <li><strong>Attendance & Discipline:</strong> <code>attendance, discipline_records</code></li>
            <li><strong>Fees:</strong> <code>fee_balances, fee_payments</code></li>
            <li><strong>Timetable:</strong> <code>timetable_entries</code></li>
            <li><strong>Reports & Templates:</strong> <code>report_templates</code></li>
            <li><strong>Notifications:</strong> <code>notifications</code></li>
            <li><strong>ML & Backups:</strong> (model stored in Supabase Storage)</li>
          </ul>
          <p className="mt-3 text-black">
            Every table is indexed on high‑cardinality columns (<code>student_id</code>,
            <code>class_id</code>, <code>term</code>, <code>school_id</code>) for sub‑millisecond queries.
          </p>
        </section>

        {/* 5. Role‑Based Access Control */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">5. Role Hierarchy & Permissions</h2>
          <div className="grid gap-4 md:grid-cols-2 text-black">
            <div className="bg-white p-4 rounded-xl shadow border">
              <h3 className="font-bold text-lg">Headteacher / Principal</h3>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>School‑wide analytics & AI assistant</li>
                <li>Approve results & remarks</li>
                <li>Manage fees & teacher performance</li>
                <li>Export data (CSV/Excel)</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border">
              <h3 className="font-bold text-lg">Dean of Students</h3>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Create & manage timetables</li>
                <li>Monitor attendance & discipline</li>
                <li>Bulk import historical results</li>
                <li>Student list with access codes</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border">
              <h3 className="font-bold text-lg">Class Teacher</h3>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>View consolidated class results</li>
                <li>Add class teacher remarks</li>
                <li>Mark daily attendance</li>
                <li>Generate & print report cards</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border">
              <h3 className="font-bold text-lg">Subject Teacher</h3>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Enter CAT & exam marks</li>
                <li>Auto‑generated professional remarks</li>
                <li>View assigned students only</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border">
              <h3 className="font-bold text-lg">Parent</h3>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Secure login with access code</li>
                <li>View own child’s results, attendance, fees</li>
                <li>Download report cards</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border">
              <h3 className="font-bold text-lg">Super Admin (Platform Owner)</h3>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Manage all registered schools</li>
                <li>Suspend / reactivate / delete schools</li>
                <li>Download & restore backups</li>
                <li>View teacher & student lists per school</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Machine Learning */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">6. Machine Learning – Predictive Risk</h2>
          <p className="text-black">
            Ar‑Learn includes a <strong>silent, self‑training ML pipeline</strong> that runs
            automatically after every results submission.
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-2 text-black">
            <li>Uses <strong>logistic regression</strong> (scikit‑learn) – zero cost, no GPU required.</li>
            <li>Trains on historical data (≥ 2 terms, ≥ 50 students) and predicts the probability that a student will score below 50% in each subject next term.</li>
            <li>The model is stored in Supabase Storage and loaded into memory for instant inference.</li>
            <li>Predictions appear on the <strong>Risk Dashboard</strong> and <strong>Student Profile</strong> when available; no warnings if data is insufficient.</li>
          </ul>
        </section>

        {/* 7. Security */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">7. Security & Data Protection</h2>
          <div className="grid gap-4 md:grid-cols-2 text-black">
            <div> <strong>Encryption:</strong> All data in transit (HTTPS/TLS 1.2+) and at rest (AES‑256).</div>
            <div> <strong>Access Control:</strong> Each role sees only its permitted data.</div>
            <div> <strong>Authentication:</strong> bcrypt‑hashed passwords, Bearer tokens for every API call.</div>
            <div><strong>Backups:</strong> Automatic daily backups with point‑in‑time recovery.</div>
            <div> <strong>No third‑party sharing:</strong> Your data never leaves your dedicated database.</div>
            <div> <strong>Audit:</strong> Every result submission and fee payment is logged.</div>
          </div>
        </section>

        {/* 8. Deployment & Monitoring */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">8. Deployment & Monitoring</h2>
          <p className="text-black">
            Both frontend and backend are deployed automatically on every Git push.
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1 text-black">
            <li><strong>Render</strong> – backend web service with automatic health checks, zero‑downtime deploys.</li>
            <li><strong>Vercel</strong> – frontend static hosting with instant rollbacks.</li>
            <li><strong>UptimeRobot</strong> – pings the backend every 5 minutes to keep the free tier from sleeping.</li>
            <li>All logs are available in the respective dashboards.</li>
          </ul>
        </section>

        {/* 9. Frequently Asked Questions (expanded) */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">9. Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "How many students can the system handle?",
                a: "Designed for 100,000+ students; dashboards stay fast thanks to Redis caching."
              },
              {
                q: "Is it really free?",
                a: "Yes. The entire stack uses free tiers of Render, Vercel, Supabase, and Upstash."
              },
              {
                q: "What happens if the internet goes down?",
                a: "Once loaded, cached pages still work. Data syncs when the connection returns."
              },
              {
                q: "Can we import historical results?",
                a: "Yes – the Dean can upload CSV/Excel files of previous terms' results."
              },
              {
                q: "How is parent privacy protected?",
                a: "Parents only see their own child via a unique access code."
              },
              {
                q: "Does the system support CBC?",
                a: "Fully – each subject has competencies assessed as EE, ME, AE, or BE."
              },
              {
                q: "What if we need a custom feature?",
                a: "The platform is modular and built to be extended. Contact us for custom development."
              }
            ].map((faq, i) => (
              <details key={i} className="bg-white p-4 rounded-xl shadow border border-gray-300">
                <summary className="font-semibold cursor-pointer text-black">{faq.q}</summary>
                <p className="mt-2 text-black">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Back button */}
        <div className="text-center pb-10">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}