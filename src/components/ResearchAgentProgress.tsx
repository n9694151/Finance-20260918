import React from 'react';
import { CheckCircle2, Loader2, Bot, AlertTriangle, ArrowRight } from 'lucide-react';

export interface AgentStep {
  id: string;
  name: string;
  agent: string;
  source: string;
  status: 'pending' | 'in-progress' | 'completed' | 'warning';
  detail?: string;
}

interface ResearchAgentProgressProps {
  steps: AgentStep[];
  currentStepIndex: number;
  targetSymbol: string;
}

export const ResearchAgentProgress: React.FC<ResearchAgentProgressProps> = ({
  steps,
  currentStepIndex,
  targetSymbol,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
            <h3 className="font-bold text-base text-slate-100">
              多 Agent 協同研究總控引擎正在執行
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            目標標的：<span className="text-cyan-300 font-mono font-bold text-sm">{targetSymbol}</span> ‧ 正在依序串接官方數據、輿情萃取與逆向風控
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span>進度：</span>
          <span className="text-cyan-400 font-bold">{Math.min(currentStepIndex + 1, steps.length)}</span>
          <span>/</span>
          <span>{steps.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
        {steps.map((step, idx) => {
          const isCurrent = idx === currentStepIndex;
          const isDone = idx < currentStepIndex || step.status === 'completed';
          const isPending = idx > currentStepIndex && step.status === 'pending';

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-cyan-950/30 border-cyan-500/50 shadow-md shadow-cyan-950/40'
                  : isDone
                  ? 'bg-slate-950/50 border-emerald-500/20'
                  : 'bg-slate-950/20 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-mono shrink-0">
                      {idx + 1}
                    </span>
                  )}
                  <span className={`text-xs font-semibold ${isCurrent ? 'text-cyan-200' : isDone ? 'text-slate-200' : 'text-slate-400'}`}>
                    {step.name}
                  </span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 font-mono">
                  {step.agent}
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 pl-6 flex items-center justify-between">
                <span>來源: {step.source}</span>
                {isCurrent && <span className="text-cyan-400 animate-pulse">分析中...</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
