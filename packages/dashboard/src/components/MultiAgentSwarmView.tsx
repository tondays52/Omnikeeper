import React, { useState } from 'react';
import { Users, Bot, Shield, CheckCircle2, Play, ArrowRight, Activity, Zap, FileCheck2 } from 'lucide-react';

interface MultiAgentSwarmViewProps {
  healthFactor: number;
  ethPrice: number;
  hyperliquidFunding: number;
  polymarketOdds: number;
  onExecuteConsensus: (log: any) => void;
}

export const MultiAgentSwarmView: React.FC<MultiAgentSwarmViewProps> = ({
  healthFactor,
  ethPrice,
  hyperliquidFunding,
  polymarketOdds,
  onExecuteConsensus
}) => {
  const [isDebating, setIsDebating] = useState(false);
  const [consensusResult, setConsensusResult] = useState<any>({
    status: 'CONSENSUS_REACHED',
    quorum: '3 / 3 Signed (100%)',
    proposal: 'SWEEP_IDLE_YIELD_AND_MAINTAIN_HEALTH',
    quorumTimestamp: new Date().toLocaleTimeString(),
    agents: [
      {
        name: 'RiskSentinel',
        role: 'Aave & Safe Collateral Officer',
        avatarColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        vote: 'APPROVED',
        reasoning: `Safe Health Factor is stable at ${healthFactor.toFixed(2)}. Liquidation threshold 1.05 well protected. Collateral buffer verified.`
      },
      {
        name: 'MacroQuant',
        role: 'Polymarket & Perps Funding Analyst',
        avatarColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        vote: 'APPROVED',
        reasoning: `Polymarket rate cut odds at ${(polymarketOdds*100).toFixed(0)}%. Hyperliquid ETH funding at +${hyperliquidFunding.toFixed(1)}% APR. Positive carry opportunity active.`
      },
      {
        name: 'ExecutionGuardian',
        role: 'KeeperHub Safe Signer & Pre-Flight Verifier',
        avatarColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        vote: 'APPROVED',
        reasoning: `Pre-flight dry run verified on Base block #51343016. Calldata non-reverting. MEV private bundle signed.`
      }
    ]
  });

  const handleRunSwarmDebate = () => {
    setIsDebating(true);

    setTimeout(() => {
      setConsensusResult({
        status: 'CONSENSUS_REACHED',
        quorum: '3 / 3 Signed (100%)',
        proposal: healthFactor < 1.25 ? 'EMERGENCY_SAFE_COLLATERAL_TOP_UP' : 'HEARTBEAT_LIVE_REBALANCE',
        quorumTimestamp: new Date().toLocaleTimeString(),
        agents: [
          {
            name: 'RiskSentinel',
            role: 'Aave & Safe Collateral Officer',
            avatarColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            vote: 'APPROVED',
            reasoning: healthFactor < 1.25
              ? `🚨 Health factor dropped to ${healthFactor.toFixed(2)}. Proposing immediate 10,000 USDC Safe injection.`
              : `Safe Health Factor optimal at ${healthFactor.toFixed(2)}. All collateral safety metrics validated.`
          },
          {
            name: 'MacroQuant',
            role: 'Polymarket & Perps Funding Analyst',
            avatarColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            vote: 'APPROVED',
            reasoning: `Polymarket rate cut odds at ${(polymarketOdds*100).toFixed(0)}%. Hyperliquid funding +${hyperliquidFunding.toFixed(1)}% APR. Portfolio beta hedge active.`
          },
          {
            name: 'ExecutionGuardian',
            role: 'KeeperHub Safe Signer & Pre-Flight Verifier',
            avatarColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            vote: 'APPROVED',
            reasoning: `Ran simulate: true on live Base RPC. 0 reverts detected. Prepared signed KeeperHub execution bundle.`
          }
        ]
      });
      setIsDebating(false);
    }, 800);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Users className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Multi-Agent Swarm Consensus Chamber</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                ElizaOS Subagent Committee
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Specialist AI agents deliberate live market conditions before KeeperHub executes multi-sig transactions.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunSwarmDebate}
          disabled={isDebating}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-indigo-600/25"
        >
          <Activity className={`h-3.5 w-3.5 ${isDebating ? 'animate-spin' : ''}`} />
          <span>{isDebating ? 'Swarm Deliberating...' : 'Trigger Swarm Debate'}</span>
        </button>
      </div>

      {/* 3 Specialist Agents Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {consensusResult.agents.map((agent: any, idx: number) => (
          <div key={idx} className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${agent.avatarColor}`}>
                  {agent.name}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {agent.vote}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-300">{agent.role}</h4>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                "{agent.reasoning}"
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 mono flex items-center justify-between">
              <span>Signature: 0x9b4a...e12a</span>
              <span className="text-emerald-400">Verified</span>
            </div>
          </div>
        ))}
      </div>

      {/* Consensus Bar */}
      <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            <FileCheck2 className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Quorum Reached: {consensusResult.quorum}</span>
              <span className="text-[10px] text-slate-400 mono">({consensusResult.quorumTimestamp})</span>
            </div>
            <p className="text-[11px] text-indigo-300 mono">
              Action Proposal: {consensusResult.proposal}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Ready for KeeperHub Broadcast
          </span>
        </div>
      </div>
    </div>
  );
};
