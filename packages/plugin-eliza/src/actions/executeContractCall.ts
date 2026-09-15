import { ElizaAction, ElizaState, ElizaMemory } from '../types.js';
import { KeeperHubClient } from '../client.js';

export const executeContractCallAction: ElizaAction = {
  name: 'KEEPERHUB_EXECUTE_CONTRACT_CALL',
  similes: [
    'CALL_CONTRACT',
    'INTERACT_DEFI',
    'AAVE_SUPPLY',
    'UNISWAP_SWAP',
    'SAFE_EXECUTE'
  ],
  description: 'Deterministically execute smart contract functions (Aave supply/borrow, Uniswap swap, Safe transaction) via KeeperHub with pre-flight dry-run.',

  validate: async (_runtime: any, message: ElizaMemory, _state?: ElizaState): Promise<boolean> => {
    const text = message.content.text.toLowerCase();
    return (
      text.includes('contract') ||
      text.includes('supply') ||
      text.includes('deposit') ||
      text.includes('borrow') ||
      text.includes('swap') ||
      text.includes('rebalance') ||
      text.includes('stake')
    );
  },

  handler: async (runtime: any, message: ElizaMemory, state?: ElizaState, _options?: any, callback?: any): Promise<any> => {
    const client = new KeeperHubClient({
      apiKey: process.env.KEEPERHUB_API_KEY || 'kh_test_key'
    });

    const params = message.content.params || {};
    const network = params.network || '8453';
    const contractAddress = params.contractAddress || '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5'; // Aave V3 Pool Base
    const abiFunction = params.abiFunction || 'supply(address,uint256,address,uint16)';
    const args = params.args || ['0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', '1000000000', '0x9A4B8c99fA56c52aCDeB32800D15C2c8e01F7802', 0];

    if (callback) {
      callback({
        text: `🔍 [KeeperHub Pre-flight] Simulating contract call \`${abiFunction}\` on Target \`${contractAddress}\` (Network: ${network})...`
      });
    }

    // 1. Dry Run Simulation
    const sim = await client.simulateContractCall({
      network,
      contractAddress,
      abiFunction,
      args
    });

    if (!sim.preflightPassed || sim.wouldRevert) {
      const errorText = `🛑 [KeeperHub Pre-flight Revert Blocked] Contract call would revert!\nReason: ${sim.errorMessage}\nFailure Kind: ${sim.failureKind}\nTarget: ${contractAddress}\nNo gas was wasted on-chain.`;
      if (callback) callback({ text: errorText });
      return { success: false, error: sim.errorMessage, simulation: sim };
    }

    if (callback) {
      callback({
        text: `🛡️ [KeeperHub Simulation Validated] Gas estimate: ${sim.gasEstimate}. Dispatching to Safe Smart Account with Smart Gas Nonce manager...`
      });
    }

    // 2. Real Execution
    const result = await client.executeContractCall({
      network,
      contractAddress,
      abiFunction,
      args,
      requireSimulationCheck: false
    });

    if (result.status === 'SUCCESS') {
      const successText = `✅ [KeeperHub Execution Verified] Contract call executed!\nTx Hash: ${result.transactionHash}\nExplorer: ${result.explorerUrl}`;
      if (callback) callback({ text: successText });
      return { success: true, result };
    } else {
      if (callback) callback({ text: `❌ [KeeperHub Error] ${result.error}` });
      return { success: false, result };
    }
  },

  examples: [
    [
      {
        user: 'user1',
        content: { text: 'Supply 1,000 USDC collateral into Aave V3 Pool on Base' }
      },
      {
        user: 'OmniKeeper',
        content: { text: 'Simulating Aave supply and executing through KeeperHub Safe...', action: 'KEEPERHUB_EXECUTE_CONTRACT_CALL' }
      }
    ]
  ]
};
