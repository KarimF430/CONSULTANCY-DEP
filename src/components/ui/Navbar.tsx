import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";

export function Navbar() {
    return (
        <header className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/motoroctane-logo.png"
                        alt="MotorOctane Logo"
                        width={44}
                        height={44}
                        className={styles.logoImage}
                    />
                    MotorOctane
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
            </div>
        </header>
    );
}
