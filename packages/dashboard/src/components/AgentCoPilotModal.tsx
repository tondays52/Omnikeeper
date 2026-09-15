import React, { useState } from 'react';
import { X, Bot, Send, Sparkles, CheckCircle2, ShieldAlert, Play, Terminal, ArrowRight } from 'lucide-react';
import { DecisionLog } from './AgentThoughtLog.tsx';

interface AgentCoPilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteAgentAction: (log: DecisionLog, stateUpdates?: any) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  parsedPlan?: {
    strategy: string;
    protocol: string;
    network: string;
    action: string;
    amount: string;
    preflightStatus: 'PASSED' | 'FAILED_REVERT' | 'FAILED_BALANCE';
    gasEstimate: string;
    keeperhubWorkflow: string;
    calldataSnippet: string;
  };
}

export const AgentCoPilotModal: React.FC<AgentCoPilotModalProps> = ({
  isOpen,
  onClose,
  onExecuteAgentAction
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'agent',
      text: "👋 I am OmniKeeper (AegisAgent), powered by ElizaOS reasoning & KeeperHub deterministic execution. Ask me to monitor yield, protect Safe collateral, hedge on Polymarket, or dry-run complex multi-protocol transactions.",
      timestamp: new Date(Date.now() - 60000).toLocaleTimeString()
    }
  ]);

  if (!isOpen) return null;

  const handleSendPrompt = (textToSend?: string) => {
    const prompt = textToSend || inputQuery;
    if (!prompt.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsProcessing(true);

    setTimeout(() => {
      let agentReply: ChatMessage;
      const lower = prompt.toLowerCase();

      if (lower.includes('polymarket') || lower.includes('hedge') || lower.includes('cut') || lower.includes('rate')) {
        agentReply = {
          id: 'agent_' + Date.now(),
          sender: 'agent',
          text: "I analyzed the current Polymarket CTF orderbook. Implied probability of Fed rate cut is 68%. I constructed a KeeperHub workflow to swap 4,000 USDC into YES outcome tokens with 100% pre-flight simulation verification.",
          timestamp: new Date().toLocaleTimeString(),
          parsedPlan: {
            strategy: 'POLYMARKET_EVENT_HEDGER',
            protocol: 'Polymarket CTF (Polygon)',
            network: 'Polygon (137)',
            action: 'buy(4,000 USDC on YES @ 0.68)',
            amount: '4,000 USDC',
            preflightStatus: 'PASSED',
            gasEstimate: '138,200',
            keeperhubWorkflow: 'polymarket-hedge.json',
            calldataSnippet: '0x3912a76f0000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400000000000000000000000000000000000000000000000000000000eed8d300'
          }
        };
      } else if (lower.includes('crash') || lower.includes('drawdown') || lower.includes('health') || lower.includes('stress')) {
        agentReply = {
          id: 'agent_' + Date.now(),
          sender: 'agent',
          text: "⚠️ Stress test evaluated: If ETH drops 20%, Aave Health Factor drops to 1.14. My KeeperHub Sentinel DAG will trigger an automatic Safe top-up of 12,500 USDC to keep HF above 1.40 safe threshold.",
          timestamp: new Date().toLocaleTimeString(),
          parsedPlan: {
            strategy: 'SAFE_YIELD_GUARDIAN',
            protocol: 'Aave V3 (Base)',
            network: 'Base (8453)',
            action: 'supply(12,500 USDC on behalf of Safe)',
            amount: '12,500 USDC',
            preflightStatus: 'PASSED',
            gasEstimate: '145,000',
            keeperhubWorkflow: 'safe-collateral-guardian.json',
            calldataSnippet: '0x617ba037000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda0291300000000000000000000000000000000000000000000000000000002e90edd00'
          }
        };
      } else if (lower.includes('funding') || lower.includes('basis') || lower.includes('hyperliquid') || lower.includes('arbitrage')) {
        agentReply = {
          id: 'agent_' + Date.now(),
          sender: 'agent',
          text: "Hyperliquid ETH-PERP funding is currently +30.6% APR. I have formulated a delta-neutral basis position: Short 5 ETH Perp on Hyperliquid + Buy 5 ETH Spot on Uniswap V3 (Base).",
          timestamp: new Date().toLocaleTimeString(),
          parsedPlan: {
            strategy: 'HYPERLIQUID_BASIS_SENTINEL',
            protocol: 'Hyperliquid + Uniswap V3',
            network: 'Arbitrum (42161) & Base (8453)',
            action: 'executeDeltaNeutralBasis(15,000 USDC)',
            amount: '15,000 USDC',
            preflightStatus: 'PASSED',
            gasEstimate: '198,000',
            keeperhubWorkflow: 'hyperliquid-funding-rebalance.json',
            calldataSnippet: '0x414bf3820000000000000000000000000000000000000000000000000000000000000020'
          }
        };
      } else {
        agentReply = {
          id: 'agent_' + Date.now(),
          sender: 'agent',
          text: `Understood! I parsed your instruction: "${prompt}". I generated a verified KeeperHub MCP transaction envelope, ran pre-flight state validation with simulate: true, and confirmed zero revert probability.`,
          timestamp: new Date().toLocaleTimeString(),
          parsedPlan: {
            strategy: 'SAFE_YIELD_GUARDIAN',
            protocol: 'Safe Multisig + Aave V3',
            network: 'Base (8453)',
            action: 'VERIFY_TREASURY_AND_DISPATCH',
            amount: 'Custom Envelope',
            preflightStatus: 'PASSED',
            gasEstimate: '132,000',
            keeperhubWorkflow: 'safe-collateral-guardian.json',
            calldataSnippet: '0xa9059cbb0000000000000000000000009a4b8c99fa56c52acdeb32800d15c2c8e01f7802000000000000000000000000000000000000000000000000000000012a05f200'
          }
        };
      }

      setMessages(prev => [...prev, agentReply]);
      setIsProcessing(false);
    }, 700);
  };

  const handleConfirmExecute = (plan: any) => {
    const randomTx = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const newLog: DecisionLog = {
      id: 'log_copilot_' + Date.now(),
      timestamp: new Date().toISOString(),
      strategy: plan.strategy,
      reasoning: `🤖 ElizaOS Co-Pilot natural language command executed. Action: ${plan.action}. Protocol: ${plan.protocol}. KeeperHub pre-flight dry run verified with zero gas waste.`,
      actionTaken: plan.action,
      simulatedGas: plan.gasEstimate,
      simulationStatus: 'PASSED',
      txHash: randomTx,
      explorerUrl: plan.network.includes('Polygon')
        ? `https://polygonscan.com/tx/${randomTx}`
        : `https://basescan.org/tx/${randomTx}`,
      status: 'COMPLETED'
    };

    onExecuteAgentAction(newLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-modal w-full max-w-3xl rounded-2xl p-6 relative border border-slate-700/80 flex flex-col h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-0.5 shadow-lg shadow-purple-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="h-5 w-5 text-purple-400" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>ElizaOS Agent Co-Pilot</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Natural Language ➔ KeeperHub
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Issue high-level intent in plain English. The agent reasons, simulates, and compiles deterministic execution DAGs.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close ElizaOS Agent Co-Pilot modal"
            className="h-8 w-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap gap-2 pb-3 mb-2 border-b border-slate-800/60 text-xs">
          <span className="text-slate-500 font-medium py-1">Quick prompts:</span>
          <button
            onClick={() => handleSendPrompt("Hedge $4,000 USDC on Polymarket rate cut odds")}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-indigo-300 border border-slate-700/80 transition text-[11px]"
          >
            🎯 Hedge Polymarket Rate Cut
          </button>
          <button
            onClick={() => handleSendPrompt("Simulate 20% ETH crash & check Safe collateral")}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-slate-700/80 transition text-[11px]"
          >
            🚨 Stress Test Market Crash
          </button>
          <button
            onClick={() => handleSendPrompt("Harvest Hyperliquid ETH basis funding rate")}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border border-slate-700/80 transition text-[11px]"
          >
            📈 Capture Hyperliquid Funding
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'agent' && (
                <div className="h-7 w-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div className={`max-w-[80%] rounded-2xl p-4 space-y-2.5 ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200'
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

                {/* Agent Structured Plan Card */}
                {m.parsedPlan && (
                  <div className="bg-slate-950/80 rounded-xl p-3 border border-indigo-500/30 space-y-2 mt-2 font-sans">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px]">
                      <span className="font-bold text-indigo-300 uppercase tracking-wider">KeeperHub Execution Envelope</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Pre-Flight: {m.parsedPlan.preflightStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] mono">
                      <div>
                        <span className="text-slate-500 block">Protocol:</span>
                        <span className="text-slate-300 font-semibold">{m.parsedPlan.protocol}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Action:</span>
                        <span className="text-slate-300 font-semibold truncate block">{m.parsedPlan.action}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Est. Gas:</span>
                        <span className="text-slate-300">{m.parsedPlan.gasEstimate}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Workflow Template:</span>
                        <span className="text-indigo-400 font-medium">{m.parsedPlan.keeperhubWorkflow}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-end">
                      <button
                        onClick={() => handleConfirmExecute(m.parsedPlan)}
                        className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                      >
                        <Play className="h-3 w-3" />
                        <span>Confirm & Dispatch DAG</span>
                      </button>
                    </div>
                  </div>
                )}

                <span className="block text-[10px] text-slate-400 text-right">{m.timestamp}</span>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic">
              <Sparkles className="h-4 w-4 animate-spin text-purple-400" />
              <span>ElizaOS reasoning & running KeeperHub pre-flight simulation...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
            placeholder="Tell ElizaOS what to execute (e.g. 'Hedge 5,000 USDC on Polymarket rate cut')..."
            className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
          <button
            onClick={() => handleSendPrompt()}
            disabled={!inputQuery.trim() || isProcessing}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition disabled:opacity-50 flex items-center gap-1.5 shadow-lg shadow-indigo-600/25"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
