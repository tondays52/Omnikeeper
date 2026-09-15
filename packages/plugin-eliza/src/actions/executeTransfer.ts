import { ElizaAction, ElizaState, ElizaMemory } from '../types.js';
import { getKeeperHubClient, extractActionParams, notifyProgress } from './actionHelper.js';

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
    const hasVerb = ['send', 'transfer', 'move'].some(v => text.includes(v));
    const hasAsset = ['eth', 'usdc', 'funds', 'tokens'].some(a => text.includes(a));
    return hasVerb && hasAsset;
  },

  handler: async (runtime: any, message: ElizaMemory, state?: ElizaState, _options?: any, callback?: any): Promise<any> => {
    const client = getKeeperHubClient();
    const params = extractActionParams(message);
    const recipient = params.recipientAddress || '0x3244D42b109e4E1F424cE0F452A20005F92b952b';
    const amount = params.amount || '0.1';
    const network = params.network || '8453';

    notifyProgress(callback, `🔍 [KeeperHub Pre-flight] Initiating dry-run simulation for transfer of ${amount} on Chain ${network} to ${recipient}...`);

    const sim = await client.simulateTransfer({
      network,
      recipientAddress: recipient,
      amount
    });

    if (!sim.preflightPassed || sim.wouldRevert) {
      notifyProgress(callback, `❌ [KeeperHub Pre-flight Rejected] Simulation failed: ${sim.errorMessage}. No transaction was submitted to chain.`);
      return { success: false, error: sim.errorMessage, simulation: sim };
    }

    notifyProgress(callback, `✅ [KeeperHub Pre-flight Passed] Gas Estimate: ${sim.gasEstimate}. Executing deterministic value transfer with MEV protection...`);

    const result = await client.executeTransfer({
      network,
      recipientAddress: recipient,
      amount,
      requireSimulationCheck: false
    });

    if (result.status === 'SUCCESS') {
      notifyProgress(callback, `🎉 [KeeperHub Success] Transferred ${amount} tokens. Tx Hash: ${result.transactionHash}\nExplorer: ${result.explorerUrl}`);
      return { success: true, result };
    } else {
      notifyProgress(callback, `⚠️ [KeeperHub Error] Execution failed: ${result.error}`);
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

