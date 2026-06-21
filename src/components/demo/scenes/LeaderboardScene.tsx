"use client";

import { motion } from 'framer-motion';

export function LeaderboardScene({ scene }: any) {
  return (
    <div className="w-full max-w-4xl space-y-12">
      <div className="text-center space-y-4">
        <motion.h3
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-black text-white italic tracking-tighter"
        >
          National Rankings
        </motion.h3>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-blue-400 font-bold uppercase tracking-widest text-sm"
        >
          Compete at the Highest Level
        </motion.p>
      </div>

      <div className="space-y-4">
        {[
          { rank: 1, name: 'St. Mary’s Academy', score: '92.4', trend: '+1.2' },
          { rank: 2, name: 'Westfield High', score: '89.7', trend: '+0.5' },
          { rank: 3, name: 'Global Vision School', score: '88.1', trend: '-0.2' },
          { rank: 4, name: 'Ar-Learn Demo School', score: '87.5', trend: '+4.8', active: true },
        ].map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 + (i * 0.2) }}
            className={`p-6 rounded-3xl border ${item.active ? 'bg-blue-600 border-blue-400 shadow-[0_0_50px_rgba(37,99,235,0.4)]' : 'bg-slate-900 border-slate-800'} flex items-center justify-between`}
          >
            <div className="flex items-center gap-6">
              <span className={`text-2xl font-black ${item.active ? 'text-white' : 'text-slate-700'}`}>0{item.rank}</span>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-white">{item.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Institution Performance</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
               <div className="text-right">
                  <div className="text-2xl font-black text-white">{item.score}</div>
                  <div className={`text-[10px] font-black ${item.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {item.trend}%
                  </div>
               </div>
               {item.active && (
                 <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600"
                 >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                       <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                 </motion.div>
               )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
