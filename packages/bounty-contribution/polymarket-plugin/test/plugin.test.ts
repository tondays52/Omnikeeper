import test from 'node:test';
import assert from 'node:assert';
import { PolymarketPlugin } from '../src/index.js';

test('PolymarketPlugin - Has valid KeeperHub MCP plugin metadata', () => {
  assert.strictEqual(PolymarketPlugin.id, 'polymarket');
  assert.strictEqual(PolymarketPlugin.category, 'DeFi & Prediction');
  assert.strictEqual(PolymarketPlugin.actions.length, 2);
});

test('PolymarketPlugin - buy-outcome-token validates input schema and runs simulate: true', async () => {
  const buyAction = PolymarketPlugin.actions.find(a => a.id === 'polymarket/buy-outcome-token');
  assert.ok(buyAction);
  assert.ok(buyAction.inputSchema.properties.marketConditionId);

  // Pre-flight simulation test
  const simResult: any = await buyAction.execute({ simulate: true }, {
    marketConditionId: '0x3912a76f2791bca1f2de4661ed88a30c99a7a9449aa84174eed8d30000000000',
    outcomeIndex: 1, // YES
    amountUsdc: '3500'
  });

  assert.strictEqual(simResult.simulated, true);
  assert.strictEqual(simResult.preflightPassed, true);
  assert.strictEqual(simResult.wouldRevert, false);
  assert.strictEqual(simResult.gasEstimate, '135,000');
});

test('PolymarketPlugin - buy-outcome-token executes live onchain broadcast', async () => {
  const buyAction = PolymarketPlugin.actions.find(a => a.id === 'polymarket/buy-outcome-token');
  assert.ok(buyAction);

  const execResult: any = await buyAction.execute({ simulate: false }, {
    marketConditionId: '0x3912a76f2791bca1f2de4661ed88a30c99a7a9449aa84174eed8d30000000000',
    outcomeIndex: 1,
    amountUsdc: '3500'
  });

  assert.strictEqual(execResult.status, 'SUCCESS');
  assert.ok(execResult.txHash.startsWith('0x'));
  assert.ok(parseFloat(execResult.tokensReceived) > 0);
});

test('PolymarketPlugin - get-market-odds returns probability & volume data', async () => {
  const oddsAction = PolymarketPlugin.actions.find(a => a.id === 'polymarket/get-market-odds');
  assert.ok(oddsAction);

  const oddsResult: any = await oddsAction.execute({}, {
    marketConditionId: 'fed-rate-decision-2026',
    outcomeIndex: 0,
    amountUsdc: '0'
  });

  assert.ok(oddsResult.yesProbability >= 0 && oddsResult.yesProbability <= 1);
  assert.ok(oddsResult.noProbability >= 0 && oddsResult.noProbability <= 1);
  assert.ok(oddsResult.volume24hUsd > 0);
});
