import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';

export default function InsightsEngine({ insights = [] }: { insights?: any[] }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl"><Lightbulb size={20} /></div>
        <h3 className="text-lg font-black text-slate-900">AI Recommendations</h3>
      </div>

      <div className="space-y-4">
        {insights?.length > 0 ? insights.map((insight, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border flex gap-4 items-start ${
            insight.type === 'success' ? 'bg-emerald-50 border-emerald-100' :
            insight.type === 'warning' ? 'bg-amber-50 border-amber-100' : 
            'bg-slate-50 border-slate-200'
          }`}>
            <div className={`mt-0.5 ${
              insight.type === 'success' ? 'text-emerald-500' :
              insight.type === 'warning' ? 'text-amber-500' : 
              'text-slate-500'
            }`}>
              {insight.type === 'success' ? <TrendingUp size={20} /> : <AlertTriangle size={20} />}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">{insight.title}</h4>
              <p className="text-sm font-medium text-slate-600">{insight.message}</p>
            </div>
          </div>
        )) : (
        <div className="text-sm text-slate-500">No insights available yet.</div>
      )}
      </div>
    </div>
  );
}