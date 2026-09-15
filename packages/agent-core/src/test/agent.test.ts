import test from 'node:test';
import assert from 'node:assert';
import { KeeperHubSimulationEngine } from '../simulation/simulator.js';
import { SafeYieldGuardianStrategy } from '../strategies/safeYieldGuardian.js';
import { PolymarketEventHedgerStrategy } from '../strategies/polymarketEventHedger.js';
import { HyperliquidBasisSentinelStrategy } from '../strategies/hyperliquidBasisSentinel.js';
import { SafeExecutionService } from '../safe-guardian/safeExecutionService.js';
import { HyperliquidService } from '../hyperliquid/hyperliquidService.js';
import { HistoricalBlockReplayEngine } from '../backtesting/historicalBlockReplay.js';
import { CloudDagDeployer } from '../dag-compiler/cloudDagDeployer.js';
import { SecurityPolicyManager } from '../security/securityPolicy.js';
import { X402PaymentGate } from '../x402/x402PaymentGate.js';
import { ERC8004IdentityRegistry } from '../identity/erc8004Identity.js';
import { OmniKeeperAutonomousAgent } from '../agent.js';

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

test('SecurityPolicyManager - Blocks unauthorized non-whitelisted contract target', () => {
  const check = SecurityPolicyManager.validateTransaction({
    targetContract: '0x1111111111111111111111111111111111111111',
    amountUsd: 1000,
    slippagePercent: 0.1
  });

  assert.strictEqual(check.allowed, false);
  assert.strictEqual(check.securityTier, 'CRITICAL_BLOCKED');
  assert.ok(check.blockedReason?.includes('whitelist'));
});

test('SecurityPolicyManager - Approves authorized Aave V3 contract target within limits', () => {
  const check = SecurityPolicyManager.validateTransaction({
    targetContract: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5', // Aave V3 Base
    amountUsd: 5000,
    slippagePercent: 0.2
  });

  assert.strictEqual(check.allowed, true);
  assert.strictEqual(check.securityTier, 'LOW_RISK');
});

test('X402PaymentGate - Returns HTTP 402 challenge without payment proof', async () => {
  const res = await X402PaymentGate.handleMonetizedExecution(undefined, async () => {
    return {
      id: 'test_exec',
      timestamp: new Date().toISOString(),
      strategy: 'SAFE_YIELD_GUARDIAN',
      reasoning: 'Rebalanced',
      actionTaken: 'TOPUP',
      simulationStatus: 'PASSED',
      status: 'COMPLETED'
    };
  });

  assert.strictEqual(res.httpStatus, 402);
  assert.strictEqual(res.paid, false);
  assert.ok(res.error?.includes('402 Payment Required'));
});

test('X402PaymentGate - Verifies valid x402 payment proof and executes service', async () => {
  const challenge = X402PaymentGate.createChallenge('AAVE_TOPUP');
  const validProof = {
    challengeId: challenge.paymentDetails.challengeId,
    payerAddress: '0x1234567890123456789012345678901234567890',
    txHashOrSignature: '0x7c49b6ef3d4a0112c22f03f569ad4148e029c7ff1100f91deba25e01865a77cd',
    amountPaid: '0.05',
    network: '8453'
  };

  const res = await X402PaymentGate.handleMonetizedExecution(validProof, async () => {
    return {
      id: 'test_exec_paid',
      timestamp: new Date().toISOString(),
      strategy: 'SAFE_YIELD_GUARDIAN',
      reasoning: 'Executed with x402 micro-payment',
      actionTaken: 'SUPPLY_COLLATERAL',
      simulationStatus: 'PASSED',
      status: 'COMPLETED'
    };
  });

  assert.strictEqual(res.httpStatus, 200);
  assert.strictEqual(res.paid, true);
  assert.strictEqual(res.executionResult?.strategy, 'SAFE_YIELD_GUARDIAN');
});

test('ERC8004IdentityRegistry - Retrieves onchain agent profile and logs attestations', () => {
  const meta = ERC8004IdentityRegistry.getAgentMetadata();
  assert.strictEqual(meta.name, 'AegisAgent (OmniKeeper)');
  assert.ok(meta.reputationScore >= 900);

  const attestation = ERC8004IdentityRegistry.createExecutionAttestation({
    executionHash: '0x7c49b6ef3d4a0112c22f03f569ad4148e029c7ff1100f91deba25e01865a77cd',
    strategy: 'SAFE_YIELD_GUARDIAN',
    status: 'SUCCESS'
  });

  assert.strictEqual(attestation.status, 'SUCCESS');
  assert.strictEqual(attestation.reputationDelta, 5);
  assert.ok(attestation.signature.startsWith('0x'));
});

test('SafeExecutionService - Executes simulation fork dry-run on Base RPC', async () => {
  const result = await SafeExecutionService.executeTransaction({
    targetContract: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5',
    abiFunction: 'supply(address,uint256,address,uint16)',
    args: ['0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', 1000000000n, '0x9A4B8c99fA56c52aCDeB32800D15C2c8e01F7802', 0],
    assetSymbol: 'USDC',
    assetAmount: 1.0
  });

  assert.strictEqual(result.success, true);
  assert.ok(result.simulatedGas);
  assert.ok(result.reasoning.includes('Base'));
});

test('HyperliquidService - Simulates micro-order with live orderbook validation', async () => {
  const result = await HyperliquidService.executeOrder({
    coin: 'ETH',
    isBuy: false,
    sz: 0.001
  });

  assert.strictEqual(result.success, true);
  assert.ok(result.fillPrice && result.fillPrice > 0);
  assert.strictEqual(result.receiptType, 'HYPERLIQUID_SIMULATION_RECEIPT');
});

test('HistoricalBlockReplayEngine - Replays Yen Carry crash and avoids liquidation', async () => {
  const summary = await HistoricalBlockReplayEngine.replayScenario('YEN_UNWIND_2024');

  assert.strictEqual(summary.scenarioId, 'YEN_UNWIND_2024');
  assert.strictEqual(summary.steps.length, 5);
  assert.ok(summary.finalHealthFactorWithAgent >= 1.20);
  assert.ok(summary.capitalSavedUsd > 0);
});

test('CloudDagDeployer - Compiles natural language prompt into KeeperHub DAG', async () => {
  const dag = CloudDagDeployer.compilePromptToDag('If Polymarket Fed Rate Cut probability swings > 15%, rebalance CTF hedge');
  assert.strictEqual(dag.nodes.length, 4);
  assert.strictEqual(dag.nodes[0].type, 'TRIGGER');
  assert.strictEqual(dag.nodes[2].type, 'SIMULATOR');
  assert.strictEqual(dag.nodes[3].type, 'EXECUTOR');

  const deploy = await CloudDagDeployer.deployDag(dag);
  assert.ok(deploy.cloudUrl.includes('https://app.keeperhub.com/workflows/'));
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
