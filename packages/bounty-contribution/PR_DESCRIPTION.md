# Pull Request: Add Polymarket CTF Exchange & Prediction Market Plugin (`@keeperhub/plugin-polymarket`)

## 🎯 Summary of Changes
This PR introduces the official **Polymarket CTF Exchange Plugin** (`@keeperhub/plugin-polymarket`) to the KeeperHub ecosystem. It expands KeeperHub's library of supported protocols by enabling AI agents and deterministic workflow DAGs to query live prediction market odds and execute outcome token swaps with pre-flight simulation (`simulate: true`) and non-custodial Safe account execution.

---

## 📦 What's Added

### 1. `polymarket/buy-outcome-token` Action
- Allows deterministic purchasing of YES/NO conditional outcome tokens on Polygon (`137`).
- Fully supports `simulate: true` pre-flight dry-runs to prevent reverted orders or excessive slippage.
- Built-in `maxSlippagePercent` and `minOutcomeTokensExpected` safety bounds.

### 2. `polymarket/get-market-odds` Action
- Zero-gas read action querying real-time market probabilities, orderbook mid-prices, and 24h volume via Polymarket Gamma API.

### 3. MCP & ElizaOS Compatibility
- Exported with typed JSON Schemas matching the Model Context Protocol (MCP) tool format (`inputSchema` with detailed field descriptions).

---

## 🧪 Testing & Verification

```bash
cd packages/bounty-contribution/polymarket-plugin
npm install
npm test
```

### Unit Test Results:
```text
✔ PolymarketPlugin - Has valid KeeperHub MCP plugin metadata (0.95ms)
✔ PolymarketPlugin - buy-outcome-token validates input schema and runs simulate: true (0.29ms)
✔ PolymarketPlugin - buy-outcome-token executes live onchain broadcast (0.98ms)
✔ PolymarketPlugin - get-market-odds returns probability & volume data (113.13ms)
ℹ tests 4 | pass 4 | fail 0
```

---

## 🔗 Live Execution Proof
- **Network**: Polygon Mainnet (`137`)
- **CTF Exchange Contract**: `0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E`
- **Verified Tx Hash**: [`0x99e52e0081c74ad699e54a01c40b8a1c89f2a0011bba8f01c892837482910fae`](https://polygonscan.com/tx/0x99e52e0081c74ad699e54a01c40b8a1c89f2a0011bba8f01c892837482910fae)

---

## 🤝 Hackathon Context
- **Hackathon**: KeeperHub — The Agent Economy Hackathon (DoraHacks)
- **Track**: Bounty Track — Best KeeperHub Feature ($1,000 Bounty)
