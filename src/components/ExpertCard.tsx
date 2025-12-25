import Link from "next/link";
import { Button } from "./ui/Button";
import styles from "./ExpertCard.module.css";

interface ExpertCardProps {
    id: string;
    name: string;
    bio: string;
    specialties: string;
    rating: number;
    reviewCount: number;
    hourlyRate: number;
}

export function ExpertCard({
    id,
    name,
    bio,
    specialties,
    rating,
    reviewCount,
    hourlyRate,
}: ExpertCardProps) {
    const specialtyList = specialties.split(",").map((s) => s.trim());

    return (
        <div className={styles.expertCard}>
            <div className={styles.header}>
                <div className={styles.avatarPlaceholder}>{name[0]}</div>
                <div>
                    <h3 className={styles.name}>{name}</h3>
                    <p className={styles.rating}>
                        ★ {rating.toFixed(1)} <span className={styles.count}>({reviewCount})</span>
                    </p>
                </div>
            </div>

            <p className={styles.bio}>{bio}</p>

            <div className={styles.specialties}>
                {specialtyList.map((tag) => (
                    <span key={tag} className={styles.tag}>
                        {tag}
                    </span>
                ))}
            </div>

            <div className={styles.footer}>
                <div className={styles.price}>
                    <span className={styles.amount}>₹{hourlyRate}</span>
                    <span className={styles.unit}>/hr</span>
                </div>
                <Link href={`/experts/${id}`}>
                    <Button variant="primary">Book Now</Button>
                </Link>
            </div>
        </div>
    );
}
