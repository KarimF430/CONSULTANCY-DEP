import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const params: Record<string, string> = {};

        formData.forEach((value, key) => {
            params[key] = value.toString();
        });

        console.log('PayU Failure Response:', params);

        // Redirect to failure page
        const failureUrl = new URL('/order-failed', request.url);
        failureUrl.searchParams.set('reason', params.error_Message || 'Payment failed');

        return NextResponse.redirect(failureUrl);
    } catch (error) {
        console.error('PayU failure callback error:', error);
        return NextResponse.redirect(new URL('/order-failed', request.url));
    }
}
