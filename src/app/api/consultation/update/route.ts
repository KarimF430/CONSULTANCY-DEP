import { NextResponse } from 'next/server';
import { getDoc } from '@/lib/googleSheets';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { submissionId, data } = body;

        if (!submissionId) {
            return NextResponse.json({ error: 'Missing submission ID' }, { status: 400 });
        }

        const doc = await getDoc();
        const sheet = doc.sheetsByIndex[0];

        // Find row by Submission ID
        const rows = await sheet.getRows();
        const row = rows.find(r => r.get('Submission ID') === submissionId);

        if (row) {
            // Flatten the shortlist data for the sheet
            // Format shortlist data cleanly
            const formatEntry = (entry: any) => {
                if (!entry || !entry.product) return '';
                let parts = [`Car: ${entry.product}`];
                if (entry.whyThis) parts.push(`Pros: ${entry.whyThis}`);
                if (entry.whyNot) parts.push(`Cons: ${entry.whyNot}`);
                if (entry.comments) parts.push(`Note: ${entry.comments}`); // Capturing comments too
                return parts.join('\n'); // Use newline for readability in cell
            };

            const shortlist1 = formatEntry(data.shortlist1);
            const shortlist2 = formatEntry(data.shortlist2);
            const shortlist3 = formatEntry(data.shortlist3);

            row.assign({
                'Status': 'In Progress',
                'Full Name': data.fullName || '',
                'WhatsApp': data.whatsapp || '',
                'Email': data.email || '',
                'City': data.city || '',
                'PIN': data.pinCode || '',
                'State': data.state || '',
                'Budget': data.budget || '',
                'Family Size': data.familySize || '',
                'Priority 1': data.priority1 || '',
                'Priority 2': data.priority2 || '',
                'Priority 3': data.priority3 || '',
                'Shortlist 1': shortlist1,
                'Shortlist 2': shortlist2,
                'Shortlist 3': shortlist3,
            });
            await row.save();
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Sheet Update Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
