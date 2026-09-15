import React from 'react';
import { ShieldCheck, Target, BarChart3, ArrowRight, Play, RefreshCw, AlertTriangle } from 'lucide-react';

interface StrategyProps {
  onTriggerSafeTopUp: () => void;
  onTriggerPolymarketHedge: () => void;
  onTriggerHyperliquidBasis: () => void;
  onDipHealthFactor: () => void;
  healthFactor: number;
  polymarketOdds: number;
  hyperliquidFunding: number;
  isSimulating: boolean;
}

export const LiveStrategyCards: React.FC<StrategyProps> = ({
  onTriggerSafeTopUp,
  onTriggerPolymarketHedge,
  onTriggerHyperliquidBasis,
  onDipHealthFactor,
  healthFactor,
  polymarketOdds,
  hyperliquidFunding,
  isSimulating
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Strategy 1: Safe Treasury & Aave Collateral Guardian */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between relative border-slate-800 hover:border-indigo-500/40 transition">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Safe & Aave Guardian</h3>
                <span className="text-[11px] text-slate-400">Pillar 1: Yield & Liquidation Defense</span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active
            </span>
          </div>

          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Continuously monitors Aave V3 lending positions on Base. If Health Factor drops below <span className="font-semibold text-white">1.20</span>, KeeperHub dry-runs and deterministically tops up collateral via Safe multisig.
          </p>

          <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs mb-4">
            <div className="flex justify-between text-slate-400">
              <span>Current Health Factor:</span>
              <span className={`font-bold ${healthFactor < 1.2 ? 'text-red-400' : 'text-emerald-400'}`}>{healthFactor.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Execution Layer:</span>
              <span className="mono text-indigo-300 font-medium">KeeperHub Safe Integration</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Pre-Flight Check:</span>
              <span className="text-emerald-400 font-medium">simulate: true (Zero Revert)</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-800">
          <button
            onClick={onTriggerSafeTopUp}
            disabled={isSimulating}
            className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50 shadow-md shadow-indigo-600/20"
          >
            <Play className="h-3.5 w-3.5" />
            <span>Simulate & Top-Up Collateral</span>
          </button>
          <button
            onClick={onDipHealthFactor}
            disabled={isSimulating}
            className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center justify-center gap-1.5 transition"
          >
            <AlertTriangle className="h-3 w-3 text-amber-400" />
            <span>Stress Test: Simulate Market Crash (HF 1.15)</span>
          </button>
        </div>
      </div>

      {/* Strategy 2: Polymarket Event Risk Hedger */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between relative border-slate-800 hover:border-purple-500/40 transition">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Polymarket Event Hedger</h3>
                <span className="text-[11px] text-slate-400">Pillar 2: Macro Probability Arbitrage</span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Active
            </span>
          </div>

          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Scans Polymarket CTF orderbook spreads. When macro odds trigger probability divergence (&gt;65%), KeeperHub executes simulated hedges to protect portfolio downside.
          </p>

          <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs mb-4">
            <div className="flex justify-between text-slate-400">
              <span>Target Market:</span>
              <span className="text-slate-200 font-medium truncate max-w-[170px]">Fed 50bps Rate Cut</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Implied Probability:</span>
              <span className="font-bold text-purple-400">{(polymarketOdds * 100).toFixed(0)}% (YES)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Action Plugin:</span>
              <span className="mono text-indigo-300">@keeperhub/plugin-polymarket</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={onTriggerPolymarketHedge}
            disabled={isSimulating}
            className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50 shadow-md shadow-purple-600/20"
          >
            <Play className="h-3.5 w-3.5" />
            <span>Simulate & Execute CTF Hedge</span>
          </button>
        </div>
      </div>

      {/* Strategy 3: Hyperliquid Basis Sentinel */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between relative border-slate-800 hover:border-emerald-500/40 transition">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Hyperliquid Basis Sentinel</h3>
                <span className="text-[11px] text-slate-400">Pillar 3: Delta-Neutral Funding Arb</span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active
            </span>
          </div>

          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Harvests positive perpetual funding rates on Hyperliquid (Short Perp) while holding spot on Uniswap V3 (Base) in an atomic, delta-neutral basis loop.
          </p>

          <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs mb-4">
            <div className="flex justify-between text-slate-400">
              <span>Perp Asset:</span>
              <span className="text-slate-200 font-medium">ETH-PERP (Hyperliquid)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Funding Rate:</span>
              <span className="font-bold text-emerald-400">+{hyperliquidFunding.toFixed(1)}% APR</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Spot Leg:</span>
              <span className="mono text-indigo-300">Uniswap V3 (Base WETH)</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={onTriggerHyperliquidBasis}
            disabled={isSimulating}
            className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50 shadow-md shadow-emerald-600/20"
          >
            <Play className="h-3.5 w-3.5" />
            <span>Simulate & Rebalance Basis</span>
          </button>
        </div>
      </div>
    </div>
  );
};
