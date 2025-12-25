'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './plans.module.css';
import ConsultationModal from '../ConsultationModal';
import Footer from '@/components/Footer';
import ExitIntentModal from '@/components/ExitIntentModal';

const plans = [
    {
        id: 1,
        title: "WhatsApp Consultation",
        price: 499,
        description: "Get personalized car recommendations via WhatsApp. Send us your requirements, and we'll analyze them to suggest the perfect vehicle—fast, reliable, and tailored just for you.",
        detail: "1 message within 2 working days",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#16a34a' }}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        ),
        type: "basic"
    },
    {
        id: 2,
        title: "Call with an Auto-Expert",
        price: 699,
        description: "Connect one-on-one with our experts to discuss your needs, daily usage, and preferences—so you can choose the perfect car with complete confidence.",
        detail: "15-min call within 48 working hrs",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2563eb' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        ),
        type: "basic"
    },
    {
        id: 3,
        title: "2 Phone Calls",
        price: 999,
        description: "Perfect for first-time buyers or those without a shortlist. The first call helps you narrow down options, followed by test drives, and a second call to finalize your car and variant.",
        detail: "Two expert calls within 15 days",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#0891b2' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path><path d="M16 3h5v5"></path><path d="M8 21v-5h-5"></path></svg>
        ),
        type: "basic"
    },
    {
        id: 4,
        title: "4 Phone Calls",
        price: 1299,
        description: "From shortlisting the right car to final delivery, get expert support at every step. Includes up to 4 phone calls with our auto experts to help you make smarter, stress-free decisions.",
        detail: "Complete guidance till delivery",
        badge: "Most Preferred",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#d97706' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        ),
        type: "preferred"
    },
    {
        id: 5,
        title: "Express Call",
        price: 1499,
        description: "Get expert advice within 90 minutes of booking—no waiting 24-48 hours! Ideal for those making a same-day car purchase decision.",
        detail: "Urgent 1-on-1 advice within 90 mins",
        badge: "In a Hurry",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#db2777' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        ),
        type: "hurry"
    },
    {
        id: 6,
        title: "Senior Consultant",
        price: 1999,
        description: "Get expert car advice from professionals with 4+ years of industry experience. Benefit from in-depth knowledge and real-world insights from testing and reviewing cars across all segments.",
        detail: "Advice from 4+ years experienced Pros",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#4f46e5' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        ),
        type: "basic"
    },
    {
        id: 7,
        title: "Video Call with Rachit",
        price: 5999,
        description: "Get direct expert advice from Rachit Hirani, an automotive engineer and industry expert, to simplify your car-buying decision.",
        detail: "15-min exclusive video consultation",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9333ea' }}><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
        ),
        type: "premium"
    },
    {
        id: 8,
        title: "Video Call & Team",
        price: 6999,
        description: "15-min exclusive Video Call with Rachit and Two follow-ups with his team for comprehensive support.",
        detail: "Rachit's guidance + 2 Team follow-ups",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#7c3aed' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        ),
        type: "premium"
    }
];

const experts = [
    {
        id: 1,
        name: "Arjun Verma",
        role: "Senior Auto Consultant",
        bio: "Ex-Tata Motors engineer with 8 years of experience in vehicle testing.",
        image: "/experts/arjun-v2.png"
    },
    {
        id: 2,
        name: "Sarah Jen",
        role: "Luxury Car Specialist",
        bio: "Specializes in the 30L+ segment. Helped 500+ families upgrade.",
        image: "/experts/sarah-v2.png"
    },
    {
        id: 3,
        name: "Rajesh Kumar",
        role: "EV Expert",
        bio: "Your go-to guy for Electric Vehicles. impartial advice on battery and range.",
        image: "/experts/rajesh-v2.png"
    }
];

export default function PlansPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExpert, setSelectedExpert] = useState<typeof experts[0] | null>(null);
    const topRef = useRef<HTMLDivElement>(null);

    // Exit Intent Modal State
    const [showExitModal, setShowExitModal] = useState(false);
    const [exitContext, setExitContext] = useState<'expert' | 'generic' | 'switch'>('generic');
    const pendingLeaveAction = useRef<(() => void) | null>(null);
    const isLeavingIntentionally = useRef(false);

    // Track if we've initialized the history state for the main page
    const hasInitializedHistory = useRef(false);

    // Initial History Push for Global Page Exit Intent
    useEffect(() => {
        if (!hasInitializedHistory.current && typeof window !== 'undefined') {
            // Push a state so we can intercept the first 'back' action
            window.history.pushState({ page: 'plans' }, '');
            hasInitializedHistory.current = true;
        }
    }, []);

    const handleExpertClick = (expert: typeof experts[0]) => {
        console.log('Setting pendingBooking for:', expert.name);
        setSelectedExpert(expert);

        // Add history state specific to expert view
        if (typeof window !== 'undefined') {
            window.history.pushState({ expertView: true }, '');
            localStorage.setItem('pendingBooking', JSON.stringify({ expertName: expert.name }));
        }

        // smooth scroll to top of plans
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Handle Browser Back Button with Custom Modal
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            // If user is intentionally leaving, let them go
            if (isLeavingIntentionally.current) {
                isLeavingIntentionally.current = false;
                return;
            }

            // Show custom modal instead of confirm
            setExitContext(selectedExpert ? 'expert' : 'generic');
            pendingLeaveAction.current = () => {
                if (selectedExpert) {
                    setSelectedExpert(null);
                }
            };
            setShowExitModal(true);

            // Immediately push state back to prevent navigation while modal is open
            const state = selectedExpert ? { expertView: true } : { page: 'plans' };
            window.history.pushState(state, '');
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [selectedExpert]);

    const handleClearExpert = () => {
        // Exit Intent Popup for manual button (Expert View -> Plans View)
        setExitContext('switch');
        pendingLeaveAction.current = () => {
            setSelectedExpert(null);
            if (typeof window !== 'undefined' && window.history.state?.expertView) {
                isLeavingIntentionally.current = true;
                window.history.back();
            }
        };
        setShowExitModal(true);
    };

    // Exit Modal Handlers
    const handleExitStay = () => {
        setShowExitModal(false);
        pendingLeaveAction.current = null;
    };

    const handleExitLeave = () => {
        setShowExitModal(false);

        if (pendingLeaveAction.current) {
            pendingLeaveAction.current();
            pendingLeaveAction.current = null;
        }

        // If leaving the page entirely, navigate to home
        if (exitContext === 'generic') {
            window.location.href = '/';
        }
    };

    // Filter plans based on selection
    const visiblePlans = selectedExpert
        ? plans.filter(p => p.id === 5 || p.id === 6) // Express Call & Senior Consultant
        : plans;

    return (
        <>
            <div className={styles.container} ref={topRef}>
                {selectedExpert ? (
                    <div className={styles.expertSelectedHeader}>
                        <button onClick={handleClearExpert} className={styles.backButton}>
                            ← View All Plans
                        </button>
                        <div className={styles.selectedExpertCard}>
                            <div className={styles.selectedExpertImage}>
                                <Image src={selectedExpert.image} alt={selectedExpert.name} fill style={{ objectFit: 'cover' }} />
                            </div>
                            <div>
                                <h1 className={styles.title}>Booking with {selectedExpert.name}</h1>
                                <p className={styles.subtitle}>{selectedExpert.role.toUpperCase()}</p>
                                <p className={styles.expertBio}>{selectedExpert.bio}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.header}>
                        <h1 className={styles.title}>Select Your Plan</h1>
                        <p className={styles.subtitle}>Expert guidance tailored to your car buying journey.</p>
                    </div>
                )}

                <div className={styles.grid}>
                    {visiblePlans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`${styles.card} ${plan.type === 'preferred' ? styles.cardPreferred : ''} ${plan.type === 'hurry' ? styles.cardHurry : ''}`}
                        >
                            {plan.badge && (
                                <span className={`${styles.badge} ${plan.type === 'preferred' ? styles.badgePreferred : ''} ${plan.type === 'hurry' ? styles.badgeHurry : ''}`}>
                                    {plan.badge}
                                </span>
                            )}

                            <div className={styles.cardHeaderRow}>
                                <div className={styles.iconWrapper}>
                                    {plan.icon}
                                </div>
                                <div className={styles.priceTag}>
                                    <span className={styles.currency}>₹</span>
                                    {plan.price}
                                </div>
                            </div>

                            <h3 className={styles.cardTitle}>{plan.title}</h3>

                            <div className={styles.detailBox}>
                                {plan.detail}
                            </div>

                            <p className={styles.cardDesc}>{plan.description}</p>

                            <button onClick={() => setIsModalOpen(true)} className={styles.btnPrimary}>Select Plan</button>
                        </div>
                    ))}
                </div>

                {/* Meet The Experts Section - Only show if no expert selected, or keep it to allow switching? User said "these two plans will show up" - implying focus. I will hide experts grid when one is selected to avoid clutter. */}
                {!selectedExpert && (
                    <div className={styles.expertSection}>
                        <div className={styles.expertHeader}>
                            <span className={styles.sectionTag}>Experts</span>
                            <h2 className={styles.expertTitle}>Meet The Experts</h2>
                            <p className={styles.expertSubtitle}>
                                Our certified automotive engineers and luxury market specialists have tested over 500+ vehicles.
                                Get unbiased, data-backed advice tailored to your specific needs and budget.
                            </p>
                        </div>

                        <div className={styles.expertGrid}>
                            {experts.map((expert) => (
                                <div key={expert.id} className={styles.expertCard}>
                                    <div className={styles.expertImageWrapper}>
                                        <Image
                                            src={expert.image}
                                            alt={expert.name}
                                            fill
                                            className={styles.expertImage}
                                        />
                                    </div>
                                    <div className={styles.expertInfo}>
                                        <h3 className={styles.expertName}>{expert.name}</h3>
                                        <p className={styles.expertRole}>{expert.role}</p>
                                        <p className={styles.expertBio}>{expert.bio}</p>
                                        <button onClick={() => handleExpertClick(expert)} className={styles.expertBtn}>
                                            Book a call with {expert.name.split(' ')[0]}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

                <ExitIntentModal
                    isOpen={showExitModal}
                    onStay={handleExitStay}
                    onLeave={handleExitLeave}
                    expertName={selectedExpert?.name.split(' ')[0]}
                    isExpertView={exitContext === 'expert' || exitContext === 'switch'}
                />
            </div>
            <Footer />
        </>
    );
}
