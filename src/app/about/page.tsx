"use client";

import Link from "next/link";
import BackButton from "@/components/BackButton";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* --- Intro Slide --- */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#2563EB]"></div>
        <div className="max-w-4xl space-y-8 animate-fadeIn">
          <div className="inline-block px-4 py-2 bg-blue-100 text-[#2563EB] rounded-full font-bold text-sm tracking-wider uppercase">
            Product Presentation
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900">
            Ar‑Learn: The Future of <br />
            <span className="text-[#2563EB]">School Management</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A specialized predictive analytics platform engineered specifically for the Kenyan education ecosystem.
          </p>
          <div className="pt-8">
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-3 mx-auto shadow-xl"
            >
              Start Presentation
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* --- Section 1: Academic Excellence --- */}
      <section className="min-h-screen py-24 px-6 flex items-center border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#2563EB]">
              <AnalyticsIconLarge />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Academic Excellence <br /> Through Data
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Ar-Learn transforms raw exam scores into actionable insights. Teachers can identify academic decline weeks before finals, allowing for timely intervention.
            </p>
            <ul className="space-y-4">
              <FeatureCheck label="Automated Mean Score Calculations" />
              <FeatureCheck label="Trend Analysis & Performance Forecasting" />
              <FeatureCheck label="Weak Subject Identification" />
            </ul>
          </div>
          <div className="relative">
             <div className="aspect-square bg-slate-100 rounded-[3rem] overflow-hidden flex items-center justify-center p-12">
                <div className="w-full aspect-video bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 flex flex-col gap-4 transform -rotate-3">
                   <div className="h-4 w-1/3 bg-slate-100 rounded"></div>
                   <div className="flex-1 flex items-end gap-2">
                      <div className="flex-1 bg-blue-500 rounded-t-lg h-[40%]"></div>
                      <div className="flex-1 bg-blue-500 rounded-t-lg h-[60%]"></div>
                      <div className="flex-1 bg-blue-600 rounded-t-lg h-[85%]"></div>
                      <div className="flex-1 bg-blue-400 rounded-t-lg h-[50%]"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- Section 2: Financial Transparency --- */}
      <section className="min-h-screen py-24 px-6 flex items-center bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative">
             <div className="aspect-square bg-slate-800 rounded-[3rem] overflow-hidden flex items-center justify-center p-12">
                <div className="w-full max-w-sm bg-slate-700 rounded-3xl p-8 shadow-2xl border border-slate-600 space-y-6">
                   <div className="flex justify-between items-center">
                      <div className="h-4 w-20 bg-slate-600 rounded"></div>
                      <div className="h-6 w-12 bg-green-500/20 text-green-400 rounded-full text-xs flex items-center justify-center font-bold">PAID</div>
                   </div>
                   <div className="h-10 w-full bg-slate-600 rounded"></div>
                   <div className="space-y-2">
                      <div className="h-3 w-full bg-slate-600 rounded"></div>
                      <div className="h-3 w-2/3 bg-slate-600 rounded"></div>
                   </div>
                </div>
             </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
              <FeeIconLarge />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-white">
              Transparent Fee <br /> Management
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Track school revenue in real-time. Ar-Learn manages balances, records payments, and automatically calculates deficits, ensuring financial clarity for the administration.
            </p>
            <ul className="space-y-4">
              <FeatureCheckWhite label="Real-time Balance Tracking" />
              <FeatureCheckWhite label="Automated Financial Summaries" />
              <FeatureCheckWhite label="Defaulter List Management" />
            </ul>
          </div>
        </div>
      </section>

      {/* --- Section 3: AI Assistant --- */}
      <section className="min-h-screen py-24 px-6 flex items-center border-b border-slate-100">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#2563EB] mx-auto">
              <AIIconLarge />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900">
              AI-Powered <br /> Insights
            </h2>
            <p className="text-lg text-slate-600">
              Our 10/10 AI Assistant uses advanced ReAct reasoning to help you manage your school better.
              Ask anything in natural language and get data-driven answers instantly.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
             <AIFeatureBox title="Multi-Step Reasoning" desc="Can chain thoughts to solve complex queries like 'Who is the top student in the weakest class?'" />
             <AIFeatureBox title="Real-Time Streaming" desc="Answers stream word-by-word for an instant, modern conversational experience." />
             <AIFeatureBox title="Secure Data Scoping" desc="Only accesses data relevant to your specific school and authorized role." />
          </div>
        </div>
      </section>

      {/* --- Final Slide --- */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center bg-blue-600 text-white rounded-t-[4rem] mt-20">
         <div className="max-w-3xl space-y-10">
            <h2 className="text-4xl md:text-6xl font-bold">Ready to modernize your school?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <Link
                 href="/schools/register"
                 className="px-10 py-4 bg-white text-blue-600 rounded-2xl font-extrabold text-xl shadow-2xl hover:bg-slate-50 transition-all hover:scale-105"
               >
                 Get Started
               </Link>
               <Link
                 href="/"
                 className="px-10 py-4 bg-blue-700 text-white rounded-2xl font-bold text-xl hover:bg-blue-800 transition-all border border-blue-500/30"
               >
                 Back to Home
               </Link>
            </div>
            <div className="pt-10 border-t border-blue-500/50 flex flex-wrap justify-center gap-8 text-blue-100 font-bold">
               <span>✔ CBC SUPPORT</span>
               <span>✔ FINANCIAL ANALYTICS</span>
               <span>✔ PARENT PORTAL</span>
               <span>✔ AI ASSISTANT</span>
            </div>
         </div>
      </section>

      <div className="py-10 flex justify-center bg-blue-600">
         <BackButton />
      </div>
    </div>
  );
}

function FeatureCheck({ label }: any) {
  return (
    <li className="flex items-center gap-3 text-slate-700 font-semibold">
      <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
      </div>
      {label}
    </li>
  );
}

function FeatureCheckWhite({ label }: any) {
  return (
    <li className="flex items-center gap-3 text-slate-300 font-semibold">
      <div className="w-5 h-5 bg-white/10 text-white rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
      </div>
      {label}
    </li>
  );
}

function AIFeatureBox({ title, desc }: any) {
  return (
    <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group text-left">
       <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-[#2563EB] transition-colors">{title}</h4>
       <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

// --- Large Icons ---
function AnalyticsIconLarge() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
  );
}

function FeeIconLarge() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  );
}

function AIIconLarge() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2Z"/><path d="M12 12L2.1 12"/><path d="M12 12l9.9 0"/><path d="M12 12l0 10"/><path d="M12 12l-7-7"/><path d="M12 12l7 7"/></svg>
  );
}
