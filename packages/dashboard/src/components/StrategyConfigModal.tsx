import React from 'react';
import { X, Sliders, Shield, Zap, Check, AlertTriangle, RefreshCw } from 'lucide-react';

export interface StrategyPolicyConfig {
  healthFactorThreshold: number;
  autoTopUpAmountUsdc: number;
  polymarketOddsThreshold: number;
  maxSingleHedgeUsdc: number;
  hyperliquidFundingThresholdApr: number;
  maxBasisPositionUsdc: number;
  mevPrivateBundles: boolean;
  maxSlippageTolerance: number;
  executionIntervalSeconds: number;
}

interface StrategyConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: StrategyPolicyConfig;
  onSaveConfig: (newConfig: StrategyPolicyConfig) => void;
}

export const StrategyConfigModal: React.FC<StrategyConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [localConfig, setLocalConfig] = React.useState<StrategyPolicyConfig>(config);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  React.useEffect(() => {
    setLocalConfig(config);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig(localConfig);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-modal w-full max-w-2xl rounded-2xl p-6 relative border border-slate-700/80 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Autonomous Strategy & Risk Policy Engine</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  KeeperHub Guard
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Define deterministic execution constraints, risk thresholds, and MEV safety policies.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Strategy Policy Engine modal"
            className="h-8 w-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Policy Groups */}
        <div className="space-y-6 text-xs">
          {/* Group 1: Aave & Safe Liquidation Defense */}
          <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-indigo-400" />
                Pillar 1: Safe Smart Account & Aave Defense
              </span>
              <span className="text-emerald-400 font-semibold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Active</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-slate-400 mb-1.5">
                  <span>Emergency Health Factor Trigger:</span>
                  <span className="font-bold text-amber-400 mono">{localConfig.healthFactorThreshold.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="1.10"
                  max="1.40"
                  step="0.01"
                  value={localConfig.healthFactorThreshold}
                  onChange={(e) => setLocalConfig({ ...localConfig, healthFactorThreshold: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Aggressive (1.10)</span>
                  <span>Conservative (1.40)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1.5">
                  <span>Auto Top-Up Amount:</span>
                  <span className="font-bold text-indigo-300 mono">${localConfig.autoTopUpAmountUsdc.toLocaleString()} USDC</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="25000"
                  step="1000"
                  value={localConfig.autoTopUpAmountUsdc}
                  onChange={(e) => setLocalConfig({ ...localConfig, autoTopUpAmountUsdc: parseInt(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>$2,000</span>
                  <span>$25,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Group 2: Polymarket Macro Hedging */}
          <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-purple-400" />
                Pillar 2: Polymarket CTF Macro Hedging
              </span>
              <span className="text-purple-400 font-semibold text-[10px] bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">Active</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-slate-400 mb-1.5">
                  <span>Odds Threshold Trigger:</span>
                  <span className="font-bold text-purple-400 mono">{(localConfig.polymarketOddsThreshold * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.50"
                  max="0.85"
                  step="0.01"
                  value={localConfig.polymarketOddsThreshold}
                  onChange={(e) => setLocalConfig({ ...localConfig, polymarketOddsThreshold: parseFloat(e.target.value) })}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>50% (Volatile)</span>
                  <span>85% (High Conviction)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1.5">
                  <span>Max Single Hedge:</span>
                  <span className="font-bold text-purple-300 mono">${localConfig.maxSingleHedgeUsdc.toLocaleString()} USDC</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="15000"
                  step="500"
                  value={localConfig.maxSingleHedgeUsdc}
                  onChange={(e) => setLocalConfig({ ...localConfig, maxSingleHedgeUsdc: parseInt(e.target.value) })}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>$1,000</span>
                  <span>$15,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Group 3: Hyperliquid Basis & Execution Safeguards */}
          <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                Pillar 3 & KeeperHub Execution Guardrails
              </span>
              <span className="text-emerald-400 font-semibold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Enforced</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-slate-400 mb-1.5">
                  <span>Funding APR Activation:</span>
                  <span className="font-bold text-emerald-400 mono">+{localConfig.hyperliquidFundingThresholdApr}% APR</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="50"
                  step="1"
                  value={localConfig.hyperliquidFundingThresholdApr}
                  onChange={(e) => setLocalConfig({ ...localConfig, hyperliquidFundingThresholdApr: parseInt(e.target.value) })}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1.5">
                  <span>Max Slippage Limit:</span>
                  <span className="font-bold text-amber-400 mono">{localConfig.maxSlippageTolerance}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.05"
                  value={localConfig.maxSlippageTolerance}
                  onChange={(e) => setLocalConfig({ ...localConfig, maxSlippageTolerance: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Toggle Switch: MEV Private Bundles */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">Flashbots / MEV Private Relay</span>
                <span className="text-[11px] text-slate-400">Route all KeeperHub calls through private mempools to eliminate sandwich attacks</span>
              </div>
              <button
                type="button"
                onClick={() => setLocalConfig({ ...localConfig, mevPrivateBundles: !localConfig.mevPrivateBundles })}
                className={`w-12 h-6 rounded-full transition-colors relative ${localConfig.mevPrivateBundles ? 'bg-indigo-600' : 'bg-slate-700'}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white transition-transform transform ${localConfig.mevPrivateBundles ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setLocalConfig(config)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/25 flex items-center gap-1.5"
            >
              {savedSuccess ? <Check className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
              <span>{savedSuccess ? 'Policies Applied!' : 'Save & Enforce Policies'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
