import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || 'JPM7Fg';  // Test key
const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT || 'MIIEvgIBADANB';  // Test salt
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
        const body = await request.json();
        const { name, email, phone, amount, planName, orderId } = body;

        if (!name || !email || !phone || !amount) {
            return NextResponse.json(
                { error: 'Missing required fields' },
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
