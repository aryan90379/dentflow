import React, { useState } from 'react';
import { Zap, Target, MapPin, Users, CalendarClock, IndianRupee } from 'lucide-react';

export default function AdvancedBuilder({ availableTreatments, onLaunch }: { availableTreatments: string[], onLaunch: (payload: any) => void }) {
  const [isLaunching, setIsLaunching] = useState(false);
  const [budget, setBudget] = useState(1000);
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [location, setLocation] = useState('Mumbai');
  const [radius, setRadius] = useState(10);

  // Dynamic Patient Estimator (Mock formula for UI)
  const estimatedPatients = Math.floor(budget / 500); 

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24">
      
      {/* LEFT COLUMN: Controls */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Treatments Selection */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl"><Target size={20} /></div>
            <h3 className="text-lg font-black text-slate-900">What do you want to promote?</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {availableTreatments.map(t => (
              <button key={t} onClick={() => setSelectedTreatments(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                  selectedTreatments.includes(t) ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Audience & Location */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <MapPin size={20} className="text-slate-400" />
              <h3 className="font-bold text-slate-700">Target Location</h3>
            </div>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all" />
            <div className="flex justify-between text-xs font-bold text-slate-500 mt-2">
              <span>Radius: {radius}km</span>
              <input type="range" min="5" max="50" value={radius} onChange={e => setRadius(Number(e.target.value))} className="w-32 accent-indigo-600" />
            </div>
          </div>

          <div className="w-px bg-slate-100 hidden md:block" />

          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <CalendarClock size={20} className="text-slate-400" />
              <h3 className="font-bold text-slate-700">Ad Schedule</h3>
            </div>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500">
              <option>Run 24/7 (Recommended)</option>
              <option>Only during Clinic Hours</option>
            </select>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Budget & Launch */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-bl-full blur-2xl" />
          
          <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <IndianRupee size={16} className="text-emerald-400" /> Daily Budget
          </h3>
          
          <div className="mb-8">
            <span className="text-5xl font-black">₹{budget}</span>
            <span className="text-slate-400 font-bold ml-1">/day</span>
          </div>
          
          <input type="range" min="300" max="5000" step="100" value={budget} onChange={(e) => setBudget(Number(e.target.value))} 
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400 mb-8" 
          />

          <div className="p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl mb-8">
            <p className="text-xs font-bold text-indigo-300 uppercase mb-1">Expected Results</p>
            <p className="text-xl font-black text-white flex items-center gap-2">
              <Users size={20} className="text-indigo-400" /> ~{estimatedPatients} to {estimatedPatients + 3} Patients /mo
            </p>
          </div>

      <button 
            disabled={selectedTreatments.length === 0 || isLaunching} 
            onClick={async () => {
              setIsLaunching(true);
              await onLaunch({ budgetAmount: budget, selectedTreatments, location, radius });
              setIsLaunching(false);
            }}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:bg-slate-700 text-slate-900 font-black rounded-xl text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            {isLaunching ? <span className="animate-spin border-2 border-slate-900 border-t-transparent w-5 h-5 rounded-full" /> : <Zap fill="currentColor" size={20} />} 
            {isLaunching ? "Launching..." : "Launch Campaign"}
          </button>
        </div>
      </div>

    </div>
  );
}