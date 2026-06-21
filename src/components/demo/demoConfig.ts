export interface DemoScene {
  id: string;
  title: string;
  description: string;
  duration: number; // in milliseconds
  type: 'intro' | 'auth' | 'dashboard' | 'analytics' | 'parent' | 'fees' | 'ai' | 'timetable' | 'report_card' | 'leaderboard' | 'student_profile' | 'discipline';
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
    id: 'teacher_dashboard',
    title: 'Empowering Educators',
    description: 'One-click attendance, results entry, and class management.',
    duration: 5000,
    type: 'dashboard',
  },
  {
    id: 'student_profile',
    title: '360° Student View',
    description: 'Deep analytics and longitudinal growth tracking for every learner.',
    duration: 5000,
    type: 'student_profile',
  },
  {
    id: 'discipline_tracking',
    title: 'Behavioral Insights',
    description: 'Track commendations and incidents with real-time parent alerts.',
    duration: 5000,
    type: 'discipline',
  },
  {
    id: 'timetable',
    title: 'Smart Scheduling',
    description: 'Auto-generate conflict-free timetables for the entire school.',
    duration: 5000,
    type: 'timetable',
  },
  {
    id: 'report_cards',
    title: 'Professional Documents',
    description: 'Branded report cards with deep performance insights.',
    duration: 5000,
    type: 'report_card',
  },
  {
    id: 'ai_analytics',
    title: 'Predictive Intelligence',
    description: 'Our AI identifies grade trends and student risks weeks in advance.',
    duration: 5000,
    type: 'ai',
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
