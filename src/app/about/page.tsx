"use client";

import Link from "next/link";
import { useState } from "react";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("teachers");

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-blue-100">
      {/* --- Top Navigation --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Ar‑Learn</span>
          </Link>
          <Link href="/" className="text-sm font-bold text-slate-500 hover:text-[#2563EB] transition-colors">
            Back to Home
          </Link>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="py-24 px-6 text-center max-w-4xl mx-auto space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
          The Complete Operating <br />
          System for <span className="text-[#2563EB]">Kenyan Schools</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 leading-relaxed">
          Ar-Learn is a next-generation school management and predictive analytics platform.
          We bridge the gap between administrative data and academic success using
          Machine Learning and Agentic AI.
        </p>
      </header>

      {/* --- Value Proposition by Role --- */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How it Helps You</h2>
          <div className="flex flex-wrap justify-center gap-2">
            <TabBtn label="Teachers" active={activeTab === "teachers"} onClick={() => setActiveTab("teachers")} />
            <TabBtn label="Parents" active={activeTab === "parents"} onClick={() => setActiveTab("parents")} />
            <TabBtn label="Students" active={activeTab === "students"} onClick={() => setActiveTab("students")} />
            <TabBtn label="Principals" active={activeTab === "principals"} onClick={() => setActiveTab("principals")} />
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-slate-100 transition-all duration-500">
          {activeTab === "teachers" && (
            <div className="grid lg:grid-cols-2 gap-16 items-center animate-fadeIn">
              <div className="space-y-8">
                <h3 className="text-4xl font-bold">Empowering Educators</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Focus on teaching while Ar-Learn handles the paperwork. From automated results entry to personal
                  timetables, we give teachers back 10+ hours a week.
                </p>
                <ul className="space-y-4">
                  <FeatureItem title="Smart Result Entry" desc="Bulk upload exam scores with instant mean calculations." />
                  <FeatureItem title="Digital Register" label="Attendance" desc="Mark class attendance in 30 seconds with automatic parent alerts." />
                  <FeatureItem title="Personal Timetables" desc="View your teaching schedule anytime on any device." />
                </ul>
              </div>
              <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Class Attendance</span>
                    <span className="text-xs font-bold text-slate-400">TERM 2 2026</span>
                  </div>
                  <div className="space-y-3">
                    <AttendanceRow name="Present" width="w-[85%]" color="bg-green-500" />
                    <AttendanceRow name="Absent" width="w-[10%]" color="bg-red-400" />
                    <AttendanceRow name="Sick" width="w-[5%]" color="bg-amber-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "parents" && (
            <div className="grid lg:grid-cols-2 gap-16 items-center animate-fadeIn">
              <div className="space-y-8">
                <h3 className="text-4xl font-bold">Total Peace of Mind</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  No more waiting for the end of the term. Monitor your child's progress,
                  attendance, and fee status in real-time.
                </p>
                <ul className="space-y-4">
                  <FeatureItem title="Parent Portal" desc="Access report cards and exam analysis from your smartphone." />
                  <FeatureItem title="Fee Tracking" desc="View balances, payment history, and receive instant digital receipts." />
                  <FeatureItem title="Behavior Alerts" desc="Get notified about disciplinary incidents or positive badges." />
                </ul>
              </div>
              <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
                  <div className="flex items-center gap-4 border-b pb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full"></div>
                    <div>
                      <div className="font-bold">Fee Status</div>
                      <div className="text-xs text-slate-400">Admission: ADM024</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                    <span className="font-bold text-slate-500 text-sm">Balance</span>
                    <span className="text-2xl font-extrabold text-red-600">KES 12,450</span>
                  </div>
                  <div className="text-xs text-center text-slate-400 font-bold uppercase tracking-wider">
                    Next Payment Due: July 15th
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "students" && (
            <div className="grid lg:grid-cols-2 gap-16 items-center animate-fadeIn">
              <div className="space-y-8">
                <h3 className="text-4xl font-bold">Your Success Partner</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Ar-Learn identifies your strengths and weaknesses automatically, helping
                  you focus your revision where it matters most.
                </p>
                <ul className="space-y-4">
                  <FeatureItem title="Performance Trends" desc="See how you are performing in every subject compared to last term." />
                  <FeatureItem title="Weakness Detection" desc="The AI identifies topics you struggle with and suggests revision." />
                  <FeatureItem title="Badge System" desc="Earn digital rewards for attendance, discipline, and academic growth." />
                </ul>
              </div>
              <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <BadgeItem title="Punctuality" icon={<ClockIcon />} color="text-green-600" />
                  <BadgeItem title="Top Scorer" icon={<StarIcon />} color="text-amber-600" />
                  <BadgeItem title="Consistent" icon={<ChartIcon />} color="text-blue-600" />
                  <BadgeItem title="Creative" icon={<LightIcon />} color="text-purple-600" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "principals" && (
            <div className="grid lg:grid-cols-2 gap-16 items-center animate-fadeIn">
              <div className="space-y-8">
                <h3 className="text-4xl font-bold">Strategic Insight</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Manage your entire school from one screen. Ar-Learn provides the data you need
                  to make decisions that improve your school's mean score and financial health.
                </p>
                <ul className="space-y-4">
                  <FeatureItem title="ML Risk Engine" desc="Identify students likely to drop grades weeks before they do." />
                  <FeatureItem title="Staff Performance" desc="Analyze teacher value-add scores across terms." />
                  <FeatureItem title="Financial Deficit" desc="Automatic calculation of expected revenue vs actual collections." />
                </ul>
              </div>
              <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
                  <div className="h-4 w-32 bg-slate-100 rounded"></div>
                  <div className="text-4xl font-black text-[#1E293B]">78.4%</div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-[78.4%]"></div>
                  </div>
                  <p className="text-xs font-bold text-slate-400">
                    School Mean Score (+2.1% from last term)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --- Master Feature List --- */}
      <section className="py-24 px-6 bg-slate-900 text-white rounded-t-[4rem]">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Full Feature Suite</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A comprehensive toolset for every department in your school.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            <FeatureCard
              title="Academic Management"
              features={[
                "CAT & Exam Score Entry",
                "Automated Mean Calculations",
                "Digital Report Card Generation",
                "CBC Assessment Support",
                "Student Performance Ranking"
              ]}
            />
            <FeatureCard
              title="Student Welfare"
              features={[
                "Daily Digital Attendance",
                "Discipline Incident Tracking",
                "Student Rewards & Badges",
                "Predictive Risk Identification",
                "Admission & Enrollment"
              ]}
            />
            <FeatureCard
              title="Financial Controls"
              features={[
                "Real-time Fee Balances",
                "Payment Recording & Receipts",
                "School Revenue Forecasting",
                "Termly Deficit Calculation",
                "Financial Export (Excel/CSV)"
              ]}
            />
            <FeatureCard
              title="Operations & Logistics"
              features={[
                "Automated Timetable Creation",
                "Teacher Subject Allocation",
                "Classroom Management",
                "Bulk SMS Notifications",
                "Staff Performance Analytics"
              ]}
            />
            <FeatureCard
              title="AI & Intelligence"
              features={[
                "10/10 Agentic AI Assistant",
                "Natural Language Queries",
                "Automated Student Summaries",
                "Multi-step Data Reasoning",
                "ML-based Performance Prediction"
              ]}
            />
            <FeatureCard
              title="Administration"
              features={[
                "Role-Based Access Control",
                "Secure JWT Authentication",
                "System-wide Audit Logs",
                "Cloud Data Backups",
                "Multi-Campus Support"
              ]}
            />
          </div>
        </div>
      </section>

      {/* --- Call to Action --- */}
      <section className="py-24 px-6 bg-blue-600 text-white text-center">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Ready to lead the future of education?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/schools/register" className="px-10 py-4 bg-white text-blue-600 rounded-2xl font-black text-xl shadow-2xl hover:bg-slate-50 transition-all hover:scale-105">
              Register Your School
            </Link>
            <Link href="/" className="px-10 py-4 bg-blue-700 text-white rounded-2xl font-bold text-xl hover:bg-blue-800 transition-all">
              Home Page
            </Link>
          </div>
          <p className="text-blue-100 font-bold tracking-widest text-sm uppercase">
            Built for Kenya. Secured by Modern Technology.
          </p>
        </div>
      </section>

      {/* --- Final Footer --- */}
      <footer className="py-10 text-center text-slate-400 text-sm font-bold">
        © 2026 Ar-Learn. All rights reserved.
      </footer>
    </div>
  );
}

function TabBtn({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-8 py-3 rounded-full font-bold transition-all ${active ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
    >
      {label}
    </button>
  );
}

function FeatureItem({ title, label, desc }: any) {
  return (
    <li className="space-y-1">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-[#2563EB] rounded-full"></div>
        <div className="font-bold text-slate-900">
          {title} {label && <span className="ml-2 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-widest">{label}</span>}
        </div>
      </div>
      <p className="text-slate-500 text-sm ml-5">{desc}</p>
    </li>
  );
}

function AttendanceRow({ name, width, color }: any) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
        <span>{name}</span>
        <span>{width.replace('w-[', '').replace(']', '')}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} ${width}`}></div>
      </div>
    </div>
  );
}

function BadgeItem({ title, icon, color }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-2">
      <div className={`w-10 h-10 ${color}`}>{icon}</div>
      <span className="text-xs font-bold text-slate-700">{title}</span>
    </div>
  );
}

function FeatureCard({ title, features }: any) {
  return (
    <div className="space-y-6">
      <h4 className="text-xl font-bold border-b border-slate-800 pb-4">{title}</h4>
      <ul className="space-y-3">
        {features.map((f: string) => (
          <li key={f} className="flex items-center gap-3 text-slate-400 text-sm font-medium hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- Icons ---
function ClockIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function StarIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}
function ChartIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>;
}
function LightIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-7 7c0 2.32 1.28 4.35 3.19 5.42L10 18h4l1.81-3.58A7.003 7.003 0 0 0 12 2Z"/></svg>;
}
