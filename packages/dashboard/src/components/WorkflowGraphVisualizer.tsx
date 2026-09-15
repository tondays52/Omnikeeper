import React, { useState } from 'react';
import { GitFork, Clock, Webhook, CheckCircle2, ArrowRight, Shield, Bell, Send, Database, Download, Code, Check } from 'lucide-react';

export const WorkflowGraphVisualizer: React.FC = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<'safe' | 'polymarket' | 'hyperliquid'>('safe');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const workflows = {
    safe: {
      name: 'Aegis Safe Collateral & Yield Sentinel',
      filename: 'safe-collateral-guardian.json',
      description: 'Scheduled every 5m ➔ Queries Aave V3 HF ➔ Condition (HF < 1.20) ➔ Safe USDC Top-up ➔ Telegram Alert',
      nodes: [
        {
          id: 'node_1',
          title: 'Schedule Trigger',
          type: 'Trigger',
          icon: Clock,
          desc: 'Every 5 Minutes (*/5 * * * *)',
          color: 'border-blue-500 text-blue-400',
          details: { cron: '*/5 * * * *', timezone: 'UTC', enabled: true }
        },
        {
          id: 'node_2',
          title: 'Read Aave Health Factor',
          type: 'Read Action',
          icon: Database,
          desc: 'getUserAccountData(Safe)',
          color: 'border-indigo-500 text-indigo-400',
          details: { contract: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5', method: 'getUserAccountData', network: 8453 }
        },
        {
          id: 'node_3',
          title: 'Health Factor < 1.20?',
          type: 'Condition Node',
          icon: GitFork,
          desc: 'operator: "<", value: 1.20',
          color: 'border-amber-500 text-amber-400',
          details: { leftOperand: '{{node_2.healthFactor}}', operator: '<', rightOperand: 1.20 }
        },
        {
          id: 'node_4',
          title: 'Safe Top-Up Collateral',
          type: 'Write Action',
          icon: Shield,
          desc: 'supply(10,000 USDC, Base)',
          color: 'border-emerald-500 text-emerald-400',
          branch: 'true',
          details: { action: 'safe_supply', asset: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', amount: '10000000000', simulate: true }
        },
        {
          id: 'node_5',
          title: 'Dispatch Telegram Alert',
          type: 'Notification',
          icon: Bell,
          desc: 'High Priority Alert to DAO',
          color: 'border-purple-500 text-purple-400',
          details: { channel: 'telegram_dao_risk', priority: 'critical', template: 'Safe collateral topped up to maintain HF' }
        }
      ]
    },
    polymarket: {
      name: 'Polymarket Macro Event Risk Hedger',
      filename: 'polymarket-hedge.json',
      description: 'Webhook Trigger ➔ Read CLOB Probability ➔ Condition (Odds > 65%) ➔ Polygon CTF Hedge ➔ Discord Log',
      nodes: [
        {
          id: 'node_1',
          title: 'Webhook Trigger',
          type: 'Trigger',
          icon: Webhook,
          desc: 'Polymarket Odds Webhook',
          color: 'border-blue-500 text-blue-400',
          details: { endpoint: '/webhook/polymarket/clob-event', auth: 'bearer' }
        },
        {
          id: 'node_2',
          title: 'Probability >= 65%?',
          type: 'Condition Node',
          icon: GitFork,
          desc: 'Macro Volatility Threshold',
          color: 'border-amber-500 text-amber-400',
          details: { leftOperand: '{{node_1.yesProbability}}', operator: '>=', rightOperand: 0.65 }
        },
        {
          id: 'node_3',
          title: 'Execute CTF Swap',
          type: 'Write Action',
          icon: Shield,
          desc: 'buy(3,500 USDC on YES)',
          color: 'border-purple-500 text-purple-400',
          branch: 'true',
          details: { plugin: '@keeperhub/plugin-polymarket', action: 'buy_outcome_tokens', amountUsdc: 3500, outcome: 'YES', simulate: true }
        },
        {
          id: 'node_4',
          title: 'Discord Notification',
          type: 'Notification',
          icon: Send,
          desc: 'Log Position to DAO Risk',
          color: 'border-indigo-500 text-indigo-400',
          details: { channel: 'discord_treasury', payload: 'Executed 3,500 USDC hedge on Polygon' }
        }
      ]
    },
    hyperliquid: {
      name: 'Hyperliquid Perps Basis Sentinel',
      filename: 'hyperliquid-funding-rebalance.json',
      description: 'Hourly Schedule ➔ Read Perp Funding ➔ Condition (APR > 25%) ➔ Uniswap V3 Spot Rebalance ➔ Audit Trail',
      nodes: [
        {
          id: 'node_1',
          title: 'Hourly Schedule',
          type: 'Trigger',
          icon: Clock,
          desc: 'Every 60m (0 * * * *)',
          color: 'border-blue-500 text-blue-400',
          details: { cron: '0 * * * *', timezone: 'UTC' }
        },
        {
          id: 'node_2',
          title: 'Read Funding Rate',
          type: 'Read Action',
          icon: Database,
          desc: 'ETH-PERP Funding (Hyperliquid)',
          color: 'border-indigo-500 text-indigo-400',
          details: { api: 'hyperliquid_info', symbol: 'ETH', field: 'fundingRate' }
        },
        {
          id: 'node_3',
          title: 'Funding Rate > 25% APR?',
          type: 'Condition Node',
          icon: GitFork,
          desc: 'Annualized Funding Threshold',
          color: 'border-amber-500 text-amber-400',
          details: { leftOperand: '{{node_2.annualizedFunding}}', operator: '>', rightOperand: 25.0 }
        },
        {
          id: 'node_4',
          title: 'Uniswap V3 Rebalance',
          type: 'Write Action',
          icon: Shield,
          desc: 'exactInputSingle(15k USDC)',
          color: 'border-emerald-500 text-emerald-400',
          branch: 'true',
          details: { dex: 'Uniswap_V3', tokenIn: 'USDC', tokenOut: 'WETH', amountIn: 15000, network: 8453, simulate: true }
        },
        {
          id: 'node_5',
          title: 'Append Audit Log',
          type: 'Audit Action',
          icon: CheckCircle2,
          desc: 'KeeperHub Immutable Trail',
          color: 'border-slate-500 text-slate-400',
          details: { retention: 'permanent', recordType: 'basis_arbitrage' }
        }
      ]
    }
  };

  const currentWf = workflows[activeWorkflow];

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(currentWf, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentWf.filename;
    link.click();
    URL.revokeObjectURL(url);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border-slate-800 flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>KeeperHub Workflow Visualizer (DAG Engine)</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Deterministic Graph
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Click any node to inspect execution properties, variables, and simulate: true dry-run envelope.
            </p>
          </div>

          {/* Workflow Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => { setActiveWorkflow('safe'); setSelectedNode(null); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${activeWorkflow === 'safe' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Safe & Aave
            </button>
            <button
              onClick={() => { setActiveWorkflow('polymarket'); setSelectedNode(null); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${activeWorkflow === 'polymarket' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Polymarket
            </button>
            <button
              onClick={() => { setActiveWorkflow('hyperliquid'); setSelectedNode(null); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${activeWorkflow === 'hyperliquid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Hyperliquid
            </button>
          </div>
        </div>

        {/* DAG Node Graph Layout */}
        <div className="overflow-x-auto py-2">
          <div className="flex items-center gap-2.5 min-w-[720px]">
            {currentWf.nodes.map((node, index) => {
              const Icon = node.icon;
              const isSelected = selectedNode?.id === node.id;
              return (
                <React.Fragment key={node.id}>
                  {/* Node Box */}
                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`flex-1 bg-slate-900/90 rounded-xl p-3.5 border ${node.color} shadow-lg relative group cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-indigo-400 scale-[1.03] bg-slate-900' : 'hover:scale-[1.02]'
                    }`}
                  >
                    {node.branch && (
                      <span className="absolute -top-2.5 left-3 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950">
                        Handle: {node.branch}
                      </span>
                    )}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">{node.type}</span>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <h4 className="text-xs font-bold text-white mb-0.5 truncate">{node.title}</h4>
                    <p className="text-[10px] text-slate-400 mono truncate">{node.desc}</p>
                  </div>

                  {/* Arrow Connector */}
                  {index < currentWf.nodes.length - 1 && (
                    <div className="flex items-center justify-center text-slate-600 shrink-0">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Node Inspector Drawer (if a node is clicked) */}
        {selectedNode && (
          <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-indigo-500/30 text-xs font-mono animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5" />
                Node Properties: {selectedNode.title} ({selectedNode.type})
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white text-[11px]"
              >
                ✕ Close
              </button>
            </div>
            <pre className="text-slate-300 text-[11px] overflow-x-auto">
              {JSON.stringify(selectedNode.details, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <span>Active Schema: <strong className="text-slate-200 mono">{currentWf.filename}</strong></span>
        <button
          onClick={handleExportJson}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs flex items-center gap-1.5 transition border border-slate-700"
        >
          {copiedSuccess ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Download className="h-3.5 w-3.5 text-indigo-400" />}
          <span>{copiedSuccess ? 'Downloaded!' : 'Export KeeperHub JSON'}</span>
        </button>
      </div>
    </div>
  );
};
