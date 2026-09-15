export interface KeeperHubConfig {
  apiKey: string;
  baseUrl?: string;
  defaultNetwork?: string;
}

export type NetworkId = '1' | '11155111' | '8453' | '42161' | '137';

export interface SimulationResult {
  success: boolean;
  wouldRevert: boolean;
  failureKind?: 'validation' | 'revert';
  errorCode?: string;
  errorMessage?: string;
  gasEstimate?: string;
  simulatedSender?: string;
  targetAddress?: string;
  preflightPassed: boolean;
  rawResponse?: any;
}

export interface DirectExecutionResult {
  executionId: string;
  transactionHash?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  network: string;
  explorerUrl?: string;
  error?: string;
  simulation?: SimulationResult;
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'loop';
  data: {
    label: string;
    description?: string;
    type?: string;
    config: Record<string, any>;
    status?: 'idle' | 'running' | 'completed' | 'failed';
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: 'true' | 'false' | 'loop' | 'done';
}

export interface WorkflowDefinition {
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  tags?: string[];
}

export interface ElizaState {
  [key: string]: any;
}

export interface ElizaMemory {
  id?: string;
  content: {
    text: string;
    action?: string;
    params?: Record<string, any>;
  };
}

export interface ElizaAction {
  name: string;
  similes: string[];
  description: string;
  validate: (runtime: any, message: any, state?: ElizaState) => Promise<boolean>;
  handler: (runtime: any, message: any, state?: ElizaState, options?: any, callback?: any) => Promise<any>;
  examples: Array<Array<{ user: string; content: { text: string; action?: string } }>>;
}

export interface ElizaProvider {
  get: (runtime: any, message: any, state?: ElizaState) => Promise<string>;
}
