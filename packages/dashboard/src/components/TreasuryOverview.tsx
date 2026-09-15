import React from 'react';
import { DollarSign, ShieldAlert, TrendingUp, Zap, Sparkles } from 'lucide-react';

interface TreasuryOverviewProps {
  healthFactor: number;
  totalAssetsUsd: number;
  safeUsdc: number;
  safeEth: number;
  gasSavedUsd: number;
}

export const TreasuryOverview: React.FC<TreasuryOverviewProps> = ({
  healthFactor,
  totalAssetsUsd,
  safeUsdc,
  safeEth,
  gasSavedUsd
}) => {
  const isHfHealthy = healthFactor >= 1.25;
  const isHfCritical = healthFactor < 1.20;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Managed Treasury */}
      <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Treasury Value</span>
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-white tracking-tight">
          ${totalAssetsUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>Safe Reserves:</span>
          <span className="font-semibold text-slate-200 mono">${safeUsdc.toLocaleString()} USDC + {safeEth} ETH</span>
        </div>
        <div className="absolute top-0 right-0 h-16 w-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
      </div>

      {/* Card 2: Aave Health Factor */}
      <div className={`glass-panel rounded-2xl p-5 relative overflow-hidden group transition ${isHfCritical ? 'border-red-500/50 bg-red-950/20' : 'hover:border-slate-700'}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Aave V3 Health Factor</span>
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${isHfCritical ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
            <ShieldAlert className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <div className={`text-2xl font-black tracking-tight ${isHfCritical ? 'text-red-400' : isHfHealthy ? 'text-emerald-400' : 'text-amber-400'}`}>
            {healthFactor.toFixed(2)}
          </div>
          <span className="text-xs font-medium text-slate-400">
            {isHfCritical ? '(Liquidation Risk!)' : '(Target: > 1.30)'}
          </span>
        </div>
        <div className="mt-3 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isHfCritical ? 'bg-red-500 w-[35%]' : isHfHealthy ? 'bg-emerald-400 w-[75%]' : 'bg-amber-400 w-[55%]'}`}
          ></div>
        </div>
      </div>

      {/* Card 3: Active APY & Strategies */}
      <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Blended Strategy APY</span>
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-emerald-400 tracking-tight flex items-center gap-1.5">
          <span>+14.8%</span>
          <span className="text-xs font-normal text-slate-400">Net APR</span>
        </div>
        <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Aave 5.4%</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Basis 30.6%</span>
        </div>
      </div>

      {/* Card 4: Pre-flight Simulation Guard Gas Saved */}
      <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Dry-Run Gas Saved</span>
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Zap className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-amber-400 tracking-tight">
          ${gasSavedUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Intercepted 14 bad/reverted transactions</span>
        </div>
      </div>
    </div>
  );
};
