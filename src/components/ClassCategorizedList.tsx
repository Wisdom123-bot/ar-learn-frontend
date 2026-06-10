"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Student {
  id: string;
  name: string;
  admission_number: string;
  access_code: string;
  class_name: string;
}

export default function ClassCategorizedList({ students }: { students: Student[] }) {
  const router = useRouter();
  const [expandedClasses, setExpandedClasses] = useState<Record<string, boolean>>({});

  const grouped = students.reduce((acc, s) => {
    if (!acc[s.class_name]) acc[s.class_name] = [];
    acc[s.class_name].push(s);
    return acc;
  }, {} as Record<string, Student[]>);

  const toggleClass = (className: string) => {
    setExpandedClasses((prev) => ({ ...prev, [className]: !prev[className] }));
  };

  const classNames = Object.keys(grouped).sort();

  return (
    <div className="space-y-4">
      {classNames.map((className) => (
        <div key={className} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => toggleClass(className)}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                {className.charAt(0)}
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-800">{className}</h3>
                <p className="text-xs text-gray-500">{grouped[className].length} Students</p>
              </div>
            </div>
            <div className={`transition-transform ${expandedClasses[className] ? "rotate-180" : ""}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </button>

          {expandedClasses[className] && (
            <div className="p-2 bg-gray-50 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {grouped[className].map((s) => (
                  <div
                    key={s.id}
                    onClick={() => router.push(`/students/${s.id}`)}
                    className="bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-400 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-bold text-gray-800 group-hover:text-indigo-600 transition">{s.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono uppercase">{s.admission_number}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                         <p className="text-[10px] text-gray-400 uppercase font-bold">Access Code</p>
                         <p className="text-xs font-mono font-bold text-indigo-500">{s.access_code}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const term = "Term 1 2025"; // Default term, could be passed as prop if needed
                          window.open(`${process.env.NEXT_PUBLIC_API_URL}/print/report/${s.id}?term=${encodeURIComponent(term)}`, "_blank");
                        }}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition shadow-sm border border-blue-100"
                        title="Download Report Card"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
