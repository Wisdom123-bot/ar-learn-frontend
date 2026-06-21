"use client";

import { motion } from 'framer-motion';

export function FeesScene({ scene }: any) {
  return (
    <div className="w-full max-w-4xl space-y-8 px-4 md:px-0">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl flex flex-col md:flex-row gap-8 md:gap-12 items-center"
      >
        <div className="space-y-4 md:space-y-6 flex-1 text-center md:text-left">
           <div className="h-4 w-32 bg-slate-100 rounded-full mx-auto md:mx-0" />
           <h3 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">Automated Fee <br className="hidden md:block"/>Tracking.</h3>
           <div className="flex gap-4 justify-center md:justify-start">
              <div className="h-12 md:h-14 w-32 md:w-40 bg-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold text-xs md:text-base">REMITTANCE</div>
              <div className="h-12 md:h-14 w-12 md:w-14 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
              </div>
           </div>
        </div>

        <div className="flex-1 space-y-3 md:space-y-4 w-full">
           {[
             { name: 'John Doe', amount: '+15,000', label: 'Term 2 Fee Deposit', status: 'PAID' },
             { name: 'Jane Smith', amount: '-12,450', label: 'Uniform & Activity Balance', status: 'PENDING' },
             { name: 'Alex Munene', amount: '+22,000', label: 'Boarding Fee Full Payment', status: 'PAID' },
           ].map((i, idx) => (
             <motion.div
              key={idx}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + (idx * 0.2) }}
              className="bg-slate-50 p-4 md:p-6 rounded-xl md:rounded-2xl flex justify-between items-center border border-slate-100"
             >
                <div className="flex items-center gap-3 md:gap-4">
                   <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full border border-slate-100 flex items-center justify-center text-[10px] md:text-xs font-black text-slate-400">
                     {i.name.charAt(0)}
                   </div>
                   <div>
                     <div className="text-xs md:text-sm font-black text-slate-900">{i.name}</div>
                     <div className="text-[8px] md:text-[10px] font-bold text-slate-400">{i.label}</div>
                   </div>
                </div>
                <div className="text-right">
                   <div className={`text-xs md:text-base font-black ${i.status === 'PAID' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {i.amount}
                   </div>
                   <div className="text-[8px] font-black uppercase tracking-widest text-slate-300">{i.status}</div>
                </div>
             </motion.div>
           ))}
        </div>
      </motion.div>
    </div>
  );
}
