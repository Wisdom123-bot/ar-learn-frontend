"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

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
                👋 Welcome to Ar-Learn
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#1E293B] leading-[1.1] tracking-tight">
                Modern School <br />
                <span className="text-[#2563EB]">Management</span> Platform
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Empowering Kenyan schools with smart technology. Streamline admissions,
                track academic performance, and engage parents with our all-in-one cloud solution.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
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
              <StatItem value="10,000+" label="Students Tracked" />
              <StatItem value="120+" label="Registered Schools" />
              <StatItem value="99.9%" label="System Uptime" />
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
              icon="🏫"
              color="blue"
            />
            <ActionCard
              href="/login"
              title="Staff Login"
              desc="Access teacher and management dashboards"
              icon="👨‍🏫"
              color="green"
            />
            <ActionCard
              href="/parents/login"
              title="Parent Portal"
              desc="Monitor student performance and fee status"
              icon="👨‍👩‍👧"
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
              <FeatureItem title="Attendance Tracking" desc="Monitor attendance in real time with automated alerts for parents." icon="📊" />
              <FeatureItem title="Smart Analytics" desc="Visual performance dashboards for teachers and headteachers." icon="📈" />
              <FeatureItem title="Parent Portal" desc="Instant access to results, fees, and disciplinary records." icon="👨‍👩‍👧" />
              <FeatureItem title="Fee Management" desc="Track payments, generate invoices, and send balance reminders." icon="💳" />
            </div>
          </div>
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
                   <span className="text-2xl font-bold text-slate-900">🇰🇪</span>
                   <span className="text-sm font-semibold">Built for Kenyan Schools</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 lg:gap-24">
                <FooterLinkCol title="Product" links={[{label: "Features", href: "#"}, {label: "Analytics", href: "#"}, {label: "Pricing", href: "#"}]} />
                <FooterLinkCol title="Company" links={[{label: "About Us", href: "/about"}, {label: "Contact", href: "/contact"}, {label: "Privacy", href: "#"}]} />
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

function FeatureItem({ title, desc, icon }: any) {
  return (
    <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-colors group">
      <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform inline-block">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
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
