"use client";

import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero */}
      <div className="bg-blue-900 text-white py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-3">About Ar‑Learn</h1>
        <p className="text-blue-100 max-w-3xl mx-auto text-lg">
          The all‑in‑one school platform that makes managing your school easy, smart, and completely free.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-16 text-lg leading-relaxed">

        {/* 1. Welcome */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-black"> Welcome to Ar‑Learn</h2>
          <p>
            Ar‑Learn is a complete school management system built specifically for Kenyan primary and secondary schools.
            It handles everything from student registration and fee tracking to exam results, CBC assessments, and
            automatically generated report cards – all through your phone or computer, without installing anything.
          </p>
          <p className="mt-3">
            Whether you are a headteacher, dean, class teacher, subject teacher, or a parent, Ar‑Learn gives you
            exactly the tools you need, and nothing you don't. The best part? <strong>It's completely free</strong> –
            no subscription, no hidden costs.
          </p>
        </section>

        {/* 2. What Ar‑Learn does for your school */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-black"> What can Ar‑Learn do?</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white p-4 rounded-xl shadow border">
              <h3 className="font-bold"> Academics</h3>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Enter CAT and exam marks easily</li>
                <li>Support for 8‑4‑4 and CBC (competency‑based)</li>
                <li>Automatic mean score calculations</li>
                <li>Professional AI‑generated remarks</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border">
              <h3 className="font-bold"> Attendance & Discipline</h3>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Mark daily attendance for a whole class in one click</li>
                <li>Track discipline records (minor, major, positive)</li>
                <li>Spot attendance trends and concerns instantly</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border">
              <h3 className="font-bold"> Fees</h3>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Record fee balances and payments</li>
                <li>Generate official receipts automatically</li>
                <li>Parents view their fee status any time</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border">
              <h3 className="font-bold"> Analytics & Dashboards</h3>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Headteacher dashboard with school overview</li>
                <li>Teacher performance trends</li>
                <li>Class rankings and subject performance</li>
                <li>Data exports to Excel/CSV</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. New premium features (explained simply) */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">✨ New & Premium Features</h2>
          <p className="mb-4">
            Ar‑Learn now includes a set of advanced features that can be activated per school by the platform admin.
            Once activated, these tools appear automatically for the school's staff.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <h3 className="font-bold text-purple-900"> Interactive Charts</h3>
              <p className="text-purple-800">Beautiful bar charts showing class performance right on your dashboard.</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <h3 className="font-bold text-purple-900"> Custom Branding</h3>
              <p className="text-purple-800">Add your school logo and a custom web address (slug) that appears on all dashboards.</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <h3 className="font-bold text-purple-900"> Auto‑Timetable Generator</h3>
              <p className="text-purple-800">Click one button, set your school hours and breaks, and a full timetable is created for every class – with the option to prioritise weak subjects.</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <h3 className="font-bold text-purple-900"> Smart Risk Prediction</h3>
              <p className="text-purple-800">The system learns from your school's data and predicts which students are likely to fail, helping you intervene early.</p>
            </div>
          </div>
        </section>

        {/* 4. Recent additions (user‑friendly) */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-black"> What's New</h2>
          <ul className="list-disc ml-6 space-y-3">
            <li><strong>Auto‑Login (Remember Me):</strong> Once you sign in, the system remembers you. You won't need to enter your code again unless you log out.</li>
            <li><strong>Quick Student & Teacher Admission:</strong> Headteachers and Deans can add new students or teachers directly from their dashboard – admission numbers and access codes are generated automatically.</li>
            <li><strong>Email Updates:</strong> The platform admin can now send important updates or reports to all schools or a specific school via email.</li>
            <li><strong>Banned IP Protection:</strong> After 5 failed login attempts, the system automatically blocks that device for 24 hours. The admin can unban any IP from the control panel.</li>
            <li><strong>Faster Everything:</strong> We've rebuilt the results submission and attendance engines to handle thousands of students without any slowdown.</li>
            <li><strong>Better Search:</strong> The student search bar now finds students by name or admission number instantly.</li>
          </ul>
        </section>

        {/* 5. How it helps different roles */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">👥 Who uses Ar‑Learn?</h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow border">
              <h3 className="font-bold">Headteacher / Principal</h3>
              <p>See the big picture: school averages, best and worst subjects, teacher performance, fee collection, and more – all on one screen.</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border">
              <h3 className="font-bold">Dean of Students</h3>
              <p>Manage timetables, discipline records, attendance trends, and import past results to analyse progress over time.</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border">
              <h3 className="font-bold">Class Teacher</h3>
              <p>See every student in your class, their subject averages, attendance, and add your own remarks. Print report cards for your whole class in one click.</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border">
              <h3 className="font-bold">Subject Teacher</h3>
              <p>Enter marks and remarks for only the subjects you teach. The system helps you write professional comments automatically.</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border">
              <h3 className="font-bold">Parent</h3>
              <p>Log in securely with your child's admission number and access code. View results, attendance, fees, and even download the official report card from home.</p>
            </div>
          </div>
        </section>

        {/* 6. Security & Privacy (simple) */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">Is my data safe?</h2>
          <p>
            Absolutely. All communication between your browser and our servers is encrypted (the same technology used by banks).
            No one can see a student's information unless they are authorised by the school. Passwords are scrambled so that
            even we cannot read them. Daily backups ensure your data is never lost.
          </p>
        </section>

        {/* 7. Getting started */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-black"> How do I get started?</h2>
          <ol className="list-decimal ml-6 space-y-3">
            <li><strong>Register your school:</strong> Click "Register a School" on the home page and fill in your details. You'll instantly receive login codes for your Headteacher, Dean, and Teachers.</li>
            <li><strong>Log in:</strong> Use your code on the Login page. Choose your role, enter the code, and you're in.</li>
            <li><strong>Set up your classes and teachers:</strong> Use the Assign Teacher page to link teachers to the subjects and classes they teach.</li>
            <li><strong>Upload students:</strong> Add student lists using our PDF upload tool, or add them one by one from the Admissions page.</li>
            <li><strong>Start using the system:</strong> Enter results, take attendance, manage fees, and generate report cards – all from your dashboard.</li>
          </ol>
        </section>

        {/* 8. FAQ (expanded, friendly) */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-black"> Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "How many students can the system handle?",
                a: "It's built for up to 100,000 students without any slowdown. Even large schools with thousands of students will find it fast."
              },
              {
                q: "Is it really free?",
                a: "Yes! The entire platform runs on free cloud services, so we can offer it to schools at no cost."
              },
              {
                q: "What if our internet is slow?",
                a: "Ar‑Learn is designed to be light and fast. Once a page loads, it stays responsive even on 3G networks."
              },
              {
                q: "Can we import our old results?",
                a: "Yes. The Dean can upload CSV or Excel files with past term results, and the system will include them in trends and analytics."
              },
              {
                q: "How do parents access the system?",
                a: "Each student gets a unique access code. Parents use it with the school name and student admission number to log in."
              },
              {
                q: "Does it support CBC?",
                a: "Fully. You can assess students on each competency (Exceeding, Meeting, Approaching, Below Expectations) and generate CBC‑style report cards."
              },
              {
                q: "What if I need help?",
                a: "Just contact us through the Contact page – we're happy to assist with setup, training, or any questions."
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