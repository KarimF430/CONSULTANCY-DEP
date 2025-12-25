'use client';

import styles from './plans.module.css';

const plans = [
    {
        id: 1,
        title: "WhatsApp Consultation",
        description: "Get a quick, personalized car recommendation via WhatsApp.",
        price: 499,
        icon: "💬",
        type: "basic"
    },
    {
        id: 2,
        title: "Call with Auto-Expert",
        description: "15-min call to discuss your needs and preferences one-on-one.",
        price: 699,
        icon: "📞",
        type: "basic"
    },
    {
        id: 3,
        title: "2 Phone Calls",
        description: "Two expert calls: First to shortlist, second to finalize after test drives.",
        price: 999,
        icon: "📞",
        type: "basic"
    },
    {
        id: 4,
        title: "4 Phone Calls",
        description: "Complete guidance from shortlisting to delivery check.",
        price: 1299,
        badge: "Best Value",
        icon: "🌟",
        type: "highlight"
    },
    {
        id: 5,
        title: "Express Call",
        description: "Urgent 1-on-1 advice within 90 minutes. No waiting.",
        price: 1499,
        badge: "Urgent",
        icon: "⚡",
        type: "highlight"
    },
    {
        id: 6,
        title: "Senior Consultant",
        description: "Advice from a pro with 4+ years of testing experience.",
        price: 1999,
        icon: "👨‍💼",
        type: "basic"
    },
    {
        id: 7,
        title: "Video Call with Rachit",
        description: "Exclusive video chat with Rachit Hirani (Auto Engineer).",
        price: 5999,
        icon: "📹",
        type: "basic"
    },
    {
        id: 8,
        title: "Video Call & Team",
        description: "Rachit's guidance + 2 follow-up calls with the team.",
        price: 6999,
        icon: "🎥",
        type: "basic"
    }
];

export default function PlansPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Select Your Plan</h1>
                <p className={styles.subtitle}>Expert guidance tailored to your car buying journey.</p>
            </div>

            <div className={styles.grid}>
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`${styles.card} ${plan.type === 'highlight' ? styles.cardHighlight : ''}`}
                    >
                        {plan.badge && <span className={styles.badge}>{plan.badge}</span>}

                        <div className={styles.iconWrapper}>
                            <span style={{ fontSize: '28px' }}>{plan.icon}</span>
                        </div>

                        <div className={styles.contentWrapper}>
                            <h3 className={styles.cardTitle}>{plan.title}</h3>
                            <p className={styles.cardDesc}>{plan.description}</p>
                            <div className={styles.priceRow}>
                                <span className={styles.amount}>₹{plan.price}</span>
                            </div>
                        </div>

                        <button className={styles.btnPrimary}>Select Plan</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
