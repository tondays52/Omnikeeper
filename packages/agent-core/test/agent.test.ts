import test from 'node:test';
import assert from 'node:assert';
import { KeeperHubSimulationEngine } from '../src/simulation/simulator.js';
import { SafeYieldGuardianStrategy } from '../src/strategies/safeYieldGuardian.js';
import { PolymarketEventHedgerStrategy } from '../src/strategies/polymarketEventHedger.js';
import { HyperliquidBasisSentinelStrategy } from '../src/strategies/hyperliquidBasisSentinel.js';
import { OmniKeeperAutonomousAgent } from '../src/agent.js';

test('KeeperHub Simulation Engine - Validates preflight balance check', () => {
  const result = KeeperHubSimulationEngine.evaluatePreflight({
    senderBalance: 50,
    requiredValue: 500, // Insufficient
    gasLimit: 100000,
    slippagePercent: 0.1,
    maxAllowedSlippage: 0.5
  });

  assert.strictEqual(result.preflightPassed, false);
  assert.strictEqual(result.errorCode, 'insufficient_balance');
  assert.strictEqual(result.wouldRevert, true);
});

test('KeeperHub Simulation Engine - Validates preflight slippage check', () => {
  const result = KeeperHubSimulationEngine.evaluatePreflight({
    senderBalance: 10000,
    requiredValue: 500,
    gasLimit: 100000,
    slippagePercent: 1.5, // Exceeds 0.5% max
    maxAllowedSlippage: 0.5
  });

  assert.strictEqual(result.preflightPassed, false);
  assert.strictEqual(result.errorCode, 'SLIPPAGE_EXCEEDED');
  assert.strictEqual(result.wouldRevert, true);
});

test('KeeperHub Simulation Engine - Passes happy path with dry-run gas estimate', () => {
  const result = KeeperHubSimulationEngine.evaluatePreflight({
    senderBalance: 50000,
    requiredValue: 5000,
    gasLimit: 200000,
    slippagePercent: 0.1,
    maxAllowedSlippage: 0.5
  });

  assert.strictEqual(result.preflightPassed, true);
  assert.strictEqual(result.wouldRevert, false);
  assert.strictEqual(result.gasEstimate, '170000');
});

test('SafeYieldGuardianStrategy - Executes emergency top-up on low health factor', () => {
  const strategy = new SafeYieldGuardianStrategy();
  const log = strategy.evaluateAndExecute();

  assert.strictEqual(log.strategy, 'SAFE_YIELD_GUARDIAN');
  assert.strictEqual(log.simulationStatus, 'PASSED');
  assert.strictEqual(log.status, 'COMPLETED');
  assert.ok(log.txHash);
  assert.ok(strategy.getHealthState().aaveHealthFactor >= 1.20);
});

test('PolymarketEventHedgerStrategy - Evaluates macro odds and hedges', () => {
  const strategy = new PolymarketEventHedgerStrategy();
  const log = strategy.evaluateAndExecute();

  assert.strictEqual(log.strategy, 'POLYMARKET_EVENT_HEDGER');
  assert.strictEqual(log.simulationStatus, 'PASSED');
  assert.ok(log.actionTaken.includes('HEDGE_EVENT_RISK'));
});

test('HyperliquidBasisSentinelStrategy - Executes delta-neutral basis rebalancing', () => {
  const strategy = new HyperliquidBasisSentinelStrategy();
  const log = strategy.evaluateAndExecute();

  assert.strictEqual(log.strategy, 'HYPERLIQUID_BASIS_SENTINEL');
  assert.strictEqual(log.simulationStatus, 'PASSED');
  assert.ok(log.actionTaken.includes('BASIS_ARBITRAGE'));
});

test('OmniKeeperMasterAgent - Runs unified autonomous 3-strategy cycle with live feeds', async () => {
  const agent = new OmniKeeperAutonomousAgent();
  const logs = await agent.runFullCycle();

  assert.strictEqual(logs.length, 3);
  assert.strictEqual(logs[0].strategy, 'SAFE_YIELD_GUARDIAN');
  assert.strictEqual(logs[1].strategy, 'POLYMARKET_EVENT_HEDGER');
  assert.strictEqual(logs[2].strategy, 'HYPERLIQUID_BASIS_SENTINEL');
});
