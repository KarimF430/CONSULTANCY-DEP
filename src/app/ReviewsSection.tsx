'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

const reviews = [
    {
        id: 1,
        name: 'Rahul Sharma',
        image: '/reviews/rahul.png',
        rating: 5.0,
        text: '"I was about to book a Creta but the expert pointed out upcoming facelift features. Saved me from buying an outdated model!"'
    },
    {
        id: 2,
        name: 'Priya Menon',
        image: '/reviews/priya.png',
        rating: 5.0,
        text: '"They found ₹40,000 worth of unnecessary add-ons in my dealer quote. The consultation paid for itself 10x over!"'
    },
    {
        id: 3,
        name: 'Amit Kumar',
        image: '/reviews/amit.png',
        rating: 5.0,
        text: '"Found a hidden gearbox issue in a used car I almost bought. Saved me ₹2 Lakhs in future repairs!"'
    },
    {
        id: 4,
        name: 'Sneha Reddy',
        image: '/reviews/sneha.png',
        rating: 5.0,
        text: '"15 minutes cleared months of online research confusion. Finally, advice I can trust without any sales agenda!"'
    },
    {
        id: 5,
        name: 'Vikram Singh',
        image: '/reviews/vikram.png',
        rating: 5.0,
        text: '"Best ₹500 I ever spent. Got clarity on Thar vs Jimny in just one call. Bought the Thar, couldn\'t be happier!"'
    }
];

interface ReviewsSectionProps {
    onBookCall?: () => void;
}

export default function ReviewsSection({ onBookCall }: ReviewsSectionProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToCard = (index: number) => {
        setActiveIndex(index);
        if (scrollRef.current) {
            const cardWidth = 320; // card width + gap
            scrollRef.current.scrollTo({
                left: index * cardWidth,
                behavior: 'smooth'
            });
        }
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const scrollLeft = scrollRef.current.scrollLeft;
            const cardWidth = 320;
            const newIndex = Math.round(scrollLeft / cardWidth);
            if (newIndex !== activeIndex && newIndex >= 0 && newIndex < reviews.length) {
                setActiveIndex(newIndex);
            }
        }
    };

    return (
        <section className={styles.reviews}>
            <div className={styles.sectionContainer}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionTag}>Testimonials</span>
                    <h2 className={styles.sectionTitle}>What Car Owners Say</h2>
                    <p className={styles.sectionSubtitle}>
                        Real stories from people who trusted us with their car buying journey.
                    </p>
                </div>
            </div>

            <div
                className={styles.reviewsScroll}
                ref={scrollRef}
                onScroll={handleScroll}
            >
                {reviews.map((review) => (
                    <div key={review.id} className={styles.reviewCard}>
                        <div className={styles.reviewImageWrapper}>
                            <Image
                                src={review.image}
                                alt={`${review.name} with their new car`}
                                width={300}
                                height={200}
                                className={styles.reviewImage}
                            />
                        </div>
                        <div className={styles.reviewInfo}>
                            <h4 className={styles.reviewerName}>{review.name}</h4>
                            <div className={styles.reviewRating}>
                                <span className={styles.ratingNumber}>{review.rating}</span>
                                <span className={styles.ratingStar}>★</span>
                            </div>
                        </div>
                        <p className={styles.reviewText}>{review.text}</p>
                    </div>
                ))}
            </div>

            {/* Scroll indicator dots */}
            <div className={styles.scrollDots}>
                {reviews.map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.scrollDot} ${index === activeIndex ? styles.scrollDotActive : ''}`}
                        onClick={() => scrollToCard(index)}
                        aria-label={`Go to review ${index + 1}`}
                    />
                ))}
            </div>

            {/* CTA Button */}
            <div className={styles.reviewsCta}>
                <button onClick={onBookCall} className={styles.ctaPrimary}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    Book Consultancy Call
                </button>
            </div>
        </section>
    );
}
