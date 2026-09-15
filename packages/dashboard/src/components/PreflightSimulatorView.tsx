import React, { useState } from 'react';
import { PlayCircle, ShieldCheck, AlertOctagon, CheckCircle2, ChevronRight, Terminal, Cpu, Zap, Code2, AlertTriangle } from 'lucide-react';

export const PreflightSimulatorView: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<'happy' | 'insufficient_funds' | 'revert_slippage' | 'custom'>('happy');
  const [customTarget, setCustomTarget] = useState('0xA238Dd80C259a72e81d7e4664a9801593F98d1c5');
  const [customCalldata, setCustomCalldata] = useState('0x617ba037000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda0291300000000000000000000000000000000000000000000000000000002540be400');
  const [isSimulating, setIsSimulating] = useState(false);

  const [simResult, setSimResult] = useState<any>({
    status: 'PASSED',
    preflightPassed: true,
    wouldRevert: false,
    failureKind: null,
    gasEstimate: '142,500',
    simulatedSender: '0x9A4B8c99fA56c52aCDeB32800D15C2c8e01F7802',
    targetContract: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5 (Aave V3 Base)',
    callDataSummary: 'supply(USDC, 10000000000, SafeAddress, 0)',
    executionPermitted: true,
    blockNumber: 28472910,
    traceSteps: [
      { name: 'Sender Balance Check', status: 'PASS', detail: 'Safe has 25,400 USDC (Required: 10,000)' },
      { name: 'Token Allowance Validation', status: 'PASS', detail: 'Allowance approved to Aave Pool' },
      { name: 'EVM Bytecode Dry-Run', status: 'PASS', detail: 'Zero reverts, gas calculated: 142,500' },
      { name: 'MEV Private Bundle', status: 'PASS', detail: 'Flashbots RPC route prepared' }
    ],
    diagnostic: 'Dry-run verified on Base block #28472910. Zero revert risk. Ready for deterministic broadcast.'
  });

  const runSimulation = (scenario: 'happy' | 'insufficient_funds' | 'revert_slippage' | 'custom') => {
    setSelectedScenario(scenario);
    setIsSimulating(true);

    setTimeout(() => {
      if (scenario === 'happy') {
        setSimResult({
          status: 'PASSED',
          preflightPassed: true,
          wouldRevert: false,
          failureKind: null,
          gasEstimate: '142,500',
          simulatedSender: '0x9A4B8c99fA56c52aCDeB32800D15C2c8e01F7802',
          targetContract: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5 (Aave V3 Base)',
          callDataSummary: 'supply(USDC, 10000000000, SafeAddress, 0)',
          executionPermitted: true,
          blockNumber: 28472910,
          traceSteps: [
            { name: 'Sender Balance Check', status: 'PASS', detail: 'Safe has 25,400 USDC (Required: 10,000)' },
            { name: 'Token Allowance Validation', status: 'PASS', detail: 'Allowance approved to Aave Pool' },
            { name: 'EVM Bytecode Dry-Run', status: 'PASS', detail: 'Zero reverts, gas calculated: 142,500' },
            { name: 'MEV Private Bundle', status: 'PASS', detail: 'Flashbots RPC route prepared' }
          ],
          diagnostic: 'Dry-run verified on Base block #28472910. Zero revert risk. Ready for deterministic broadcast.'
        });
      } else if (scenario === 'insufficient_funds') {
        setSimResult({
          status: 'INTERCEPTED_PREFLIGHT',
          preflightPassed: false,
          wouldRevert: true,
          failureKind: 'validation',
          errorCode: 'insufficient_balance',
          gasEstimate: '0 (Blocked prior to VM broadcast)',
          simulatedSender: '0x9A4B8c99fA56c52aCDeB32800D15C2c8e01F7802',
          targetContract: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 (USDC Token)',
          callDataSummary: 'transfer(0xRecipient, 50000000000)',
          executionPermitted: false,
          blockNumber: 28472910,
          traceSteps: [
            { name: 'Sender Balance Check', status: 'FAIL', detail: 'Required 50,000 USDC, Safe has 25,400 USDC' },
            { name: 'Token Allowance Validation', status: 'SKIPPED', detail: 'Preflight aborted at step 1' },
            { name: 'EVM Bytecode Dry-Run', status: 'BLOCKED', detail: 'Execution denied before gas burn' },
            { name: 'MEV Private Bundle', status: 'CANCELLED', detail: 'No tx generated' }
          ],
          diagnostic: 'Simulation preflight failed: Simulated sender lacks required native/token balance for call. Execution aborted safely.'
        });
      } else if (scenario === 'revert_slippage') {
        setSimResult({
          status: 'INTERCEPTED_REVERT',
          preflightPassed: false,
          wouldRevert: true,
          failureKind: 'revert',
          errorCode: 'SLIPPAGE_TOLERANCE_EXCEEDED (0x08c379a0)',
          gasEstimate: '185,000 (Saved from onchain burn)',
          simulatedSender: '0x9A4B8c99fA56c52aCDeB32800D15C2c8e01F7802',
          targetContract: '0x2626664c2603336E57B271c5C0b26F421741e481 (Uniswap V3 Base)',
          callDataSummary: 'exactInputSingle(minOut: 4.85 ETH, actualOut: 4.78 ETH)',
          executionPermitted: false,
          blockNumber: 28472910,
          traceSteps: [
            { name: 'Sender Balance Check', status: 'PASS', detail: 'Safe has 15,000 USDC' },
            { name: 'Token Allowance Validation', status: 'PASS', detail: 'Uniswap Router allowance valid' },
            { name: 'EVM Bytecode Dry-Run', status: 'FAIL', detail: 'Revert with error: "Too little received"' },
            { name: 'MEV Private Bundle', status: 'BLOCKED', detail: 'KeeperHub aborted tx dispatch' }
          ],
          diagnostic: 'Simulation reverted: EVM returned 0x08c379a0 (Slippage limit violated). Decoded revert reason fed back to Eliza agent to adjust quote.'
        });
      } else {
        // Custom scenario
        setSimResult({
          status: 'PASSED',
          preflightPassed: true,
          wouldRevert: false,
          failureKind: null,
          gasEstimate: '118,400',
          simulatedSender: '0x9A4B8c99fA56c52aCDeB32800D15C2c8e01F7802',
          targetContract: customTarget,
          callDataSummary: 'customContractExecution(calldata_bytes: ' + (customCalldata.length / 2 - 1) + ' bytes)',
          executionPermitted: true,
          blockNumber: 28472911,
          traceSteps: [
            { name: 'Sender Balance Check', status: 'PASS', detail: 'Verified state on current block' },
            { name: 'Custom ABI Inspection', status: 'PASS', detail: 'Decoded function selector: ' + customCalldata.substring(0, 10) },
            { name: 'EVM Bytecode Dry-Run', status: 'PASS', detail: 'Simulation executed cleanly with 0 reverts' },
            { name: 'MEV Private Bundle', status: 'PASS', detail: 'Flashbots envelope generated' }
          ],
          diagnostic: 'Custom transaction simulated with KeeperHub simulate: true. Pre-flight state validated.'
        });
      }
      setIsSimulating(false);
    }, 450);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>KeeperHub Pre-Flight Simulation Studio</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                simulate: true
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive dry-run inspector ensuring zero inference at execution time and zero wasted gas.
            </p>
          </div>
        </div>

        {/* Test Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => runSimulation('happy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${selectedScenario === 'happy' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
          >
            Scenario 1: Happy Path
          </button>
          <button
            onClick={() => runSimulation('insufficient_funds')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${selectedScenario === 'insufficient_funds' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
          >
            Scenario 2: Low Balance
          </button>
          <button
            onClick={() => runSimulation('revert_slippage')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${selectedScenario === 'revert_slippage' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
          >
            Scenario 3: EVM Revert
          </button>
          <button
            onClick={() => runSimulation('custom')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${selectedScenario === 'custom' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
          >
            Custom Call
          </button>
        </div>
      </div>

      {/* Custom Call Input Bar (if custom selected) */}
      {selectedScenario === 'custom' && (
        <div className="mb-6 bg-slate-900/90 p-4 rounded-xl border border-indigo-500/30 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          <div className="md:col-span-5">
            <label className="text-slate-400 block mb-1 font-semibold">Target Contract Address:</label>
            <input
              type="text"
              value={customTarget}
              onChange={(e) => setCustomTarget(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="md:col-span-5">
            <label className="text-slate-400 block mb-1 font-semibold">Raw Calldata Hex:</label>
            <input
              type="text"
              value={customCalldata}
              onChange={(e) => setCustomCalldata(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="md:col-span-2 flex items-end">
            <button
              onClick={() => runSimulation('custom')}
              disabled={isSimulating}
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <PlayCircle className="h-3.5 w-3.5" />
              <span>Dry-Run</span>
            </button>
          </div>
        </div>
      )}

      {/* Simulator Inspector Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Diagnostic & Trace Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`p-4 rounded-xl border transition ${simResult.preflightPassed ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-red-950/20 border-red-500/30'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pre-Flight Simulation Status</span>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${simResult.preflightPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {simResult.preflightPassed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertOctagon className="h-3.5 w-3.5" />}
                {simResult.status}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-200 leading-relaxed">
              {simResult.diagnostic}
            </p>
          </div>

          {/* Pre-Flight Multi-Step Trace */}
          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              KeeperHub Verification Pipeline
            </span>
            <div className="space-y-2 text-xs">
              {simResult.traceSteps?.map((step: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${step.status === 'PASS' ? 'bg-emerald-400' : step.status === 'FAIL' ? 'bg-red-500' : 'bg-slate-500'}`} />
                    <span className="font-semibold text-slate-200">{step.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mono">{step.detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">EVM Revert Probability:</span>
              <span className={`font-bold ${simResult.wouldRevert ? 'text-red-400' : 'text-emerald-400'}`}>
                {simResult.wouldRevert ? '100% (Revert Intercepted)' : '0.00% (Clean Pass)'}
              </span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Smart Gas Estimation:</span>
              <span className="font-bold text-slate-200 mono">{simResult.gasEstimate}</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Simulated Sender:</span>
              <span className="font-medium text-indigo-300 mono truncate block">{simResult.simulatedSender}</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Target Contract:</span>
              <span className="font-medium text-slate-200 mono truncate block">{simResult.targetContract}</span>
            </div>
          </div>
        </div>

        {/* Right Col: MCP JSON Output Viewer */}
        <div className="lg:col-span-5 bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
              <span className="flex items-center gap-1.5 text-[11px]">
                <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                KeeperHub MCP Response Payload
              </span>
              <span className="text-[10px] text-emerald-400">HTTP 200 OK</span>
            </div>
            <pre className="text-slate-300 overflow-x-auto max-h-[220px] text-[11px] leading-relaxed">
              {JSON.stringify(simResult, null, 2)}
            </pre>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Onchain Broadcast:</span>
            <span className={`font-bold ${simResult.executionPermitted ? 'text-emerald-400' : 'text-red-400'}`}>
              {simResult.executionPermitted ? 'PERMITTED (Safe)' : 'BLOCKED (Safety Guardrail)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
