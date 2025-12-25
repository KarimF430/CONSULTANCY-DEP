import { ExpertCard } from "@/components/ExpertCard";
import styles from "./page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Find an Expert | Car Consultancy",
    description: "Book a call with verified automotive experts.",
};

// Static experts data - no database dependency
const experts = [
    {
        id: "expert-1",
        name: "Karim Beldar",
        bio: "15+ years of experience in the automotive industry. Former dealership manager with deep knowledge of pricing, negotiations, and vehicle inspections.",
        specialties: "New Car Buying, Used Car Inspection, Price Negotiation",
        rating: 4.9,
        reviewCount: 127,
        hourlyRate: 1500,
    },
    {
        id: "expert-2",
        name: "Amit Sharma",
        bio: "Certified automotive engineer with expertise in luxury and performance vehicles. Helped clients save lakhs on premium car purchases.",
        specialties: "Luxury Cars, Performance Vehicles, Technical Inspection",
        rating: 4.8,
        reviewCount: 89,
        hourlyRate: 2000,
    },
    {
        id: "expert-3",
        name: "Priya Menon",
        bio: "Former auto journalist with insider knowledge of the Indian car market. Expert in first-time car buying and family vehicle selection.",
        specialties: "First-Time Buyers, Family Cars, Budget Planning",
        rating: 4.7,
        reviewCount: 64,
        hourlyRate: 1200,
    },
];

export default function ExpertsPage() {
    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Speak to an Expert</h1>
                <p className={styles.subtitle}>
                    Stop guessing. Get unbiased advice from industry veterans who have
                    saved clients crores in bad deals and unnecessary add-ons.
                </p>
            </header>

            {experts.length > 0 ? (
                <div className={styles.grid}>
                    {experts.map((expert) => (
                        <ExpertCard
                            key={expert.id}
                            id={expert.id}
                            name={expert.name}
                            bio={expert.bio}
                            specialties={expert.specialties}
                            rating={expert.rating}
                            reviewCount={expert.reviewCount}
                            hourlyRate={expert.hourlyRate}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <h3>No experts found</h3>
                    <p>Check back later as we onboard more specialists.</p>
                </div>
            )}
        </main>
    );
}
