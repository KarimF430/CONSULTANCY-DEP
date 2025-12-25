'use client';

import { useEffect, useState } from 'react';
import styles from './StickyBottomBar.module.css';
import Link from 'next/link';

export default function StickyBottomBar() {
    const [bookingData, setBookingData] = useState<{ expertName: string } | null>(null);

    useEffect(() => {
        try {
            const data = localStorage.getItem('pendingBooking');
            console.log('StickyBottomBar: checking pendingBooking', data);
            if (data) {
                const parsed = JSON.parse(data);
                if (parsed && parsed.expertName) {
                    setBookingData(parsed);
                }
            }
        } catch (e) {
            console.error('Error parsing booking data', e);
        }
    }, []);

    if (!bookingData) return null;

    return (
        <div className={styles.bar}>
            <div className={styles.content}>
                <div className={styles.textGroup}>
                    <p className={styles.title}>Complete your booking</p>
                    <p className={styles.subtitle}>You selected <strong>{bookingData.expertName}</strong>. Don't lose your slot!</p>
                </div>
                <Link href="/plans" className={styles.button}>
                    Complete Now →
                </Link>
                <button onClick={() => {
                    localStorage.removeItem('pendingBooking');
                    setBookingData(null);
                }} className={styles.closeBtn}>×</button>
            </div>
        </div>
    );
}
