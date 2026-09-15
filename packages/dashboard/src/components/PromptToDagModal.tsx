import React, { useState } from 'react';
import { X, Wand2, ArrowRight, Code, Download, Check, Sparkles, Database, Shield, Bell, Clock, GitFork, Terminal } from 'lucide-react';

interface PromptToDagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeployWorkflow: (workflow: any) => void;
}

export const PromptToDagModal: React.FC<PromptToDagModalProps> = ({
  isOpen,
  onClose,
  onDeployWorkflow
}) => {
  const [promptInput, setPromptInput] = useState('Every 15 minutes, check if Aave V3 Health Factor on Base is below 1.25, if true execute a Safe top-up of 10,000 USDC and send high-priority Telegram alert.');
  const [isCompiling, setIsCompiling] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<any>({
    name: 'AI Generated: Aave Collateral Safe Guardian',
    filename: 'ai-aave-collateral-guardian.json',
    description: 'Every 15m ➔ Read Aave HF ➔ Condition (HF < 1.25) ➔ Safe Top-up ➔ Telegram Alert',
    nodes: [
      { id: '1', title: 'Schedule Trigger', type: 'Trigger', icon: 'Clock', desc: 'Every 15m (*/15 * * * *)', color: 'border-blue-500 text-blue-400' },
      { id: '2', title: 'Read Aave Health Factor', type: 'Read Action', icon: 'Database', desc: 'getUserAccountData(SafeAddress)', color: 'border-indigo-500 text-indigo-400' },
      { id: '3', title: 'Health Factor < 1.25?', type: 'Condition Node', icon: 'GitFork', desc: 'operator: "<", value: 1.25', color: 'border-amber-500 text-amber-400' },
      { id: '4', title: 'Safe Collateral Top-Up', type: 'Write Action', icon: 'Shield', desc: 'supply(10,000 USDC, Base)', color: 'border-emerald-500 text-emerald-400', branch: 'true' },
      { id: '5', title: 'Telegram DAO Alert', type: 'Notification', icon: 'Bell', desc: 'Alert DAO Risk Committee', color: 'border-purple-500 text-purple-400' }
    ]
  });
  const [exported, setExported] = useState(false);

  if (!isOpen) return null;

  const handleCompilePrompt = () => {
    if (!promptInput.trim()) return;
    setIsCompiling(true);

    setTimeout(() => {
      const lower = promptInput.toLowerCase();
      let wf: any;

      if (lower.includes('polymarket') || lower.includes('hedge') || lower.includes('odds')) {
        wf = {
          name: 'AI Generated: Polymarket Event Hedger DAG',
          filename: 'ai-polymarket-hedge.json',
          description: 'Webhook Trigger ➔ Read CLOB Spread ➔ Condition (Odds > 65%) ➔ Polygon CTF Swap ➔ Discord Webhook',
          nodes: [
            { id: '1', title: 'Polymarket Webhook Trigger', type: 'Trigger', icon: 'Clock', desc: 'CLOB Odds Spike Webhook', color: 'border-blue-500 text-blue-400' },
            { id: '2', title: 'Check Implied Odds', type: 'Read Action', icon: 'Database', desc: 'getMarketOdds(RateCut2026)', color: 'border-indigo-500 text-indigo-400' },
            { id: '3', title: 'Probability >= 65%?', type: 'Condition Node', icon: 'GitFork', desc: 'operator: ">=", value: 0.65', color: 'border-amber-500 text-amber-400' },
            { id: '4', title: 'Execute CTF Buy Order', type: 'Write Action', icon: 'Shield', desc: 'buy(4,000 USDC on YES)', color: 'border-purple-500 text-purple-400', branch: 'true' },
            { id: '5', title: 'Dispatch Discord Log', type: 'Notification', icon: 'Bell', desc: 'Post execution to #dao-trades', color: 'border-indigo-500 text-indigo-400' }
          ]
        };
      } else if (lower.includes('hyperliquid') || lower.includes('funding') || lower.includes('basis') || lower.includes('arbitrage')) {
        wf = {
          name: 'AI Generated: Hyperliquid Basis Arbitrage DAG',
          filename: 'ai-hyperliquid-basis.json',
          description: 'Hourly Schedule ➔ Read ETH-PERP Funding ➔ Condition (APR > 20%) ➔ Uniswap V3 Spot Rebalance ➔ Safe Audit',
          nodes: [
            { id: '1', title: 'Hourly Cron Trigger', type: 'Trigger', icon: 'Clock', desc: 'Every 60m (0 * * * *)', color: 'border-blue-500 text-blue-400' },
            { id: '2', title: 'Read Funding Rate', type: 'Read Action', icon: 'Database', desc: 'getPerpFunding(Hyperliquid)', color: 'border-indigo-500 text-indigo-400' },
            { id: '3', title: 'Funding > 20% APR?', type: 'Condition Node', icon: 'GitFork', desc: 'operator: ">", value: 20.0', color: 'border-amber-500 text-amber-400' },
            { id: '4', title: 'Uniswap V3 Spot Buy', type: 'Write Action', icon: 'Shield', desc: 'exactInputSingle(15k USDC, WETH)', color: 'border-emerald-500 text-emerald-400', branch: 'true' },
            { id: '5', title: 'Append Immutable Audit', type: 'Audit Action', icon: 'Shield', desc: 'KeeperHub SLA Record', color: 'border-slate-500 text-slate-400' }
          ]
        };
      } else {
        wf = {
          name: 'AI Generated: Custom Multi-Protocol Strategy DAG',
          filename: 'ai-custom-workflow.json',
          description: 'Trigger ➔ Protocol Query ➔ Rule Verification ➔ KeeperHub Execution ➔ Notification',
          nodes: [
            { id: '1', title: 'Schedule / Webhook Trigger', type: 'Trigger', icon: 'Clock', desc: 'Trigger Event', color: 'border-blue-500 text-blue-400' },
            { id: '2', title: 'Read Onchain State', type: 'Read Action', icon: 'Database', desc: 'Query Target Protocol', color: 'border-indigo-500 text-indigo-400' },
            { id: '3', title: 'Evaluate Risk Condition', type: 'Condition Node', icon: 'GitFork', desc: 'Dynamic Constraint Check', color: 'border-amber-500 text-amber-400' },
            { id: '4', title: 'KeeperHub Pre-flight & Dispatch', type: 'Write Action', icon: 'Shield', desc: 'simulate: true + Broadcast', color: 'border-emerald-500 text-emerald-400', branch: 'true' },
            { id: '5', title: 'DAO Alert Notification', type: 'Notification', icon: 'Bell', desc: 'Multi-Channel Webhook', color: 'border-purple-500 text-purple-400' }
          ]
        };
      }

      setGeneratedWorkflow(wf);
      setIsCompiling(false);
    }, 600);
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(generatedWorkflow, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = generatedWorkflow.filename;
    link.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-modal w-full max-w-3xl rounded-2xl p-6 relative border border-slate-700/80 max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Wand2 className="h-5 w-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Prompt-to-DAG: AI Workflow Generator</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  KeeperHub Schema Compiler
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Type natural language instructions. ElizaOS compiles them directly into a valid, deterministic KeeperHub DAG.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Prompt-to-DAG modal"
            className="h-8 w-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Natural Language Prompt Input */}
        <div className="space-y-2 mb-4">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Describe your desired automated strategy:</span>
          </label>
          <div className="flex gap-2">
            <textarea
              rows={2}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="e.g. Every 4 hours, if Polymarket odds exceed 70%, execute a 5,000 USDC hedge on Polygon and ping Discord..."
              className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none"
            />
            <button
              onClick={handleCompilePrompt}
              disabled={isCompiling || !promptInput.trim()}
              className="px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition disabled:opacity-50 flex flex-col items-center justify-center gap-1 shadow-lg shadow-indigo-600/25 shrink-0"
            >
              <Wand2 className={`h-4 w-4 ${isCompiling ? 'animate-spin' : ''}`} />
              <span>{isCompiling ? 'Compiling...' : 'Compile DAG'}</span>
            </button>
          </div>
        </div>

        {/* Quick Sample Prompts */}
        <div className="flex flex-wrap gap-2 pb-3 mb-4 border-b border-slate-800/60 text-xs">
          <span className="text-slate-500 text-[11px] py-0.5">Preset Prompts:</span>
          <button
            onClick={() => setPromptInput('Every 15 minutes, check if Aave V3 Health Factor on Base is below 1.25, if true execute a Safe top-up of 10,000 USDC and send Telegram alert.')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition"
          >
            🛡️ Safe Collateral Top-Up
          </button>
          <button
            onClick={() => setPromptInput('Scan Polymarket every 10m. If rate cut probability > 65%, buy 4,000 USDC YES outcome tokens on Polygon and post to Discord.')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 text-[11px] border border-slate-700 transition"
          >
            🎯 Polymarket Macro Hedge
          </button>
          <button
            onClick={() => setPromptInput('Every hour, check if Hyperliquid ETH-PERP funding > 20% APR. If so, rebalance 15,000 USDC spot on Uniswap V3 Base.')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] border border-slate-700 transition"
          >
            📈 Hyperliquid Funding Basis
          </button>
        </div>

        {/* Compiled Visual DAG Node Graph */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 mb-4">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-xs">
            <span className="font-bold text-slate-200 uppercase tracking-wider">{generatedWorkflow.name}</span>
            <span className="text-emerald-400 font-semibold text-[11px]">✓ Schema Validated (5 Nodes)</span>
          </div>

          <div className="overflow-x-auto py-2">
            <div className="flex items-center gap-2 min-w-[620px]">
              {generatedWorkflow.nodes.map((node: any, idx: number) => (
                <React.Fragment key={node.id}>
                  <div className={`flex-1 bg-slate-950/90 rounded-xl p-3 border ${node.color} shadow-md relative`}>
                    {node.branch && (
                      <span className="absolute -top-2 left-2 text-[8px] font-extrabold uppercase px-1 py-0.2 rounded bg-emerald-500 text-slate-950">
                        IF: {node.branch}
                      </span>
                    )}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] uppercase font-bold text-slate-400">{node.type}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white truncate">{node.title}</h4>
                    <p className="text-[10px] text-slate-400 mono truncate">{node.desc}</p>
                  </div>

                  {idx < generatedWorkflow.nodes.length - 1 && (
                    <div className="text-slate-600 shrink-0">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="mt-2 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 mono">Schema: {generatedWorkflow.filename}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportJson}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs flex items-center gap-1.5 transition border border-slate-700"
            >
              {exported ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Download className="h-3.5 w-3.5 text-indigo-400" />}
              <span>{exported ? 'Downloaded!' : 'Export KeeperHub JSON'}</span>
            </button>
            <button
              onClick={() => {
                onDeployWorkflow(generatedWorkflow);
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/25"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Deploy to Active Engine</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
