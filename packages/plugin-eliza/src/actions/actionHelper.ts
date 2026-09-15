import { KeeperHubClient } from '../client.js';
import { ElizaMemory } from '../types.js';

export function getKeeperHubClient(): KeeperHubClient {
  return new KeeperHubClient({
    apiKey: process.env.KEEPERHUB_API_KEY || 'kh_test_key'
  });
}

export function extractActionParams(message: ElizaMemory): Record<string, any> {
  return message.content.params || {};
}

export function notifyProgress(callback: ((msg: { text: string }) => void) | undefined, text: string): void {
  if (callback) {
    callback({ text });
  }
}
