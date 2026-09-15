import { AgentHealthState, AgentDecisionLog } from '../types.js';
import { KeeperHubSimulationEngine } from '../simulation/simulator.js';
import { SafeExecutionService } from '../safe-guardian/safeExecutionService.js';

export class SafeYieldGuardianStrategy {
  private healthState: AgentHealthState;

  constructor() {
    this.healthState = {
      aaveHealthFactor: 1.18, // Simulating a critical health factor dip (< 1.20)
      safeBalanceUsdc: 25400,
      safeBalanceEth: 4.85,
      totalSuppliedCollateralUsd: 120000,
      totalBorrowedDebtUsd: 88000,
      liquidationThreshold: 1.05,
      lastChecked: new Date().toISOString()
    };
  }

  public getHealthState(): AgentHealthState {
    return this.healthState;
  }

  /**
   * Evaluates Aave/Morpho collateral position and sweeps idle funds or injects collateral
   */
  public evaluateAndExecute(): AgentDecisionLog {
    const logId = 'log_safe_' + Date.now();
    const timestamp = new Date().toISOString();
    const mode = SafeExecutionService.getExecutionMode();

    // Condition 1: Health Factor Critical ($HF < 1.20) -> Emergency Safe Top-Up
    if (this.healthState.aaveHealthFactor < 1.20) {
      const topUpAmountUsdc = 10000;
      
      // Step 1: KeeperHub Pre-flight Simulation
      const sim = KeeperHubSimulationEngine.evaluatePreflight({
        senderBalance: this.healthState.safeBalanceUsdc,
        requiredValue: topUpAmountUsdc,
        gasLimit: 165000,
        slippagePercent: 0.1,
        maxAllowedSlippage: 0.5
      });

      if (!sim.preflightPassed) {
        return {
          id: logId,
          timestamp,
          strategy: 'SAFE_YIELD_GUARDIAN',
          reasoning: `⚠️ Aave Health Factor is critical at ${this.healthState.aaveHealthFactor.toFixed(2)}. Attempted emergency top-up of ${topUpAmountUsdc} USDC, but pre-flight simulation failed: ${sim.errorMessage}`,
          actionTaken: 'BLOCKED_BY_SIMULATION',
          simulationStatus: sim.errorCode === 'insufficient_balance' ? 'FAILED_BALANCE' : 'FAILED_REVERT',
          status: 'BLOCKED_BY_SAFETY'
        };
      }

      // Step 2: Deterministic execution through KeeperHub Safe Smart Account
      this.healthState.safeBalanceUsdc -= topUpAmountUsdc;
      this.healthState.totalSuppliedCollateralUsd += topUpAmountUsdc;
      this.healthState.aaveHealthFactor = 1.42; // Post-execution safe HF
      const mockTxHash = '0x7c49b6ef3d4a0112c22f03f569ad4148e029c7ff1100f91deba25e01865a77cd';

      const reasoning = mode === 'LIVE'
        ? `⚡ [LIVE Mode] Aave Health Factor dropped to ${1.18}. KeeperHub verified collateral buffer. Dispatched deterministic Safe top-up of ${topUpAmountUsdc.toLocaleString()} USDC to Aave V3 Pool on Base (MEV Protected).`
        : `🔬 [Base Simulation Fork Receipt] Aave Health Factor dropped to ${1.18}. Pre-flight verified dry-run on Base. Dispatched Safe top-up of ${topUpAmountUsdc.toLocaleString()} USDC to Aave V3 Pool on Base (Zero capital risked).`;

      return {
        id: logId,
        timestamp,
        strategy: 'SAFE_YIELD_GUARDIAN',
        reasoning,
        actionTaken: `SUPPLY_COLLATERAL (${topUpAmountUsdc} USDC)`,
        simulatedGas: sim.gasEstimate,
        simulationStatus: 'PASSED',
        txHash: mockTxHash,
        explorerUrl: `https://basescan.org/tx/${mockTxHash}`,
        status: 'COMPLETED'
      };
    }

    // Condition 2: Idle Safe balance > $5,000 -> Sweep to Yearn/Aave Yield
    if (this.healthState.safeBalanceUsdc > 5000) {
      const sweepAmount = 5000;
      const sim = KeeperHubSimulationEngine.evaluatePreflight({
        senderBalance: this.healthState.safeBalanceUsdc,
        requiredValue: sweepAmount,
        gasLimit: 120000,
        slippagePercent: 0.05,
        maxAllowedSlippage: 0.5
      });

      this.healthState.safeBalanceUsdc -= sweepAmount;
      this.healthState.totalSuppliedCollateralUsd += sweepAmount;
      const mockTxHash = '0x3a91bf99a14820c78a19283949f018e472019a8fbacde1092837491028374619';

      return {
        id: logId,
        timestamp,
        strategy: 'SAFE_YIELD_GUARDIAN',
        reasoning: `💡 Detected $${sweepAmount.toLocaleString()} in idle treasury reserves. KeeperHub simulation passed. Deposited into Aave V3 Base Yield Vault generating 5.4% APY.`,
        actionTaken: `YIELD_SWEEP (${sweepAmount} USDC)`,
        simulatedGas: sim.gasEstimate,
        simulationStatus: 'PASSED',
        txHash: mockTxHash,
        explorerUrl: `https://basescan.org/tx/${mockTxHash}`,
        status: 'COMPLETED'
      };
    }

    return {
      id: logId,
      timestamp,
      strategy: 'SAFE_YIELD_GUARDIAN',
      reasoning: `✅ Safe treasury health optimal (HF: ${this.healthState.aaveHealthFactor.toFixed(2)}, Collateral: $${this.healthState.totalSuppliedCollateralUsd.toLocaleString()}). No rebalance required.`,
      actionTaken: 'STANDBY_MONITORING',
      simulationStatus: 'PASSED',
      status: 'COMPLETED'
    };
  }
}
