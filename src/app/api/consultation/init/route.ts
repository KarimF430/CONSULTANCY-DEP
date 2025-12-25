import { NextResponse } from 'next/server';
import { getDoc } from '@/lib/googleSheets';
import { v4 as uuidv4 } from 'uuid';

export async function POST() {
    try {
        const doc = await getDoc();
        const sheet = doc.sheetsByIndex[0]; // First sheet

        // Ensure headers exist
        await sheet.loadHeaderRow();
        const existingHeaders = sheet.headerValues;
        const requiredHeaders = [
            'Submission ID', 'Status', 'Full Name', 'WhatsApp', 'Email',
            'City', 'PIN', 'State', 'Budget', 'Family Size',
            'Priority 1', 'Priority 2', 'Priority 3',
            'Shortlist 1', 'Shortlist 2', 'Shortlist 3', 'Timestamp'
        ];

        // If headers are missing, set them (simple check)
        if (existingHeaders.length === 0) {
            await sheet.setHeaderRow(requiredHeaders);
        }

        const submissionId = uuidv4();
        const timestamp = new Date().toISOString();

        // Create initial row
        await sheet.addRow({
            'Submission ID': submissionId,
            'Status': 'Started',
            'Timestamp': timestamp,
        });

        return NextResponse.json({ submissionId });

    } catch (error: any) {
        console.error('Sheet Init Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
