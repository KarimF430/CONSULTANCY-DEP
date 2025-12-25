import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiters for different API endpoints
export const payuRateLimiter = new RateLimiterMemory({
    points: 5, // 5 requests
    duration: 60, // per 60 seconds
});

export const bookingsRateLimiter = new RateLimiterMemory({
    points: 10, // 10 requests
    duration: 60, // per 60 seconds
});

export const calendlyRateLimiter = new RateLimiterMemory({
    points: 20, // 20 requests
    duration: 60, // per 60 seconds
});

// Helper function to check rate limit
export async function checkRateLimit(
    limiter: RateLimiterMemory,
    key: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
    try {
        await limiter.consume(key);
        return { allowed: true };
    } catch (error: unknown) {
        const rateLimitError = error as { msBeforeNext?: number };
        return {
            allowed: false,
            retryAfter: Math.ceil((rateLimitError.msBeforeNext || 1000) / 1000),
        };
    }
}
