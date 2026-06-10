"use client";

import BackButton from "@/components/BackButton";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-extrabold mb-4">Documentation and System Overview</h1>
        <p className="text-blue-100 max-w-3xl mx-auto text-xl font-medium">
          A comprehensive guide to the Ar-Learn School Management and Analytics platform.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-20 leading-relaxed">
        {/* Introduction */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-blue-900 border-b pb-2">Platform Mission</h2>
          <p className="text-lg">
            Ar-Learn is a specialized school management and predictive analytics platform engineered for the Kenyan education ecosystem.
            It integrates administrative efficiency with advanced data intelligence to support student performance, financial transparency, and school-wide operational excellence.
          </p>
        </section>

        {/* User Roles and Dashboards */}
        <section className="space-y-12">
          <h2 className="text-3xl font-bold mb-8 text-blue-900 border-b pb-2">System Roles and Functionalities</h2>

          {/* Subject Teacher */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Subject Teacher Dashboard</h3>
            <p className="mb-6 text-gray-700">The entry point for academic data management, focusing on daily classroom operations and results entry.</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Core Actions</h4>
                <ul className="list-disc ml-5 space-y-2 text-gray-600">
                  <li><strong>Enter Results:</strong> Access specific classes and subjects to input CAT or Exam scores. Supports bulk entry and real-time validation.</li>
                  <li><strong>Take Attendance:</strong> Daily digital register for assigned classes. Track Presence, Absence, Sickness, or Suspensions.</li>
                  <li><strong>My Timetable:</strong> Personalized view of assigned teaching slots and subject allocations.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Analysis Tools</h4>
                <ul className="list-disc ml-5 space-y-2 text-gray-600">
                  <li><strong>Analytics Hub:</strong> View personal performance trends and subject mean scores.</li>
                  <li><strong>Risk Alerts:</strong> Identify students in taught subjects who are showing signs of academic decline.</li>
                  <li><strong>Class Teacher Hub:</strong> Specialized access for teachers who are also class mentors.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Class Teacher */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Class Teacher Command</h3>
            <p className="mb-6 text-gray-700">A holistic view of a single class's welfare, academic standing, and behavioral conduct.</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Mentorship Features</h4>
                <ul className="list-disc ml-5 space-y-2 text-gray-600">
                  <li><strong>Pastoral Remarks:</strong> Input qualitative feedback on student character and overall progress.</li>
                  <li><strong>Student Intelligence Deck:</strong> A granular view of each student's mean score across all subjects.</li>
                  <li><strong>Support Needed:</strong> Instant identification of students performing below the 50% threshold.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Class Operations</h4>
                <ul className="list-disc ml-5 space-y-2 text-gray-600">
                  <li><strong>Attendance Hub:</strong> Summarized view of class-wide attendance percentages.</li>
                  <li><strong>Conduct Overview:</strong> Summary of discipline incidents categorized by severity.</li>
                  <li><strong>Register Marking:</strong> Quick access to mark the daily class register.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Dean of Students */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Dean of Students Dashboard</h3>
            <p className="mb-6 text-gray-700">Centralized management of student welfare, discipline, and institutional logistics.</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Welfare and Discipline</h4>
                <ul className="list-disc ml-5 space-y-2 text-gray-600">
                  <li><strong>Discipline Records:</strong> Track Major, Minor, and Positive conduct incidents school-wide.</li>
                  <li><strong>Attendance Concerns:</strong> Automated list of classes with attendance falling below 75%.</li>
                  <li><strong>Admissions:</strong> Register new students and teachers into the system.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Logistics</h4>
                <ul className="list-disc ml-5 space-y-2 text-gray-600">
                  <li><strong>Assign Teachers:</strong> Link teachers to specific classes and subjects.</li>
                  <li><strong>Auto-Generate Timetable:</strong> (Premium) Algorithmic creation of school schedules based on hours and breaks.</li>
                  <li><strong>Export:</strong> Download student, result, and fee data in CSV or Excel formats.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Headteacher */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Headteacher Executive Dashboard</h3>
            <p className="mb-6 text-gray-700">Strategic overview of school performance, financial health, and teacher effectiveness.</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Performance Management</h4>
                <ul className="list-disc ml-5 space-y-2 text-gray-600">
                  <li><strong>School Mean:</strong> Real-time average of all student scores across the institution.</li>
                  <li><strong>Top/Bottom Teachers:</strong> Value-add analysis based on student improvement over time.</li>
                  <li><strong>Best/Worst Classes:</strong> Identification of high-performing and support-requiring cohorts.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Financial Oversight</h4>
                <ul className="list-disc ml-5 space-y-2 text-gray-600">
                  <li><strong>Fee Management:</strong> Search students to view balances and record payments.</li>
                  <li><strong>School Deficit:</strong> Automated calculation of expected vs. collected revenue.</li>
                  <li><strong>Defaulters List:</strong> Comprehensive breakdown of outstanding balances by term.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Updates */}
        <section className="bg-blue-50 p-10 rounded-[3rem] border border-blue-100">
          <h2 className="text-3xl font-bold mb-8 text-blue-900">Recent System Enhancements</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">AI-Generated Executive Summaries</h3>
              <p className="text-gray-700">
                Report cards now feature an automated Executive Summary section. The system analyzes a student's academic results, teacher remarks, attendance patterns, and discipline records to generate a cohesive, professional 4-sentence evaluation paragraph for every student.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">Universal Navigation Framework</h3>
              <p className="text-gray-700">
                Implemented a consistent navigation architecture across all dashboards. A standardized Back Navigation button is present on every interface, ensuring a seamless flow between deep analytics pages and primary command centers.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">Instant Report Access</h3>
              <p className="text-gray-700">
                Administrators can now download individual student report cards directly from the Class Categorized List. This reduces the number of steps required to access student records during parent-teacher consultations.
              </p>
            </div>
          </div>
        </section>

        {/* Security and Data Integrity */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-blue-900 border-b pb-2">Security and Data Infrastructure</h2>
          <p className="mb-4">
            Ar-Learn employs bank-grade encryption protocols for all data transmission. Student records and institutional financial data are stored in a distributed architecture with daily automated backups.
            Access is strictly governed by unique system-generated codes and role-based permissions, ensuring that sensitive information is only accessible to authorized personnel.
          </p>
        </section>

        {/* Footer Navigation */}
        <div className="flex flex-col items-center gap-6 pt-10">
          <p className="text-gray-500 font-medium">End of System Documentation</p>
          <BackButton />
        </div>
      </div>
    </div>
  );
}
