import React from 'react';
import { Terminal, Shield, CheckCircle2, AlertTriangle, Clock, Bot } from 'lucide-react';

export interface DecisionLog {
  id: string;
  timestamp: string;
  strategy: string;
  reasoning: string;
  actionTaken: string;
  simulatedGas?: string;
  simulationStatus: 'PASSED' | 'FAILED_REVERT' | 'FAILED_BALANCE';
  txHash?: string;
  explorerUrl?: string;
  status: 'COMPLETED' | 'SIMULATED' | 'BLOCKED_BY_SAFETY';
}

interface AgentThoughtLogProps {
  logs: DecisionLog[];
}

export const AgentThoughtLog: React.FC<AgentThoughtLogProps> = ({ logs }) => {
  return (
    <div className="glass-panel rounded-2xl p-6 border-slate-800 flex flex-col h-[520px]">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">ElizaOS Agent Live Reasoning Feed</h2>
            <span className="text-[11px] text-slate-400">Probabilistic reasoning with deterministic KeeperHub execution</span>
          </div>
        </div>
        <span className="text-[11px] mono text-slate-400 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          Streaming
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500">
            Awaiting next agent execution cycle...
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-400 uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                    {log.strategy.replace(/_/g, ' ')}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 text-[11px] mono">
                    <Clock className="h-3 w-3" />
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    log.simulationStatus === 'PASSED'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {log.simulationStatus === 'PASSED' ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <AlertTriangle className="h-3 w-3" />
                  )}
                  Pre-flight: {log.simulationStatus}
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                {log.reasoning}
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="text-slate-500 font-medium">Action:</span>
                  <span className="font-semibold text-slate-200 mono">{log.actionTaken}</span>
                </div>

                {log.txHash && (
                  <a
                    href={log.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] mono text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 hover:underline"
                  >
                    <span>Tx: {log.txHash.substring(0, 10)}...{log.txHash.substring(log.txHash.length - 8)}</span>
                    <span>↗</span>
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
