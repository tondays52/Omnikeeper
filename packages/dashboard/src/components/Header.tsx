import React from 'react';
import { Shield, Cpu, Activity, Lock, CheckCircle2, Globe, Bot, Sliders, History, Wand2 } from 'lucide-react';

interface HeaderProps {
  network: string;
  setNetwork: (net: string) => void;
  isRunning: boolean;
  isAutoPilot: boolean;
  onToggleAutoPilot: () => void;
  onRunCycle: () => void;
  onOpenCoPilot: () => void;
  onOpenPolicyModal: () => void;
  onOpenBlackSwan: () => void;
  onOpenPromptToDag: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  network,
  setNetwork,
  isRunning,
  isAutoPilot,
  onToggleAutoPilot,
  onRunCycle,
  onOpenCoPilot,
  onOpenPolicyModal,
  onOpenBlackSwan,
  onOpenPromptToDag
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                OmniKeeper
              </h1>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                AegisAgent
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>ElizaOS Brain</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">KeeperHub Execution & Pre-Flight</span>
            </p>
          </div>
        </div>

        {/* Status & Control Actions */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Black Swan Backtesting Trigger */}
          <button
            onClick={onOpenBlackSwan}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/30 text-amber-300 font-medium transition"
          >
            <History className="h-3.5 w-3.5 text-amber-400" />
            <span>Time-Travel Replay</span>
          </button>

          {/* Prompt to DAG Trigger */}
          <button
            onClick={onOpenPromptToDag}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/30 hover:bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 font-medium transition"
          >
            <Wand2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>Prompt-to-DAG</span>
          </button>

          {/* Policy Config Trigger */}
          <button
            onClick={onOpenPolicyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium transition"
          >
            <Sliders className="h-3.5 w-3.5 text-indigo-400" />
            <span>Risk Policies</span>
          </button>

          {/* Co-Pilot Modal Trigger */}
          <button
            onClick={onOpenCoPilot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-purple-300 font-semibold transition shadow-sm"
          >
            <Bot className="h-3.5 w-3.5 text-purple-400" />
            <span>ElizaOS Co-Pilot</span>
          </button>

          {/* Auto-Pilot Toggle */}
          <button
            onClick={onToggleAutoPilot}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
              isAutoPilot
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isAutoPilot ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>{isAutoPilot ? 'Auto-Sync Active' : 'Auto-Sync Off'}</span>
          </button>

          {/* Trigger Cycle Button */}
          <button
            onClick={onRunCycle}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/25 active:scale-95 disabled:opacity-50"
          >
            <Activity className={`h-3.5 w-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Running Cycle...' : 'Execute Strategy'}
          </button>
        </div>
      </div>
    </header>
  );
};
