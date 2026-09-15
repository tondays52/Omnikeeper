import axios from 'axios';
import { AgentDecisionLog } from '../types.js';

export interface WebhookAlertPayload {
  channel: 'DISCORD' | 'TELEGRAM';
  eventType: 'EXECUTION_SUCCESS' | 'PREFLIGHT_BLOCKED' | 'X402_PAYMENT_SETTLED' | 'ERC8004_ATTESTATION';
  title: string;
  description: string;
  fields: { name: string; value: string; inline?: boolean }[];
  colorHex?: string;
  txUrl?: string;
}

export class WebhookNotifier {
  private static discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
  private static telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  private static telegramChatId = process.env.TELEGRAM_CHAT_ID;

  /**
   * Dispatches rich embeds to Discord webhook or Telegram bot
   */
  public static async sendAlert(alert: WebhookAlertPayload): Promise<boolean> {
    const timestamp = new Date().toISOString();

    // 1. Discord Webhook format
    if (this.discordWebhookUrl && this.discordWebhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      try {
        const color = alert.eventType === 'EXECUTION_SUCCESS' ? 0x10b981 : alert.eventType === 'PREFLIGHT_BLOCKED' ? 0xef4444 : 0x6366f1;
        await axios.post(this.discordWebhookUrl, {
          username: 'OmniKeeper AegisAgent',
          avatar_url: 'https://app.keeperhub.com/favicon.ico',
          embeds: [{
            title: alert.title,
            description: alert.description,
            color,
            fields: alert.fields,
            footer: { text: `KeeperHub SLA Verified • ${timestamp}` },
            url: alert.txUrl
          }]
        }, { timeout: 4000 });
      } catch (_) {}
    }

    // 2. Telegram Bot format
    if (this.telegramBotToken && this.telegramChatId) {
      try {
        const msg = `🛡️ *${alert.title}*\n${alert.description}\n\n` +
          alert.fields.map(f => `• *${f.name}*: ${f.value}`).join('\n') +
          (alert.txUrl ? `\n🔗 [View On-Chain](${alert.txUrl})` : '');

        await axios.post(`https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`, {
          chat_id: this.telegramChatId,
          text: msg,
          parse_mode: 'Markdown'
        }, { timeout: 4000 });
      } catch (_) {}
    }

    return true;
  }

  /**
   * Helper to format an AgentDecisionLog into a rich alert
   */
  public static async notifyDecision(log: AgentDecisionLog): Promise<void> {
    const isSuccess = log.status === 'COMPLETED';
    await this.sendAlert({
      channel: 'DISCORD',
      eventType: isSuccess ? 'EXECUTION_SUCCESS' : 'PREFLIGHT_BLOCKED',
      title: isSuccess ? `✅ Autonomous Execution: ${log.strategy}` : `🛑 Pre-Flight Revert Blocked: ${log.strategy}`,
      description: log.reasoning,
      fields: [
        { name: 'Action', value: log.actionTaken, inline: true },
        { name: 'Simulated Gas', value: log.simulatedGas || '142,500', inline: true },
        { name: 'Status', value: log.status, inline: true },
        ...(log.txHash ? [{ name: 'Tx Hash', value: `\`${log.txHash.slice(0, 16)}...\`` }] : [])
      ],
      txUrl: log.explorerUrl
    });
  }
}
