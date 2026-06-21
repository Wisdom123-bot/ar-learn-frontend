"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import DemoEngine from "@/components/demo/DemoEngine";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState({ total_schools: 0, total_students: 0, uptime: 99.9 });
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    api.get("/public/stats")
      .then(res => setStats(res.data))
      .catch(err => console.error("Failed to fetch stats", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans">
      {/* ---- Navigation Bar ---- */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-2xl tracking-tight text-[#1E293B]">Ar‑Learn</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="/about" className="hover:text-[#2563EB] transition-colors">About</Link>
            <Link href="/contact" className="hover:text-[#2563EB] transition-colors">Contact</Link>
            <Link href="/parents/login" className="hover:text-[#2563EB] transition-colors">Parent Portal</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-6 py-2.5 bg-[#2563EB] text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* ---- Sidebar Drawer ---- */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="flex-1 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)}></div>
          <div className="w-80 bg-white h-full p-8 flex flex-col gap-8 animate-slideInLeft shadow-2xl">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xl text-slate-900">Navigation</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              <NavItem href="/" icon="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" label="Home" onClick={() => setMenuOpen(false)} />
              <NavItem href="/about" icon="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" label="About Ar-Learn" onClick={() => setMenuOpen(false)} />
              <NavItem href="/contact" icon="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" label="Contact Us" onClick={() => setMenuOpen(false)} />
              <div className="my-4 border-t border-slate-100"></div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Internal</div>
              <NavItem href="/admin/login" icon="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" label="Admin Login" onClick={() => setMenuOpen(false)} color="text-purple-600" />
            </nav>
          </div>
        </div>
      )}

      {/* ---- Hero Section ---- */}
      <main>
        <section className="relative overflow-hidden pt-16 pb-20 px-6">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#2563EB] rounded-full font-bold text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Welcome to Ar-Learn
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#1E293B] leading-[1.1] tracking-tight">
                Modern School <br />
                <span className="text-[#2563EB]">Management</span> Platform
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Empowering Kenyan schools with smart technology. Streamline admissions,
                track academic performance, and engage parents with our all-in-one cloud solution.
              </p>
              <div className="pt-2 flex flex-col items-center lg:items-start gap-4">
                <div className="flex flex-col items-center lg:items-start gap-2 bg-white/80 backdrop-blur-sm p-4 rounded-3xl border-2 border-white shadow-xl shadow-blue-100/50">
                  <button
                    onClick={() => setShowDemo(true)}
                    className="flex items-center gap-3 text-[#2563EB] font-black uppercase tracking-widest text-sm hover:gap-5 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-lg shadow-blue-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    Watch Demo
                  </button>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Experience Ar-Learn in action with a cinematic walkthrough.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-10 py-4 bg-[#2563EB] text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 text-center"
                  >
                    Login
                  </Link>
                  <Link
                    href="/schools/register"
                    className="w-full sm:w-auto px-10 py-4 bg-white text-[#1E293B] border-2 border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all hover:border-slate-300 text-center"
                  >
                    Register School
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-[3rem] blur-3xl opacity-50 -z-10"></div>
              <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src="/icon-512.png"
                  alt="Ar-Learn Dashboard Preview"
                  className="w-full h-auto rounded-[2rem] object-cover"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-50 hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Attendance Tracked</div>
                      <div className="text-xs text-slate-500">Updated just now</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Statistics Section ---- */}
        <section className="bg-white py-12 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <StatItem value={stats.total_students.toLocaleString() + "+"} label="Students Tracked" />
              <StatItem value={stats.total_schools.toLocaleString() + "+"} label="Registered Schools" />
              <StatItem value={stats.uptime + "%"} label="System Uptime" />
            </div>
          </div>
        </section>

        {/* ---- Action Cards Section ---- */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1E293B]">Get Started Today</h2>
            <p className="text-slate-500 mt-2">Select your portal to continue</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <ActionCard
              href="/schools/register"
              title="Register School"
              desc="Create a new school account and get started"
              icon={<SchoolIcon />}
              color="blue"
            />
            <ActionCard
              href="/login"
              title="Staff Login"
              desc="Access teacher and management dashboards"
              icon={<UserIcon />}
              color="green"
            />
            <ActionCard
              href="/parents/login"
              title="Parent Portal"
              desc="Monitor student performance and fee status"
              icon={<UsersIcon />}
              color="purple"
            />
          </div>
        </section>

        {/* ---- Features Section ---- */}
        <section className="py-24 px-6 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">Everything you need to run a modern school in Kenya.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureItem
                title="Attendance Tracking"
                desc="Monitor attendance in real time with automated alerts for parents."
                icon={<AttendanceIcon />}
                onClick={() => setSelectedFeature({
                  title: "Attendance Tracking",
                  icon: <AttendanceIcon />,
                  fullDesc: "Real-time monitoring of student presence using mobile and web interfaces.",
                  details: [
                    { label: "Automated Alerts", text: "Instantly notify parents via SMS or App notifications when a student is marked absent or arrives late." },
                    { label: "Biometric Integration", text: "Support for digital attendance logs that can be synced with biometric devices if available." },
                    { label: "Trend Analysis", text: "Identify patterns of chronic absenteeism early to intervene before academic performance is affected." },
                    { label: "Teacher Accountability", text: "Log exactly when and by whom attendance was taken for every lesson." }
                  ]
                })}
              />
              <FeatureItem
                title="Smart Analytics"
                desc="Visual performance dashboards for teachers and headteachers."
                icon={<AnalyticsIcon />}
                onClick={() => setSelectedFeature({
                  title: "Smart Analytics",
                  icon: <AnalyticsIcon />,
                  fullDesc: "Data-driven insights to improve student outcomes and teacher efficiency.",
                  details: [
                    { label: "Predictive Risk Modeling", text: "Our AI identifies students at risk of dropping out or failing based on historical trends and current performance." },
                    { label: "Value-Add Tracking", text: "Measure teacher impact by comparing student performance at the start of the term vs the end, accounting for entry behavior." },
                    { label: "CBC Competency Mapping", text: "Visual maps of student strengths across various competencies, helping teachers focus on specific learning gaps." },
                    { label: "Comparative Benchmarking", text: "Compare your school's performance against regional averages or previous years' data." }
                  ]
                })}
              />
              <FeatureItem
                title="Parent Portal"
                desc="Instant access to results, fees, and disciplinary records."
                icon={<ParentIcon />}
                onClick={() => setSelectedFeature({
                  title: "Parent Portal",
                  icon: <ParentIcon />,
                  fullDesc: "A transparent window into the student's academic life for guardians.",
                  details: [
                    { label: "Real-Time Results", text: "Parents can view exam results and report cards as soon as they are published by the headteacher." },
                    { label: "Fee Transparency", text: "View current balances, payment history, and download official receipts directly from the portal." },
                    { label: "Discipline Logs", text: "Stay informed about disciplinary actions or positive behavior commendations." },
                    { label: "Teacher Communication", text: "Secure channel for parents to receive updates from class teachers regarding their child's progress." }
                  ]
                })}
              />
              <FeatureItem
                title="Fee Management"
                desc="Track payments, generate invoices, and send balance reminders."
                icon={<FeeIcon />}
                onClick={() => setSelectedFeature({
                  title: "Fee Management",
                  icon: <FeeIcon />,
                  fullDesc: "Streamlined financial operations for school bursars and administrators.",
                  details: [
                    { label: "Automated Invoicing", text: "Generate and send fee structures to all parents at the start of the term with one click." },
                    { label: "Payment Reconciliation", text: "Integrated tracking of bank deposits, M-Pesa payments, and cash, reducing manual bookkeeping errors." },
                    { label: "Defaulter Management", text: "Automatically generate lists of students with outstanding balances and send polite reminders to parents." },
                    { label: "Financial Reporting", text: "Real-time cash flow statements and income summaries for school management boards." }
                  ]
                })}
              />
            </div>
          </div>
        </section>

        {/* ---- Feature Detail Modal ---- */}
        {selectedFeature && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setSelectedFeature(null)}></div>
            <div className="relative bg-white text-slate-900 max-w-2xl w-full rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl shadow-sm">
                      {selectedFeature.icon}
                    </div>
                    <div>
                      <h3 className="text-3xl font-extrabold tracking-tight">{selectedFeature.title}</h3>
                      <p className="text-blue-600 font-semibold">Powerful Feature Breakdown</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFeature(null)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                  {selectedFeature.fullDesc}
                </p>

                <div className="space-y-6">
                  {selectedFeature.details.map((detail: any, idx: number) => (
                    <div key={idx} className="flex gap-4">
                      <div className="mt-1.5 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{detail.label}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{detail.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedFeature(null)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
                  >
                    Close Breakdown
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---- Pricing Section ---- */}
        <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-100">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Choose the plan that fits your school's vision. No hidden fees, just clear value per student.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              tier="Basic"
              price="0"
              description="Essential management for Every Kenyan school."
              features={["Student Admissions", "Teacher Onboarding", "Attendance Tracking", "Discipline Logs"]}
              btnText="Get Started for Free"
              btnHref="/schools/register"
            />
            <PricingCard
              tier="Standard"
              price="10"
              period="per student / term"
              description="Professional branding and advanced operations."
              isPopular={true}
              features={["Branded Report Cards", "Auto-Timetabling", "National Rankings", "Parent Messaging"]}
              btnText="Request Upgrade"
              btnHref="/contact"
            />
            <PricingCard
              tier="Elite"
              price="17"
              period="per student / term"
              description="The full power of AI and Machine Learning."
              features={["AI Chat Assistant", "ML Grade Forecasting", "Risk Alerts", "AI Project Grading"]}
              btnText="Talk to Sales"
              btnHref="/contact"
              isElite={true}
            />
          </div>
          <p className="mt-12 text-center text-slate-400 text-sm font-medium">
            * Standard and Elite plans are billed per term based on your school's total student enrollment.
          </p>
        </section>

        {/* ---- Footer ---- */}
        <footer className="py-20 px-6 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
              <div className="space-y-6 max-w-sm">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                  <span className="font-bold text-2xl text-[#1E293B]">Ar‑Learn</span>
                </Link>
                <p className="text-slate-500 leading-relaxed">
                  The most advanced school management platform built specifically for the Kenyan education system.
                </p>
                <div className="flex items-center gap-4 text-slate-400">
                   <span className="text-sm font-bold text-slate-900 border px-2 py-1 rounded">KE</span>
                   <span className="text-sm font-semibold">Built for Kenyan Schools</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 lg:gap-24">
                <FooterLinkCol title="Product" links={[{label: "Features", href: "/about"}, {label: "Analytics", href: "/about"}, {label: "Pricing", href: "#pricing"}]} />
                <FooterLinkCol title="Company" links={[{label: "About Us", href: "/about"}, {label: "Contact", href: "/contact"}, {label: "Privacy", href: "/privacy"}, {label: "Terms", href: "/terms"}]} />
                <FooterLinkCol title="Support" links={[{label: "Help Center", href: "#"}, {label: "Parent FAQ", href: "#"}, {label: "Status", href: "#"}]} />
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm font-medium">
              <p>© 2026 Ar-Learn. All rights reserved.</p>
              <div className="flex gap-6">
                <p>✔ CBC Support</p>
                <p>✔ Fee Management</p>
                <p>✔ Attendance</p>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {showDemo && <DemoEngine onClose={() => setShowDemo(false)} />}
    </div>
  );
}

function NavItem({ href, icon, label, onClick, color = "text-[#2563EB]" }: any) {
  return (
    <Link href={href} className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-slate-50 transition-colors group" onClick={onClick}>
      <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${color} group-hover:bg-white group-hover:shadow-sm transition-all`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      <span className="font-bold text-slate-700">{label}</span>
    </Link>
  );
}

function StatItem({ value, label }: any) {
  return (
    <div className="space-y-2">
      <div className="text-4xl font-extrabold text-[#1E293B]">{value}</div>
      <div className="text-slate-500 font-semibold uppercase tracking-wider text-xs">{label}</div>
    </div>
  );
}

function ActionCard({ href, title, desc, icon, color }: any) {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600 shadow-blue-100 hover:shadow-blue-200",
    green: "bg-green-50 text-green-600 shadow-green-100 hover:shadow-green-200",
    purple: "bg-purple-50 text-purple-600 shadow-purple-100 hover:shadow-purple-200"
  };

  return (
    <Link
      href={href}
      className="group relative bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg transition-transform group-hover:scale-110 ${colorMap[color]}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-[#1E293B] mb-2">{title}</h3>
      <p className="text-slate-500 leading-relaxed mb-6">{desc}</p>
      <div className="flex items-center gap-2 text-[#2563EB] font-bold">
        <span>Continue</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </div>
    </Link>
  );
}

function FeatureItem({ title, desc, icon, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-colors group cursor-pointer"
    >
      <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform inline-block">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">{desc}</p>
      <div className="text-xs font-bold text-blue-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
        Click for Details →
      </div>
    </div>
  );
}

function FooterLinkCol({ title, links }: any) {
  return (
    <div className="space-y-6">
      <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs">{title}</h4>
      <ul className="space-y-4 text-slate-500 font-medium text-sm">
        {links.map((l: any) => (
          <li key={l.label}>
            <Link href={l.href} className="hover:text-[#2563EB] transition-colors">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PricingCard({ tier, price, period, description, features, btnText, btnHref, isPopular, isElite }: any) {
  return (
    <div className={`relative bg-white rounded-[3rem] p-10 border ${isPopular ? 'border-blue-600 shadow-2xl scale-105 z-10' : 'border-slate-100 shadow-xl'} flex flex-col h-full transition-transform hover:translate-y-[-8px]`}>
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
          Most Popular
        </div>
      )}
      <div className="mb-8">
        <h3 className={`text-2xl font-black uppercase italic tracking-tight ${isElite ? 'text-indigo-600' : 'text-slate-900'}`}>{tier}</h3>
        <p className="text-slate-400 text-sm font-medium mt-1">{description}</p>
      </div>
      <div className="mb-8 flex items-baseline gap-1">
        <span className="text-xs font-bold text-slate-400 uppercase">KES</span>
        <span className="text-6xl font-black tracking-tighter text-slate-900">{price}</span>
        {period && <span className="text-sm font-bold text-slate-400 ml-2">{period}</span>}
      </div>
      <ul className="space-y-4 mb-10 flex-1">
        {features.map((f: string) => (
          <li key={f} className="flex items-start gap-3 text-sm font-bold text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={btnHref}
        className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-center text-sm transition-all ${isPopular ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
      >
        {btnText}
      </Link>
    </div>
  );
}

// --- Icons ---
function SchoolIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  );
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  );
}

function AttendanceIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
  );
}

function ParentIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  );
}

function FeeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  );
}
