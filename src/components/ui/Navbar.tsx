import Link from "next/link";
import styles from "./Navbar.module.css";
import { Button } from "./Button";

export function Navbar() {
    return (
        <header className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.brandHighlight}>Car</span>Consultancy
                </Link>
                <nav className={styles.navLinks}>
                    <Link href="/experts" className={styles.link}>
                        Find an Expert
                    </Link>
                    <Link href="/cars" className={styles.link}>
                        Car Reviews
                    </Link>
                    <Link href="/about" className={styles.link}>
                        Why Us
                    </Link>
                </nav>
                <div className={styles.actions}>
                    <Button variant="primary">Book a Call</Button>
                </div>
            </div>
        </header>
    );
}
