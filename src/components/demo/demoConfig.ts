export interface DemoScene {
  id: string;
  title: string;
  description: string;
  duration: number; // in milliseconds
  type: 'intro' | 'auth' | 'dashboard' | 'analytics' | 'parent' | 'fees' | 'ai' | 'timetable' | 'report_card' | 'leaderboard' | 'student_profile' | 'discipline' | 'admissions' | 'import' | 'management' | 'report_builder' | 'attendance_live' | 'cbc_competency' | 'cash_flow' | 'value_add' | 'staffing';
}

export const DEMO_SCENES: DemoScene[] = [
  {
    id: 'intro',
    title: 'Ar-Learn: The Future of Schools',
    description: 'Welcome to the complete operating system for modern education.',
    duration: 5000,
    type: 'intro',
  },
  {
    id: 'registration',
    title: 'Seamless Onboarding',
    description: 'Register your school in minutes and start your digital journey.',
    duration: 5000,
    type: 'auth',
  },
  {
    id: 'admissions',
    title: 'Effortless Admissions',
    description: 'Enroll new students in seconds with our optimized onboarding flow.',
    duration: 5000,
    type: 'admissions',
  },
  {
    id: 'teacher_dashboard',
    title: 'Empowering Educators',
    description: 'One-click attendance, results entry, and class management.',
    duration: 5000,
    type: 'dashboard',
  },
  {
    id: 'attendance_live',
    title: 'Live Attendance',
    description: 'One-tap marking with instant SMS notifications to parents.',
    duration: 5000,
    type: 'attendance_live',
  },
  {
    id: 'bulk_import',
    title: 'Bulk Data Power',
    description: 'Import thousands of records from Excel with smart field mapping.',
    duration: 5000,
    type: 'import',
  },
  {
    id: 'student_profile',
    title: '360° Student View',
    description: 'Deep analytics and longitudinal growth tracking for every learner.',
    duration: 5000,
    type: 'student_profile',
  },
  {
    id: 'cbc_competency',
    title: 'CBC Competency Mapping',
    description: 'Track holistic growth across multiple skills and competencies.',
    duration: 5000,
    type: 'cbc_competency',
  },
  {
    id: 'discipline_tracking',
    title: 'Behavioral Insights',
    description: 'Track commendations and incidents with real-time parent alerts.',
    duration: 5000,
    type: 'discipline',
  },
  {
    id: 'management_insights',
    title: 'Executive Oversight',
    description: 'Headteachers get a birds-eye view of school health and performance.',
    duration: 5000,
    type: 'management',
  },
  {
    id: 'cash_flow',
    title: 'Financial Health',
    description: 'Real-time visibility into collected fees vs projected revenue.',
    duration: 5000,
    type: 'cash_flow',
  },
  {
    id: 'timetable',
    title: 'Smart Scheduling',
    description: 'Auto-generate conflict-free timetables for the entire school.',
    duration: 5000,
    type: 'timetable',
  },
  {
    id: 'staffing_workload',
    title: 'Staffing & Workload',
    description: 'Optimize teacher distribution without burnout.',
    duration: 5000,
    type: 'staffing',
  },
  {
    id: 'report_cards',
    title: 'Professional Documents',
    description: 'Branded report cards with deep performance insights.',
    duration: 5000,
    type: 'report_card',
  },
  {
    id: 'custom_reports',
    title: 'Customizable Reports',
    description: 'Design beautiful report cards that reflect your school\'s excellence.',
    duration: 5000,
    type: 'report_builder',
  },
  {
    id: 'ai_analytics',
    title: 'Predictive Intelligence',
    description: 'Our AI identifies grade trends and student risks weeks in advance.',
    duration: 5000,
    type: 'ai',
  },
  {
    id: 'value_add',
    title: 'Teacher Value-Add',
    description: 'Measure impact by comparing entry marks with student growth.',
    duration: 5000,
    type: 'value_add',
  },
  {
    id: 'leaderboard',
    title: 'National Rankings',
    description: 'See where your school stands in the national and county rankings.',
    duration: 5000,
    type: 'leaderboard',
  },
  {
    id: 'fees_management',
    title: 'Financial Transparency',
    description: 'Track fee balances and automate parent notifications.',
    duration: 5000,
    type: 'fees',
  },
  {
    id: 'parent_portal',
    title: 'Total Peace of Mind',
    description: 'Parents stay connected with real-time academic and financial updates.',
    duration: 5000,
    type: 'parent',
  },
  {
    id: 'conclusion',
    title: 'Join the Revolution',
    description: 'Modernize your school today with Ar-Learn.',
    duration: 5000,
    type: 'intro',
  },
];
