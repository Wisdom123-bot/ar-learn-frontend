"use client";

import { motion } from 'framer-motion';

export function DashboardScene({ scene }: any) {
  return (
    <div className="w-full max-w-6xl p-8 space-y-8">
      {/* Header Mock */}
      <div className="flex justify-between items-center mb-12">
        <div className="space-y-2">
           <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="h-10 w-64 bg-white/10 rounded-xl" />
           <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="h-4 w-48 bg-white/5 rounded-lg" />
        </div>
        <div className="flex gap-4">
           <div className="h-12 w-12 bg-white/10 rounded-full" />
           <div className="h-12 w-48 bg-blue-600 rounded-xl" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { class: 'Form 4 Alpha', count: '42 Students', teacher: 'Mr. Kamau', initial: '4' },
          { class: 'Form 3 North', count: '38 Students', teacher: 'Mrs. Odhiambo', initial: '3' },
          { class: 'Form 1 West', count: '45 Students', teacher: 'Mr. Mutua', initial: '1' },
        ].map((item, i) => (
          <motion.div
            key={item.class}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 * i }}
            className="bg-white rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative overflow-hidden group"
          >
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-black">
                {item.initial}
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900 leading-tight">{item.class}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.teacher}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: i === 0 ? '85%' : i === 1 ? '70%' : '90%' }}
                  transition={{ delay: 1, duration: 1 }}
                  className="h-full bg-blue-500"
                />
              </div>
              <p className="text-[10px] font-bold text-slate-400">TERM PERFORMANCE: {i === 0 ? '8.2 B+' : i === 1 ? '7.4 B-' : '8.8 A-'}</p>
            </div>

            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{item.count}</span>
              <div className="h-8 w-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Animation Focus Move */}
            {i === 0 && (
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                  borderColor: ["rgba(37,99,235,0.1)", "rgba(37,99,235,1)", "rgba(37,99,235,0.1)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 border-4 border-blue-600 rounded-[2.5rem] pointer-events-none"
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
