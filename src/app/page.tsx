"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-[#1E293B] relative">
      {/* ---- Top Header ---- */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100"
          aria-label="Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl text-[#2563EB]">Ar‑Learn</span>
        </div>
        {/* empty spacer to keep brand centered */}
        <div className="w-10"></div>
      </header>

      {/* ---- Slide‑out Navigation Drawer (Hamburger Menu) ---- */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div
            className="flex-1 bg-black/30 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          ></div>
          {/* Drawer */}
          <div className="w-72 bg-white shadow-2xl rounded-l-3xl p-6 flex flex-col gap-6 animate-slideInLeft">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg text-[#1E293B]">Menu</span>
              <button onClick={() => setMenuOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-3">
              <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2563EB]" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                Home
              </Link>
              <Link href="/about" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2563EB]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                About Ar-Learn
              </Link>
              <Link href="/contact" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2563EB]" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                Contact Us
              </Link>
            </nav>

            <div className="border-t border-gray-200 my-2"></div>

            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Admin Section</div>
            <Link href="/admin/login" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9333EA]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              Admin Login
            </Link>
          </div>
        </div>
      )}

      {/* ---- Main Content ---- */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-[#2563EB] mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.25 3.438 10.175 9 12 5.563-1.825 9-6.75 9-12V5l-9-4z"/></svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1E293B] tracking-tight">Ar‑Learn</h1>
            <p className="text-lg text-gray-600">School Management & Analytics Platform</p>
            <p className="text-xl font-medium text-[#1E293B]">Welcome to Ar‑Learn</p>
            <p className="text-gray-600 max-w-md">Empowering schools, teachers, parents and students for a better tomorrow.</p>
          </div>
          {/* Illustration placeholder – a simple modern school building */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl shadow-2xl flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-48 h-48">
                <rect x="30" y="80" width="140" height="90" rx="8" fill="#2563EB" />
                <rect x="50" y="100" width="20" height="30" rx="4" fill="white" />
                <rect x="90" y="100" width="20" height="30" rx="4" fill="white" />
                <rect x="130" y="100" width="20" height="30" rx="4" fill="white" />
                <rect x="70" y="50" width="60" height="40" rx="4" fill="#1E293B" />
                <circle cx="100" cy="70" r="8" fill="#F59E0B" />
                <path d="M60 80 L100 60 L140 80" stroke="#1E293B" strokeWidth="4" fill="none" />
                <circle cx="160" cy="40" r="12" fill="white" opacity="0.8" />
                <circle cx="170" cy="30" r="6" fill="white" opacity="0.6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Action Cards (Register, Login, Parent Portal) */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Register */}
          <Link href="/schools/register" className="group relative bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2563EB]" viewBox="0 0 24 24" fill="currentColor"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <h3 className="text-xl font-bold text-[#1E293B]">Register a School</h3>
            <p className="text-gray-600 mt-1">Create a new school account</p>
            <div className="absolute bottom-6 right-6 text-gray-400 group-hover:text-[#2563EB] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            </div>
          </Link>

          {/* Login */}
          <Link href="/login" className="group relative bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#10B981]" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            </div>
            <h3 className="text-xl font-bold text-[#1E293B]">Login</h3>
            <p className="text-gray-600 mt-1">Access your account</p>
            <div className="absolute bottom-6 right-6 text-gray-400 group-hover:text-[#10B981] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            </div>
          </Link>

          {/* Parent Portal */}
          <Link href="/parents/login" className="group relative bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#9333EA]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <h3 className="text-xl font-bold text-[#1E293B]">Parent Portal</h3>
            <p className="text-gray-600 mt-1">Access student information</p>
            <div className="absolute bottom-6 right-6 text-gray-400 group-hover:text-[#9333EA] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            </div>
          </Link>
        </div>

        {/* Bottom Cards (About, Contact) */}
        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/about" className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2563EB]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            </div>
            <div>
              <h3 className="font-bold text-[#1E293B]">About Ar‑Learn</h3>
              <p className="text-sm text-gray-600">Learn more about us</p>
            </div>
          </Link>

          <Link href="/contact" className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#10B981]" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
            </div>
            <div>
              <h3 className="font-bold text-[#1E293B]">Contact Us</h3>
              <p className="text-sm text-gray-600">Get in touch</p>
            </div>
          </Link>
        </div>

        {/* Footer Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-[#F5F8FC] flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-16 h-16">
              <circle cx="30" cy="30" r="8" fill="#2563EB" />
              <circle cx="70" cy="30" r="8" fill="#10B981" />
              <circle cx="50" cy="60" r="8" fill="#9333EA" />
              <rect x="42" y="38" width="16" height="22" rx="3" fill="#1E293B" opacity="0.7" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#1E293B]">Designed for Kenyan schools</h3>
            <p className="text-gray-600">Supporting up to 100,000 students</p>
          </div>
        </div>
      </main>

      {/* Animation for drawer */}
    </div>
  );
}