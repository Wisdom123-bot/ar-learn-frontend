"use client";

import { motion } from 'framer-motion';

export function DisciplineScene({ scene }: any) {
  return (
    <div className="w-full max-w-4xl space-y-8 md:space-y-12 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <motion.h3
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl md:text-5xl font-black text-white italic tracking-tighter"
          >
            Behavior Tracking
          </motion.h3>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-blue-400 font-bold uppercase tracking-widest text-xs md:text-sm"
          >
            Holistic Student Development
          </motion.p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <div className="h-12 md:h-14 w-12 md:w-14 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-white">
              ⚠️
           </div>
           <div className="h-12 md:h-14 flex-1 md:w-48 bg-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black uppercase text-[10px] md:text-xs tracking-widest shadow-xl shadow-blue-900">
              LOG INCIDENT
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl space-y-6"
        >
          <h4 className="text-[10px] md:text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-50 pb-4">Recent Commendations</h4>
          {[
            { name: 'Sarah W.', reason: 'Peer Mentorship', points: '+15', color: 'text-emerald-500' },
            { name: 'John D.', reason: 'Library Volunteering', points: '+10', color: 'text-emerald-500' },
          ].map((item, i) => (
            <div key={item.name} className="flex justify-between items-center p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs">⭐</div>
                 <div>
                    <p className="text-xs md:text-sm font-bold text-slate-900">{item.name}</p>
                    <p className="text-[8px] md:text-[10px] font-medium text-slate-400">{item.reason}</p>
                 </div>
              </div>
              <span className={`text-sm md:text-base font-black ${item.color}`}>{item.points}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-800 space-y-6"
        >
          <h4 className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-4">Incident Log</h4>
          {[
            { name: 'Kevin O.', reason: 'Late to Class', status: 'NOTIFIED', color: 'text-amber-500' },
            { name: 'Mary P.', reason: 'Uniform Infraction', status: 'RESOLVED', color: 'text-slate-500' },
          ].map((item, i) => (
            <div key={item.name} className="flex justify-between items-center p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs">📝</div>
                 <div>
                    <p className="text-xs md:text-sm font-bold text-white">{item.name}</p>
                    <p className="text-[8px] md:text-[10px] font-medium text-slate-500">{item.reason}</p>
                 </div>
              </div>
              <span className={`text-[8px] font-black px-2 py-1 rounded-full bg-slate-800 ${item.color}`}>{item.status}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="text-center text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]"
      >
        Real-Time Synchronization with Parent App
      </motion.div>
    </div>
  );
}
