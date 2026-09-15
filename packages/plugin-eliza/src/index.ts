import { executeTransferAction } from './actions/executeTransfer.js';
import { executeContractCallAction } from './actions/executeContractCall.js';
import { simulateExecutionAction } from './actions/simulateExecution.js';
import { deployWorkflowAction } from './actions/deployWorkflow.js';
import { keeperhubStateProvider } from './providers/keeperhubState.js';

export * from './types.js';
export * from './client.js';
export * from './actions/executeTransfer.js';
export * from './actions/executeContractCall.js';
export * from './actions/simulateExecution.js';
export * from './actions/deployWorkflow.js';
export * from './providers/keeperhubState.js';

export const keeperhubPlugin = {
  name: '@keeperhub/plugin-eliza',
  description: 'Official KeeperHub Plugin for ElizaOS - provides deterministic onchain execution, dry-run simulation, and automated DAG workflows',
  actions: [
    executeTransferAction,
    executeContractCallAction,
    simulateExecutionAction,
    deployWorkflowAction
  ],
  providers: [
    keeperhubStateProvider
  ],
  evaluators: []
};

export default keeperhubPlugin;
