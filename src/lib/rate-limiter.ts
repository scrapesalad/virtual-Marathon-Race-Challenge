interface RateLimiterOptions {
  windowMs: number;  // Time window in milliseconds
  max: number;       // Maximum number of requests allowed in the window
}

interface RateLimiterResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

export class RateLimiter {
  private requests: Map<string, number[]>;
  private readonly windowMs: number;
  private readonly max: number;

  constructor(options: RateLimiterOptions) {
    this.windowMs = options.windowMs;
    this.max = options.max;
    this.requests = new Map();
  }

  async check(key: string): Promise<RateLimiterResult> {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing timestamps for this key
    let timestamps = this.requests.get(key) || [];

    // Filter out expired timestamps
    timestamps = timestamps.filter((time: number) => time > windowStart);

    // Check if we're over the limit
    if (timestamps.length >= this.max) {
      const oldestTimestamp = timestamps[0];
      const resetTime = oldestTimestamp + this.windowMs;
      return {
        success: false,
        remaining: 0,
        resetTime
      };
    }

    // Add current timestamp
    timestamps.push(now);
    this.requests.set(key, timestamps);

    return {
      success: true,
      remaining: this.max - timestamps.length,
      resetTime: now + this.windowMs
    };
  }

  // Clean up old entries periodically
  private cleanup() {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    Array.from(this.requests.entries()).forEach(([key, timestamps]) => {
      const validTimestamps = timestamps.filter((time: number) => time > windowStart);
      if (validTimestamps.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validTimestamps);
      }
    });
  }
} 