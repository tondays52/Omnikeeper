# 🎁 @keeperhub/plugin-polymarket
### Official KeeperHub Plugin for Polymarket CTF Exchange & Prediction Markets
> **DoraHacks Bounty Track Submission: Best KeeperHub Feature ($1,000 Bounty)**

---

## 📌 Overview

This standalone plugin brings **Polymarket Conditional Token Framework (CTF) trading actions** to the KeeperHub ecosystem. It enables AI agents (via ElizaOS / MCP) and deterministic workflow DAGs to query prediction market probabilities and execute conditional outcome token trades with built-in pre-flight simulation (`simulate: true`) and non-custodial Safe execution.

---

## 🚀 Key Actions & MCP Schemas

### 1. `polymarket/buy-outcome-token`
- **Category**: `DeFi & Prediction`
- **Network**: Polygon Mainnet (`137`)
- **Description**: Purchases YES/NO outcome tokens on the Polymarket CTF Exchange contract with pre-flight slippage bounds.
- **Input Schema**:
  ```json
  {
    "type": "object",
    "properties": {
      "marketConditionId": { "type": "string", "description": "32-byte hex condition ID" },
      "outcomeIndex": { "type": "number", "description": "0 for NO, 1 for YES" },
      "amountUsdc": { "type": "string", "description": "Amount of USDC to spend" },
      "maxSlippagePercent": { "type": "number", "description": "Max slippage % (default 0.5%)" }
    },
    "required": ["marketConditionId", "outcomeIndex", "amountUsdc"]
  }
  ```

### 2. `polymarket/get-market-odds`
- **Description**: Queries live Polymarket Gamma CLOB API for real-time market probability, volume, and mid-prices with zero gas.
- **Input Schema**:
  ```json
  {
    "type": "object",
    "properties": {
      "marketConditionId": { "type": "string", "description": "Polymarket condition ID or slug" }
    },
    "required": ["marketConditionId"]
  }
  ```

---

## 🧪 Testing & Verification

```bash
# Build TypeScript definitions
npm run build

# Run automated unit test suite
npm test
```

### Test Coverage:
- ✔ MCP Tool metadata schema validation
- ✔ `buy-outcome-token` pre-flight simulation (`simulate: true`)
- ✔ On-chain execution envelope creation
- ✔ Real-time live Gamma API market probability retrieval

---

## 🔗 Live Execution Proof
- **Polygon Mainnet Tx Hash**: [`0x99e52e0081c74ad699e54a01c40b8a1c89f2a0011bba8f01c892837482910fae`](https://polygonscan.com/tx/0x99e52e0081c74ad699e54a01c40b8a1c89f2a0011bba8f01c892837482910fae)
- **Target Contract**: `0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E` (Polymarket CTF Exchange)
