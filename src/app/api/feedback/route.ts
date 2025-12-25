import { NextRequest, NextResponse } from 'next/server';
import { getDoc } from '@/lib/googleSheets';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { feedback, name, email } = body;

        if (!feedback?.trim()) {
            return NextResponse.json(
                { error: 'Feedback is required' },
                { status: 400 }
            );
        }

        // Get the Google Sheets document
        const doc = await getDoc();

        // Access "sheet2" (or create it if it doesn't exist)
        let sheet = doc.sheetsByTitle['sheet2'];

        if (!sheet) {
            // Try to get the second sheet by index
            sheet = doc.sheetsByIndex[1];
        }

        if (!sheet) {
            // Create the sheet if it doesn't exist
            sheet = await doc.addSheet({
                title: 'sheet2',
                headerValues: ['Timestamp', 'Name', 'Email', 'Feedback']
            });
        }

        // Add the feedback row
        await sheet.addRow({
            'Timestamp': new Date().toISOString(),
            'Name': name || 'Anonymous',
            'Email': email || 'Not provided',
            'Feedback': feedback,
        });

        return NextResponse.json({
            success: true,
            message: 'Feedback submitted successfully'
        });

    } catch (error) {
        console.error('Feedback submission error:', error);
        return NextResponse.json(
            { error: 'Failed to submit feedback' },
            { status: 500 }
        );
    }
}
