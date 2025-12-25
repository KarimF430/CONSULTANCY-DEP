'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './failed.module.css';

export default function OrderFailedPage() {
    const router = useRouter();

    const handleRetry = () => {
        router.push('/checkout');
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {/* Failed Icon */}
                <div className={styles.failedIcon}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                </div>

                <h1 className={styles.title}>Payment Failed 😔</h1>
                <p className={styles.subtitle}>Don't worry, your money is safe. No amount was deducted.</p>

                {/* Reason */}
                <div className={styles.reasonBox}>
                    <h3 className={styles.reasonTitle}>What might have happened?</h3>
                    <ul className={styles.reasonList}>
                        <li>Bank server timeout</li>
                        <li>Insufficient balance</li>
                        <li>Session expired</li>
                        <li>Network connectivity issue</li>
                    </ul>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <button onClick={handleRetry} className={styles.retryBtn}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M23 4v6h-6M1 20v-6h6" />
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                        Retry Payment
                    </button>

                    <Link href="/cart" className={styles.cartBtn}>
                        Back to Cart
                    </Link>

                    <a href="https://wa.me/919876543210" className={styles.supportLink}>
                        Need help? Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
