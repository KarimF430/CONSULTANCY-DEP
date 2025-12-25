import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { payuRateLimiter, checkRateLimit } from '@/lib/rateLimiter';

// PayU Official Test/Sandbox Credentials
const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || 'gtKFFx';
const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT || 'eCwWELxi';
const PAYU_BASE_URL = process.env.PAYU_MODE === 'LIVE'
    ? 'https://secure.payu.in/_payment'
    : 'https://test.payu.in/_payment';

// Generate hash for PayU
function generateHash(params: Record<string, string>): string {
    const hashString = `${PAYU_MERCHANT_KEY}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|||||||||||${PAYU_MERCHANT_SALT}`;
    return crypto.createHash('sha512').update(hashString).digest('hex');
}

export async function POST(request: NextRequest) {
    try {
        // Rate limiting - use IP or forwarded header
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            'anonymous';

        const rateLimitResult = await checkRateLimit(payuRateLimiter, ip);
        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.', retryAfter: rateLimitResult.retryAfter },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { name, email, phone, amount, planName, orderId } = body;

        if (!name || !email || !phone || !amount) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate email format
        if (!/\S+@\S+\.\S+/.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate phone format (Indian)
        if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) {
            return NextResponse.json(
                { error: 'Invalid phone number' },
                { status: 400 }
            );
        }

        // Validate amount
        if (typeof amount !== 'number' || amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid amount' },
                { status: 400 }
            );
        }

        // Create transaction ID
        const txnid = orderId || `TXN${Date.now()}`;

        // PayU parameters
        const params: Record<string, string> = {
            key: PAYU_MERCHANT_KEY,
            txnid,
            amount: amount.toString(),
            productinfo: planName || 'Car Consultation',
            firstname: name.split(' ')[0],
            lastname: name.split(' ').slice(1).join(' ') || '',
            email,
            phone,
            surl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payu/success`,
            furl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payu/failure`,
        };

        // Generate hash
        params.hash = generateHash(params);

        return NextResponse.json({
            success: true,
            paymentUrl: PAYU_BASE_URL,
            params,
        });
    } catch (error) {
        console.error('PayU order creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create payment' },
            { status: 500 }
        );
    }
}
