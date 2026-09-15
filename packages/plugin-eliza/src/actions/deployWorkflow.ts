import { ElizaAction, ElizaState, ElizaMemory, WorkflowDefinition } from '../types.js';
import { KeeperHubClient } from '../client.js';

export const deployWorkflowAction: ElizaAction = {
  name: 'KEEPERHUB_DEPLOY_WORKFLOW',
  similes: [
    'CREATE_WORKFLOW',
    'DEPLOY_KEEPER',
    'SCHEDULE_STRATEGY',
    'AUTOMATE_AGENT_TASK'
  ],
  description: 'Deploy a multi-node deterministic KeeperHub DAG workflow with triggers, conditions, and actions.',

  validate: async (_runtime: any, message: ElizaMemory, _state?: ElizaState): Promise<boolean> => {
    const text = message.content.text.toLowerCase();
    return text.includes('workflow') || text.includes('automate') || text.includes('schedule strategy') || text.includes('guardian pipeline');
  },

  handler: async (runtime: any, message: ElizaMemory, state?: ElizaState, _options?: any, callback?: any): Promise<any> => {
    const client = new KeeperHubClient({
      apiKey: process.env.KEEPERHUB_API_KEY || 'kh_test_key'
    });

    const params = message.content.params || {};
    const workflow: WorkflowDefinition = params.workflow || {
      name: 'Aegis Safe Collateral & Yield Sentinel',
      description: 'Monitors Aave V3 health factor every 5 minutes and auto-supplies collateral from Safe if HF < 1.20',
      nodes: [
        {
          id: 'trigger-schedule',
          type: 'trigger',
          data: {
            label: 'Every 5 Minutes',
            config: { triggerType: 'Schedule', cron: '*/5 * * * *' }
          }
        },
        {
          id: 'read-aave-hf',
          type: 'action',
          data: {
            label: 'Read Aave Health Factor',
            config: {
              actionType: 'web3/read-contract',
              network: '8453',
              contractAddress: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5',
              abiFunction: 'getUserAccountData(address)'
            }
          }
        },
        {
          id: 'condition-hf-risk',
          type: 'condition',
          data: {
            label: 'Check HF < 1.20',
            config: {
              operator: '<',
              leftValue: '{{@read-aave-hf:Read Aave Health Factor.healthFactor}}',
              rightValue: '1200000000000000000'
            }
          }
        },
        {
          id: 'safe-topup-collateral',
          type: 'action',
          data: {
            label: 'Safe Collateral Top-up',
            config: {
              actionType: 'web3/write-contract',
              network: '8453',
              contractAddress: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5',
              abiFunction: 'supply(address,uint256,address,uint16)'
            }
          }
        },
        {
          id: 'notify-telegram',
          type: 'action',
          data: {
            label: 'Send Emergency Telegram Alert',
            config: {
              actionType: 'notification/telegram',
              message: '🚨 [Aegis Alert] Collateral health factor defended. Safe injected USDC collateral.'
            }
          }
        }
      ],
      edges: [
        { id: 'e1', source: 'trigger-schedule', target: 'read-aave-hf' },
        { id: 'e2', source: 'read-aave-hf', target: 'condition-hf-risk' },
        { id: 'e3', source: 'condition-hf-risk', target: 'safe-topup-collateral', sourceHandle: 'true' },
        { id: 'e4', source: 'safe-topup-collateral', target: 'notify-telegram' }
      ]
    };

    if (callback) {
      callback({
        text: `⚙️ [KeeperHub Workflow Engine] Compiling & deploying DAG: "${workflow.name}" with ${workflow.nodes.length} nodes...`
      });
    }

    const deployResult = await client.deployWorkflow(workflow);

    const msg = `✅ [KeeperHub Workflow Deployed] Workflow ID: \`${deployResult.workflowId}\`\nStatus: **ACTIVE**\nNodes: ${workflow.nodes.map(n => n.data.label).join(' ➔ ')}`;
    if (callback) callback({ text: msg });

    return { success: true, deployResult, workflow };
  },

  examples: [
    [
      {
        user: 'user1',
        content: { text: 'Deploy the automated Safe collateral guardian workflow to KeeperHub' }
      },
      {
        user: 'OmniKeeper',
        content: { text: 'Compiling DAG and deploying workflow to KeeperHub...', action: 'KEEPERHUB_DEPLOY_WORKFLOW' }
      }
    ]
  ]
};
