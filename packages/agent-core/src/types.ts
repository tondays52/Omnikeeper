export interface AgentHealthState {
  aaveHealthFactor: number;
  safeBalanceUsdc: number;
  safeBalanceEth: number;
  totalSuppliedCollateralUsd: number;
  totalBorrowedDebtUsd: number;
  liquidationThreshold: number;
  lastChecked: string;
}

export interface PolymarketMarketState {
  marketId: string;
  question: string;
  yesProbability: number;
  noProbability: number;
  impliedOdds: number;
  volumeUsd: number;
  lastUpdated: string;
}

export interface HyperliquidPerpState {
  asset: string;
  markPrice: number;
  indexPrice: number;
  fundingRateHourly: number;
  annualizedFundingRate: number;
  agentOpenPosition: {
    size: number;
    side: 'LONG' | 'SHORT' | 'NONE';
    unrealizedPnl: number;
    entryPrice: number;
  };
  lastUpdated: string;
}

export interface AgentDecisionLog {
  id: string;
  timestamp: string;
  strategy: 'SAFE_YIELD_GUARDIAN' | 'POLYMARKET_EVENT_HEDGER' | 'HYPERLIQUID_BASIS_SENTINEL';
  reasoning: string;
  actionTaken: string;
  simulatedGas?: string;
  simulationStatus: 'PASSED' | 'FAILED_REVERT' | 'FAILED_BALANCE';
  txHash?: string;
  explorerUrl?: string;
  status: 'COMPLETED' | 'SIMULATED' | 'BLOCKED_BY_SAFETY';
}
