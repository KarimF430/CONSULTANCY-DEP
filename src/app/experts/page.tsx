import prisma from "@/lib/prisma";
import { ExpertCard } from "@/components/ExpertCard";
import styles from "./page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Find an Expert | Car Consultancy",
    description: "Book a call with verified automotive experts.",
};

export default async function ExpertsPage() {
    const experts = await prisma.user.findMany({
        where: {
            role: "EXPERT",
            expertProfile: {
                isNot: null,
            },
        },
        include: {
            expertProfile: true,
        },
    });

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
                            id={expert.expertProfile!.id}
                            name={expert.name || "Verified Expert"}
                            bio={expert.expertProfile!.bio}
                            specialties={expert.expertProfile!.specialties}
                            rating={expert.expertProfile!.rating}
                            reviewCount={expert.expertProfile!.reviewCount}
                            hourlyRate={expert.expertProfile!.hourlyRate}
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
