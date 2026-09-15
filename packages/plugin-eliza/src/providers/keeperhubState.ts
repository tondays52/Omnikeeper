import { ElizaProvider, ElizaState, ElizaMemory } from '../types.js';
import { KeeperHubClient } from '../client.js';

export const keeperhubStateProvider: ElizaProvider = {
  get: async (_runtime: any, _message: ElizaMemory, _state?: ElizaState): Promise<string> => {
    const client = new KeeperHubClient({
      apiKey: process.env.KEEPERHUB_API_KEY || 'kh_test_key'
    });

    const wallet = await client.getWalletIntegration();

    return `
[KEEPERHUB CONTEXT & EXECUTION ENGINE STATUS]
- Organization: org_aegis_ai_fund
- Safe Smart Account: ${wallet.address}
- Key Manager: Turnkey Non-Custodial Multi-Sig
- Supported Networks: Base (8453), Arbitrum (42161), Sepolia (11155111)
- MEV Protection: ENABLED (Flashbots / Private RPC routing)
- Smart Gas Nonce Manager: ACTIVE (Auto-resubmit stuck txs with 1.2x priority gas)
- Active Automated Workflows:
  1. "Aegis Safe Collateral & Yield Sentinel" (Schedule: */5 min, Base)
  2. "Polymarket Macro Event Risk Hedger" (Webhook: Polymarket CLOB, Polygon)
  3. "Hyperliquid Perps Delta-Neutral Sentinel" (Event: Funding rate > 0.03%, Arbitrum)
- Safety Policy: ZERO un-simulated onchain writes allowed. Pre-flight simulation MUST pass with wouldRevert=false before value movement.
`.trim();
  }
};
