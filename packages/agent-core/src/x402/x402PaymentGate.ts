import crypto from 'crypto';
import { AgentDecisionLog } from '../types.js';

export interface X402PaymentChallenge {
  status: 402;
  message: string;
  scheme: 'x402' | 'mpp';
  paymentDetails: {
    network: string; // "8453" (Base)
    token: string;   // USDC: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
    amount: string;  // "0.05" USDC
    recipient: string; // Safe Smart Account: 0x9A4B8c99fA56c52aCDeB32800D15C2c8e01F7802
    expiresAt: number;
    challengeId: string;
  };
}

export interface X402PaymentProof {
  challengeId: string;
  payerAddress: string;
  txHashOrSignature: string;
  amountPaid: string;
  network: string;
}

export interface X402ExecutionResponse {
  success: boolean;
  httpStatus: 200 | 400 | 402 | 500;
  paid: boolean;
  paymentProof?: X402PaymentProof;
  executionResult?: AgentDecisionLog;
  error?: string;
}

export class X402PaymentGate {
  private static PRICE_PER_EXECUTION_USDC = '0.05';
  private static SAFE_TREASURY_RECIPIENT = '0x9A4B8c99fA56c52aCDeB32800D15C2c8e01F7802';
  private static activeChallenges: Map<string, X402PaymentChallenge['paymentDetails']> = new Map();

  /**
   * Generates a standard HTTP 402 Payment Required challenge for machine-to-machine payment
   */
  public static createChallenge(serviceName: string = 'AAVE_HEALTH_GUARD'): X402PaymentChallenge {
    const challengeId = `x402_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minute challenge validity

    const details: X402PaymentChallenge['paymentDetails'] = {
      network: '8453', // Base Mainnet
      token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC Base
      amount: this.PRICE_PER_EXECUTION_USDC,
      recipient: this.SAFE_TREASURY_RECIPIENT,
      expiresAt,
      challengeId
    };

    this.activeChallenges.set(challengeId, details);

    return {
      status: 402,
      message: `HTTP 402 Payment Required: Service '${serviceName}' requires ${this.PRICE_PER_EXECUTION_USDC} USDC payment on Base (Chain ID 8453).`,
      scheme: 'x402',
      paymentDetails: details
    };
  }

  /**
   * Validates x402 payment proof submitted in HTTP request headers
   */
  public static verifyPaymentProof(proof?: X402PaymentProof): boolean {
    if (!proof) return false;
    if (!proof.challengeId || !this.activeChallenges.has(proof.challengeId)) return false;

    const challenge = this.activeChallenges.get(proof.challengeId);
    if (!challenge) return false;

    // Verify expiration
    if (Date.now() > challenge.expiresAt) {
      this.activeChallenges.delete(proof.challengeId);
      return false;
    }

    // Verify amount
    if (parseFloat(proof.amountPaid) < parseFloat(challenge.amount)) {
      return false;
    }

    // Verify txHash/signature presence
    if (!proof.txHashOrSignature || !proof.txHashOrSignature.startsWith('0x')) {
      return false;
    }

    // Consume challenge (single-use)
    this.activeChallenges.delete(proof.challengeId);
    return true;
  }

  /**
   * Middleware handler: If valid payment proof provided, executes handler; otherwise returns 402 challenge
   */
  public static async handleMonetizedExecution(
    proof: X402PaymentProof | undefined,
    executionFn: () => Promise<AgentDecisionLog>
  ): Promise<X402ExecutionResponse> {
    if (!proof || !this.verifyPaymentProof(proof)) {
      const challenge = this.createChallenge();
      return {
        success: false,
        httpStatus: 402,
        paid: false,
        error: challenge.message
      };
    }

    try {
      const executionResult = await executionFn();
      return {
        success: true,
        httpStatus: 200,
        paid: true,
        paymentProof: proof,
        executionResult
      };
    } catch (err: any) {
      return {
        success: false,
        httpStatus: 500,
        paid: true,
        error: `Execution failed after payment verification: ${err.message}`
      };
    }
  }
}
