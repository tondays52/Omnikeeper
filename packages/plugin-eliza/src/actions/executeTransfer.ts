import { ElizaAction, ElizaState, ElizaMemory } from '../types.js';
import { KeeperHubClient } from '../client.js';

export const executeTransferAction: ElizaAction = {
  name: 'KEEPERHUB_EXECUTE_TRANSFER',
  similes: [
    'TRANSFER_FUNDS',
    'SEND_ETH',
    'SEND_USDC',
    'MOVE_VALUE',
    'KEEPERHUB_TRANSFER'
  ],
  description: 'Deterministically transfer native crypto or ERC-20 tokens using KeeperHub with mandatory pre-flight simulation and non-custodial Safe execution.',
  
  validate: async (_runtime: any, message: ElizaMemory, _state?: ElizaState): Promise<boolean> => {
    const text = message.content.text.toLowerCase();
    return (
      (text.includes('send') || text.includes('transfer') || text.includes('move')) &&
      (text.includes('eth') || text.includes('usdc') || text.includes('funds') || text.includes('tokens'))
    );
  },

  handler: async (runtime: any, message: ElizaMemory, state?: ElizaState, _options?: any, callback?: any): Promise<any> => {
    const client = new KeeperHubClient({
      apiKey: process.env.KEEPERHUB_API_KEY || 'kh_test_key'
    });

    const params = message.content.params || {};
    const recipient = params.recipientAddress || '0x3244D42b109e4E1F424cE0F452A20005F92b952b';
    const amount = params.amount || '0.1';
    const network = params.network || '8453'; // Default to Base

    // Step 1: Pre-flight Simulation
    if (callback) {
      callback({
        text: `🔍 [KeeperHub Pre-flight] Initiating dry-run simulation for transfer of ${amount} on Chain ${network} to ${recipient}...`
      });
    }

    const sim = await client.simulateTransfer({
      network,
      recipientAddress: recipient,
      amount
    });

    if (!sim.preflightPassed || sim.wouldRevert) {
      const errorMsg = `❌ [KeeperHub Pre-flight Rejected] Simulation failed: ${sim.errorMessage}. No transaction was submitted to chain.`;
      if (callback) callback({ text: errorMsg });
      return { success: false, error: sim.errorMessage, simulation: sim };
    }

    // Step 2: Deterministic Execution
    if (callback) {
      callback({
        text: `✅ [KeeperHub Pre-flight Passed] Gas Estimate: ${sim.gasEstimate}. Executing deterministic value transfer with MEV protection...`
      });
    }

    const result = await client.executeTransfer({
      network,
      recipientAddress: recipient,
      amount,
      requireSimulationCheck: false
    });

    if (result.status === 'SUCCESS') {
      const successMsg = `🎉 [KeeperHub Success] Transferred ${amount} tokens. Tx Hash: ${result.transactionHash}\nExplorer: ${result.explorerUrl}`;
      if (callback) callback({ text: successMsg });
      return { success: true, result };
    } else {
      const failMsg = `⚠️ [KeeperHub Error] Execution failed: ${result.error}`;
      if (callback) callback({ text: failMsg });
      return { success: false, result };
    }
  },

  examples: [
    [
      {
        user: 'user1',
        content: { text: 'Transfer 0.5 ETH to 0x3244... on Base' }
      },
      {
        user: 'OmniKeeper',
        content: { text: 'Simulating and deterministically executing transfer via KeeperHub...', action: 'KEEPERHUB_EXECUTE_TRANSFER' }
      }
    ]
  ]
};
