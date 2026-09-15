export interface SecurityValidationRequest {
  targetContract: string;
  assetSymbol?: string;
  amountUsd?: number;
  slippagePercent?: number;
  functionSelector?: string;
}

export interface SecurityValidationResponse {
  allowed: boolean;
  blockedReason?: string;
  securityTier: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK_APPROVED' | 'CRITICAL_BLOCKED';
  circuitBreakerActive: boolean;
  timestamp: string;
}

export class SecurityPolicyManager {
  // Whitelisted Protocol Contracts on Base, Polygon, and Arbitrum
  private static WHITELISTED_CONTRACTS: Set<string> = new Set([
    '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5'.toLowerCase(), // Aave V3 Pool (Base)
    '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'.toLowerCase(), // USDC (Base)
    '0x4200000000000000000000000000000000000006'.toLowerCase(), // WETH (Base)
    '0x2626664c2603336E57B271c5C0b26F421741e481'.toLowerCase(), // Uniswap V3 SwapRouter02 (Base)
    '0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E'.toLowerCase(), // Polymarket CTF Exchange (Polygon)
    '0x9A4B8c99fA56c52aCDeB32800D15C2c8e01F7802'.toLowerCase()  // OmniKeeper Safe Smart Account
  ]);

  private static MAX_ALLOWED_SLIPPAGE = 0.5; // Max 0.50% (50 bps)
  private static MAX_SINGLE_TX_USD = 50000; // $50,000 USD cap per automated transaction

  /**
   * Validates whether a transaction satisfies all non-custodial security policies
   */
  public static validateTransaction(req: SecurityValidationRequest): SecurityValidationResponse {
    const timestamp = new Date().toISOString();

    // 1. Check Global Emergency Circuit Breaker
    const isPaused = process.env.EMERGENCY_PAUSE === 'true' || process.env.CIRCUIT_BREAKER_TRIGGERED === 'true';
    if (isPaused) {
      return {
        allowed: false,
        blockedReason: '🛑 Transaction Blocked: Global Emergency Circuit Breaker is active.',
        securityTier: 'CRITICAL_BLOCKED',
        circuitBreakerActive: true,
        timestamp
      };
    }

    // 2. Check Whitelisted Contract Target
    const normalizedTarget = req.targetContract.toLowerCase();
    if (!this.WHITELISTED_CONTRACTS.has(normalizedTarget)) {
      return {
        allowed: false,
        blockedReason: `🛑 Target contract ${req.targetContract} is NOT in the authorized DeFi whitelist.`,
        securityTier: 'CRITICAL_BLOCKED',
        circuitBreakerActive: false,
        timestamp
      };
    }

    // 3. Check Slippage Bounds
    if (req.slippagePercent !== undefined && req.slippagePercent > this.MAX_ALLOWED_SLIPPAGE) {
      return {
        allowed: false,
        blockedReason: `🛑 Slippage tolerance ${req.slippagePercent}% exceeds maximum allowable limit of ${this.MAX_ALLOWED_SLIPPAGE}%.`,
        securityTier: 'CRITICAL_BLOCKED',
        circuitBreakerActive: false,
        timestamp
      };
    }

    // 4. Check Value Limits
    if (req.amountUsd !== undefined && req.amountUsd > this.MAX_SINGLE_TX_USD) {
      return {
        allowed: false,
        blockedReason: `🛑 Transaction amount $${req.amountUsd.toLocaleString()} exceeds single automated allowance cap of $${this.MAX_SINGLE_TX_USD.toLocaleString()}. Multi-sig approval required.`,
        securityTier: 'CRITICAL_BLOCKED',
        circuitBreakerActive: false,
        timestamp
      };
    }

    return {
      allowed: true,
      securityTier: (req.amountUsd || 0) > 10000 ? 'MEDIUM_RISK' : 'LOW_RISK',
      circuitBreakerActive: false,
      timestamp
    };
  }

  /**
   * Returns list of currently authorized smart contract addresses
   */
  public static getWhitelistedContracts(): string[] {
    return Array.from(this.WHITELISTED_CONTRACTS);
  }
}
