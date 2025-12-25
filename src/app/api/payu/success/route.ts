import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT || 'MIIEvgIBADANB';

// Verify hash from PayU response
function verifyHash(params: Record<string, string>): boolean {
    const keyFromPayU = params.key;
    const txnid = params.txnid;
    const amount = params.amount;
    const productinfo = params.productinfo;
    const firstname = params.firstname;
    const email = params.email;
    const status = params.status;
    const receivedHash = params.hash;

    // Reverse hash calculation
    const hashString = `${PAYU_MERCHANT_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${keyFromPayU}`;
    const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');

    return calculatedHash === receivedHash;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const params: Record<string, string> = {};

        formData.forEach((value, key) => {
            params[key] = value.toString();
        });

        console.log('PayU Success Response:', params);

        // Verify hash
        const isValid = verifyHash(params);

        if (!isValid) {
            console.error('Invalid hash from PayU');
            return NextResponse.redirect(new URL('/order-failed', request.url));
        }

        if (params.status === 'success') {
            // Store booking info in session (via redirect with query params)
            const successUrl = new URL('/order-success', request.url);
            successUrl.searchParams.set('txnid', params.txnid);
            successUrl.searchParams.set('amount', params.amount);
            successUrl.searchParams.set('status', 'success');

            return NextResponse.redirect(successUrl);
        } else {
            return NextResponse.redirect(new URL('/order-failed', request.url));
        }
    } catch (error) {
        console.error('PayU success callback error:', error);
        return NextResponse.redirect(new URL('/order-failed', request.url));
    }
}
