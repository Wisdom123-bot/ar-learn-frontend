"use client";

import { Skeleton, SkeletonCircle, SkeletonText } from "@/components/ui/Skeleton";
import { Breadcrumb, ChevronSeparator } from "@/components/ui/Breadcrumb";
import Link from "next/link";

export default function UITestPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "UI Components", active: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-4">UI Component Verification</h1>
        <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </header>

      {/* Breadcrumb Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6">Breadcrumb Component</h2>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Default Separator</p>
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Chevron Separator</p>
            <Breadcrumb items={breadcrumbItems} separator={<ChevronSeparator />} />
          </div>
        </div>
      </section>

      {/* Skeleton Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6">Skeleton Components</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <p className="text-xs font-bold text-slate-400 uppercase">Profile Card Loading State</p>
            <div className="flex items-center gap-4 border p-4 rounded-lg">
              <SkeletonCircle />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-xs font-bold text-slate-400 uppercase">Article Loading State</p>
            <div className="border p-4 rounded-lg space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <SkeletonText lines={4} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
