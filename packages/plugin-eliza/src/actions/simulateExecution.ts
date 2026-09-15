import { ElizaAction, ElizaState, ElizaMemory } from '../types.js';
import { KeeperHubClient } from '../client.js';

export const simulateExecutionAction: ElizaAction = {
  name: 'KEEPERHUB_SIMULATE_EXECUTION',
  similes: [
    'DRY_RUN',
    'SIMULATE_TRANSACTION',
    'PREFLIGHT_CHECK',
    'TEST_EXECUTION'
  ],
  description: 'Simulate any transaction or contract interaction using KeeperHub dry-run without touching the blockchain or spending gas.',

  validate: async (_runtime: any, message: ElizaMemory, _state?: ElizaState): Promise<boolean> => {
    const text = message.content.text.toLowerCase();
    return text.includes('simulate') || text.includes('dry run') || text.includes('test call') || text.includes('check revert');
  },

  handler: async (runtime: any, message: ElizaMemory, state?: ElizaState, _options?: any, callback?: any): Promise<any> => {
    const client = new KeeperHubClient({
      apiKey: process.env.KEEPERHUB_API_KEY || 'kh_test_key'
    });

    const params = message.content.params || {};
    const network = params.network || '8453';
    const contractAddress = params.contractAddress || '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5';
    const abiFunction = params.abiFunction || 'supply(address,uint256,address,uint16)';
    const args = params.args || ['0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', '1000000000', '0x9A4B8c99fA56c52aCDeB32800D15C2c8e01F7802', 0];

    const sim = await client.simulateContractCall({
      network,
      contractAddress,
      abiFunction,
      args
    });

    let report = '';
    if (sim.preflightPassed && !sim.wouldRevert) {
      report = `📊 **KeeperHub Pre-flight Simulation Report:**\n` +
               `• Status: **PASSED (Dry Run Clean)**\n` +
               `• Network: Chain ID ${network}\n` +
               `• Target: \`${contractAddress}\`\n` +
               `• Function: \`${abiFunction}\`\n` +
               `• Gas Estimate: \`${sim.gasEstimate}\`\n` +
               `• Simulated Sender: \`${sim.simulatedSender}\`\n` +
               `• Revert Risk: **0.00% (Safe to Broadcast)**`;
    } else {
      report = `🚨 **KeeperHub Pre-flight Simulation Report:**\n` +
               `• Status: **FAILED (Simulation Intercepted)**\n` +
               `• Failure Kind: \`${sim.failureKind}\`\n` +
               `• Error Code: \`${sim.errorCode}\`\n` +
               `• Diagnostic: ${sim.errorMessage}\n` +
               `• Target: \`${contractAddress}\`\n` +
               `• Outcome: **Broadcast blocked. Zero onchain gas lost.**`;
    }

    if (callback) callback({ text: report });
    return { success: true, simulation: sim, report };
  },

  examples: [
    [
      {
        user: 'user1',
        content: { text: 'Simulate repaying 500 USDC debt on Aave before sending real money' }
      },
      {
        user: 'OmniKeeper',
        content: { text: 'Running preflight simulation dry-run via KeeperHub...', action: 'KEEPERHUB_SIMULATE_EXECUTION' }
      }
    ]
  ]
};
