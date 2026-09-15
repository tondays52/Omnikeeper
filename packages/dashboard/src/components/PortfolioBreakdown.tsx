import React from 'react';
import { PieChart, Layers, ArrowUpRight, Shield, Coins, Sparkles } from 'lucide-react';

interface PortfolioBreakdownProps {
  safeUsdc: number;
  safeEth: number;
}

export const PortfolioBreakdown: React.FC<PortfolioBreakdownProps> = ({
  safeUsdc,
  safeEth
}) => {
  const assets = [
    {
      name: 'Aave V3 Collateral (Base)',
      symbol: 'aBasUSDC',
      chain: 'Base',
      allocation: '45%',
      valueUsd: 65400,
      yieldApy: '5.4% Supply APY',
      type: 'Lending Collateral',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      name: 'Safe Multisig Liquid Reserves',
      symbol: 'USDC + WETH',
      chain: 'Base',
      allocation: '28%',
      valueUsd: safeUsdc + (safeEth * 3150),
      yieldApy: 'Buffer Capital',
      type: 'Emergency Reserve',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      name: 'Hyperliquid Perps Margin',
      symbol: 'USDC Margin',
      chain: 'Arbitrum',
      allocation: '17%',
      valueUsd: 25000,
      yieldApy: '30.6% Funding APR',
      type: 'Delta-Neutral Basis',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      name: 'Polymarket CTF Outcome Tokens',
      symbol: 'YES (Rate Cut)',
      chain: 'Polygon',
      allocation: '10%',
      valueUsd: 15000,
      yieldApy: 'Macro Downside Hedge',
      type: 'Conditional Tokens',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    }
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Multi-Chain Treasury Allocation & Yield Engine</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                4 Protocols Active
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Live non-custodial capital deployed across Safe, Aave V3, Polymarket CTF, and Hyperliquid.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Total Net Yield:</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
            +14.8% Blended APR
          </span>
        </div>
      </div>

      {/* Visual Allocation Bar */}
      <div className="space-y-2 mb-6">
        <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex">
          <div className="bg-indigo-500 h-full w-[45%]" title="Aave V3: 45%" />
          <div className="bg-emerald-500 h-full w-[28%]" title="Safe Reserves: 28%" />
          <div className="bg-teal-400 h-full w-[17%]" title="Hyperliquid Basis: 17%" />
          <div className="bg-purple-500 h-full w-[10%]" title="Polymarket Hedge: 10%" />
        </div>
        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-500"></span> Aave Collateral (45%)</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Safe Buffer (28%)</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal-400"></span> Hyperliquid Basis (17%)</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-purple-500"></span> Polymarket Hedge (10%)</span>
        </div>
      </div>

      {/* Asset Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {assets.map((asset, i) => (
          <div key={i} className="bg-slate-900/80 rounded-xl p-4 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${asset.badgeColor}`}>
                  {asset.chain}
                </span>
                <span className="text-xs font-bold text-slate-400">{asset.allocation}</span>
              </div>
              <h3 className="font-bold text-slate-200 text-xs truncate mb-1">{asset.name}</h3>
              <p className="text-[11px] text-slate-400 mono">{asset.symbol}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] text-slate-400">Value:</span>
                <span className="font-bold text-white text-sm mono">${asset.valueUsd.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] text-slate-400">Strategy Yield:</span>
                <span className="font-semibold text-emerald-400 text-xs">{asset.yieldApy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
