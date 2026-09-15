# Security Policy & Execution Guardrails

## 🛡️ Overview

OmniKeeper (AegisAgent) operates at the intersection of **autonomous probabilistic AI reasoning (ElizaOS)** and **deterministic on-chain execution (KeeperHub)**. Because AI agents control and safeguard multi-million dollar treasury reserves across Aave V3, Safe Smart Accounts, Hyperliquid, and Polymarket, we adhere to strict non-custodial security principles and programmatic guardrails.

---

## 🔒 Core Security Principles

### 1. Mandatory Pre-Flight Simulation (`simulate: true`)
- **Zero Blind Broadcasts**: No transaction is ever submitted directly to the public mempool without passing EVM state simulation on live RPC forks.
- **Revert Abort**: Any calldata that results in an EVM revert, out-of-gas condition, or slippage violation is immediately intercepted and aborted before reaching the blockchain.
- **Bytecode Inspection**: Calldata targets and function selectors are cryptographically verified against whitelisted protocol contracts (Aave V3 Pool, Uniswap V3 Router, Polymarket CTF Exchange).

### 2. Programmatic Value & Allowance Caps
In both `LIVE` and `SIMULATED` modes, the execution engine enforces strict per-transaction and daily limits:
- **Max Single Live USDC Transfer / Collateral Sweep**: `$2.00 USDC` (Live test cap) / `$50,000 USDC` (Production Safe multisig)
- **Max Single Live Native ETH Transfer**: `0.001 ETH` (Live test cap) / `10.0 ETH` (Production)
- **Max Slippage Tolerance**: Strict cap at `0.5%` (`50 bps`). Any route exceeding this threshold fails pre-flight validation.

### 3. Non-Custodial Multi-Signature Architecture
- Agents never hold custody of primary treasury assets.
- All high-value actions are dispatched to **Safe {Core} Smart Accounts** (`0x9A4B...7802`) configured with Turnkey / non-custodial session keys.
- Emergency withdrawals and contract upgrade permissions remain strictly under multi-signature governance (`3-of-5`).

### 4. Private RPC & MEV Protection
- All on-chain broadcasts route through **Flashbots / Private RPC endpoints** on Base and Polygon.
- Mempool protection eliminates front-running, sandwich attacks, and toxic MEV extraction during automated rebalances.

### 5. Smart Gas & Nonce Management
- Deterministic queueing prevents nonce desynchronization during rapid market volatility.
- Dynamic gas caps prevent wallet depletion during sudden gas fee spikes.

---

## 🚨 Emergency Circuit Breaker & Killswitch

If anomalous market behavior or oracle desynchronization is detected:
1. **Automated Pause**: If Aave oracle lag exceeds 300 seconds or DEX slippage exceeds 5%, autonomous execution halts immediately.
2. **Manual Admin Override**: Administrators can toggle `EMERGENCY_PAUSE=true` in the environment or via the KeeperHub Dashboard to instantly revoke all delegated agent allowances.

---

## 🐛 Reporting a Vulnerability

We appreciate the efforts of security researchers in keeping the DeFi and AI agent ecosystem safe.

### Reporting Process:
- **Email**: `security@omnikeeper.network` (or open a confidential security advisory on GitHub).
- **PGP Key**: Fingerprint available upon request.
- **Response SLA**:
  - Initial Acknowledgement: **Within 12 hours**
  - Triage & Severity Rating: **Within 24 hours**
  - Patch & Mitigation: **Within 48 hours**

### Scope:
- `packages/agent-core`: Execution engine, simulation validator, and strategy triggers.
- `packages/plugin-eliza`: MCP action handlers, client transports, and error classification.
- `@keeperhub/plugin-polymarket`: CTF contract interfaces and input validation schemas.
- `packages/workflows`: Deterministic DAG definitions and state transitions.

### Out of Scope:
- Third-party protocol smart contracts (Aave V3, Polymarket CTF, Uniswap V3, Hyperliquid L1), which have their own independent bounty programs.
- Known simulation testnet rate-limits.

---

## 📜 Supported Versions

| Package | Version | Supported |
| :--- | :--- | :---: |
| `omnikeeper-agent-core` | `1.2.x` | ✅ |
| `@keeperhub/plugin-eliza` | `1.0.x` | ✅ |
| `@keeperhub/plugin-polymarket` | `1.2.x` | ✅ |
| `omnikeeper-dashboard` | `1.0.x` | ✅ |
