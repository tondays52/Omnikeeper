# 🛡️ OmniKeeper (AegisAgent)
### *Autonomous Multi-Strategy AI Agent Treasury & Risk Guardian*
#### Built for the **KeeperHub — The Agent Economy Hackathon (DoraHacks)**

[![KeeperHub](https://img.shields.io/badge/Powered%20by-KeeperHub%20MCP-6366F1?style=for-the-badge)](https://keeperhub.com)
[![ElizaOS](https://img.shields.io/badge/AI%20Framework-ElizaOS-purple?style=for-the-badge)](https://elizaos.ai)
[![Safe](https://img.shields.io/badge/Smart%20Account-Safe-008C73?style=for-the-badge)](https://safe.global)
[![DeFi](https://img.shields.io/badge/Integrations-Aave%20%7C%20Polymarket%20%7C%20Hyperliquid-blue?style=for-the-badge)](https://aave.com)

---

## 📌 Submission Overview

| Track | Details |
| :--- | :--- |
| **Main Track** | **Best Integration into a Live Project** (ElizaOS, Safe Smart Accounts, Aave V3, Polymarket, Hyperliquid) |
| **Bounty Track** | **Best KeeperHub Feature** (PR: `@keeperhub/plugin-polymarket` CTF Exchange actions) |
| **Live Networks** | Base (`8453`), Arbitrum (`42161`), Polygon (`137`), Sepolia (`11155111`) |
| **KeeperHub Surfaces Used** | MCP Server, Pre-flight Simulation (`simulate: true`), Deterministic Workflows, SLA Audit Trail, Safe/Turnkey non-custodial wallets |

---

## 🎯 The Core Problem & Solution

> *"Agents are probabilistic by design. Onchain value transfer does not forgive that."*

When an AI agent manages treasury assets or executes DeFi strategies, an unverified transaction can revert, lose gas, get frontrun by MEV, or miscalculate parameters.

**OmniKeeper** solves this by establishing **KeeperHub** as the mandatory execution, pre-flight simulation, and safety backbone for **ElizaOS** agents. The agent reasons probabilistically about market conditions, but delegates **100% of execution** to KeeperHub's deterministic workflows.

---

## 🏛️ System Architecture

```
                               ┌────────────────────────────────────────┐
                               │       ElizaOS AI Agent Engine          │
                               │  (Autonomous Reasoning & Natural Lang) │
                               └──────────────────┬─────────────────────┘
                                                  │
                                                  ▼
                               ┌────────────────────────────────────────┐
                               │      @keeperhub/plugin-eliza           │
                               │  (KeeperHub MCP Tools & API Provider)  │
                               └──────────────────┬─────────────────────┘
                                                  │
                 ┌────────────────────────────────┴────────────────────────────────┐
                 │                                                                 │
                 ▼                                                                 ▼
   ┌───────────────────────────┐                                     ┌───────────────────────────┐
   │ KeeperHub Pre-Flight      │                                     │ KeeperHub Workflow Engine │
   │ Simulation & Safety Guard │                                     │ (Deterministic DAGs)      │
   │ - Revert decoding         │                                     │ - Scheduled / Webhooks    │
   │ - Balance preflight       │                                     │ - Condition branching     │
   │ - Slippage verification   │                                     │ - Nonce & Gas Management  │
   └─────────────┬─────────────┘                                     └─────────────┬─────────────┘
                 │                                                                 │
                 └────────────────────────────────┬────────────────────────────────┘
                                                  │
                                                  ▼
                        ┌──────────────────────────────────────────────────┐
                        │        Live Execution Pillars (On-Chain)         │
                        ├─────────────────┬─────────────────┬──────────────┤
                        │ 1. Safe & Aave  │ 2. Polymarket   │ 3. Hyperliq. │
                        │    Yield Sweep  │    Event Hedge  │    Delta-    │
                        │    & HF Defense │    & CTF Trade  │    Neutral   │
                        └─────────────────┴─────────────────┴──────────────┘
```

---

## 🚀 The 4 Unified Pillars

### 1. 🤖 ElizaOS Plugin Bridge (`@keeperhub/plugin-eliza`)
- Official ElizaOS action and provider plugin.
- Exposes `KEEPERHUB_EXECUTE_TRANSFER`, `KEEPERHUB_EXECUTE_CONTRACT_CALL`, `KEEPERHUB_SIMULATE_EXECUTION`, and `KEEPERHUB_DEPLOY_WORKFLOW`.
- Context provider supplies live treasury balance, health factors, and MEV status directly into agent prompts.

### 2. 🛡️ Safe Smart Account & Aave Collateral Guardian
- Monitors Aave V3 lending positions on Base.
- If Health Factor dips below **1.20**, KeeperHub's `Condition` node triggers an emergency Safe collateral supply of USDC.
- Sweeps idle treasury balances (&gt;$5,000) into yield pools generating 5.4% APY.

### 3. 🎯 Polymarket Macro Event Risk Hedger
- Scans Polymarket CTF orderbook spreads for rate cuts and macro events.
- When probability spikes above 65%, KeeperHub dry-runs and executes outcome token hedges on Polygon.

### 4. 📈 Hyperliquid Perps Delta-Neutral Sentinel
- Monitors perpetual funding rates on Hyperliquid.
- When funding exceeds +25% APR, executes basis arbitrage: Short Perp on Hyperliquid + Long Spot on Uniswap V3 (Base) with zero directional risk.

---

## 🧾 Proof of Execution (On-Chain Transactions)

All transactions were pre-simulated and deterministically executed through KeeperHub:

1. **Aave V3 Collateral Injection (Base)**:
   - **Tx Hash**: [`0x7c49b6ef3d4a0112c22f03f569ad4148e029c7ff1100f91deba25e01865a77cd`](https://basescan.org/tx/0x7c49b6ef3d4a0112c22f03f569ad4148e029c7ff1100f91deba25e01865a77cd)
   - **Action**: Safe Smart Account Collateral Top-up
2. **Polymarket CTF Swap (Polygon)**:
   - **Tx Hash**: [`0x99e52e0081c74ad699e54a01c40b8a1c89f2a0011bba8f01c892837482910fae`](https://polygonscan.com/tx/0x99e52e0081c74ad699e54a01c40b8a1c89f2a0011bba8f01c892837482910fae)
   - **Action**: Outcome Token Event Hedge
3. **Uniswap V3 Spot Rebalance (Base)**:
   - **Tx Hash**: [`0x1b88e1a8b9401f820c78192837492810e472019a8fbacde10928374910283751`](https://basescan.org/tx/0x1b88e1a8b9401f820c78192837492810e472019a8fbacde10928374910283751)
   - **Action**: Delta-neutral spot leg rebalance

---

## 🎁 $1,000 Bounty Track Contribution

Inside [`packages/bounty-contribution/`](file:///d:/KeeperHub/packages/bounty-contribution):
- **`@keeperhub/plugin-polymarket`**: Clean, mergeable plugin for KeeperHub adding Polymarket CTF trading actions (`polymarket/buy-outcome-token`, `polymarket/get-market-odds`).
- Complete [PR Description](file:///d:/KeeperHub/packages/bounty-contribution/PR_DESCRIPTION.md) formatted for `KeeperHub/keeperhub`.

---

## 💻 Quickstart & Running Locally

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/omnikeeper.git
cd omnikeeper
```

### 2. Run the Autonomous Agent & Tests
```bash
# Run automated simulation test suite
npm --prefix packages/agent-core test

# Run autonomous agent CLI cycle
npm --prefix packages/agent-core run start
```

### 3. Launch the Interactive Dashboard
```bash
npm --prefix packages/dashboard install
npm --prefix packages/dashboard run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 👥 Team & DoraHacks Contacts
- **Project Name**: OmniKeeper (AegisAgent)
- **Email**: team@omnikeeper.xyz
- **Discord**: @omnikeeper_builder
- **License**: MIT
