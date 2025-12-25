
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Brand Column */}
                    <div className={styles.brandCol}>
                        <Link href="/" className={styles.logo}>
                            Consultancy101
                        </Link>
                        <p className={styles.brandDesc}>
                            Your trusted partner in car buying. We provide unbiased advice, expert inspections, and negotiation support to help you get the best deal.
                        </p>
                        <div className={styles.socialLinks}>
                            <a href="#" className={styles.socialIcon} aria-label="Twitter">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                            </a>
                            <a href="#" className={styles.socialIcon} aria-label="LinkedIn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            </a>
                            <a href="#" className={styles.socialIcon} aria-label="Instagram">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.col}>
                        <h4 className={styles.colTitle}>Quick Links</h4>
                        <div className={styles.linkList}>
                            <Link href="#" className={styles.link}>Home</Link>
                            <Link href="#" className={styles.link}>Expert Reviews</Link>
                            <Link href="#" className={styles.link}>Success Stories</Link>
                            <Link href="#" className={styles.link}>Pricing</Link>
                        </div>
                    </div>

                    {/* Services */}
                    <div className={styles.col}>
                        <h4 className={styles.colTitle}>Services</h4>
                        <div className={styles.linkList}>
                            <Link href="#" className={styles.link}>New Car Consultation</Link>
                            <Link href="#" className={styles.link}>Used Car Inspection</Link>
                            <Link href="#" className={styles.link}>PDI Service</Link>
                            <Link href="#" className={styles.link}>Insurance Advice</Link>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className={styles.col}>
                        <h4 className={styles.colTitle}>Contact</h4>
                        <div className={styles.linkList}>
                            <a href="mailto:hello@consultancy101.com" className={styles.link}>hello@consultancy101.com</a>
                            <a href="tel:+919876543210" className={styles.link}>+91 98765 43210</a>
                            <span className={styles.link} style={{ color: '#64748b' }}>Mon - Sat, 10am - 7pm</span>
                        </div>
                    </div>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.bottomBar}>
                    <p>&copy; {new Date().getFullYear()} Consultancy101. All rights reserved.</p>
                    <div className={styles.bottomLinks}>
                        <Link href="#" className={styles.bottomLink}>Privacy Policy</Link>
                        <Link href="#" className={styles.bottomLink}>Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
