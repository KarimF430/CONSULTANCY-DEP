'use client';

import { useState } from 'react';
import styles from './FeedbackForm.module.css';
import { toast } from 'sonner';

export default function FeedbackForm() {
    const [feedback, setFeedback] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!feedback.trim()) {
            toast.error('Please enter your feedback');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call (replace with actual endpoint)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // TODO: Send to your API or Google Sheets
            console.log('Feedback submitted:', { feedback, name, email });

            toast.success('Thank you for your feedback! 🙏');
            setIsSubmitted(true);
            setFeedback('');
            setName('');
            setEmail('');
        } catch {
            toast.error('Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <section className={styles.container}>
                <div className={styles.wrapper}>
                    <div className={styles.successState}>
                        <div className={styles.successIcon}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <h3>Thank You!</h3>
                        <p>Your feedback helps us improve our services.</p>
                        <button
                            className={styles.resetBtn}
                            onClick={() => setIsSubmitted(false)}
                        >
                            Submit Another Feedback
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Share Your Feedback</h2>
                    <p className={styles.subtitle}>
                        Help us improve by sharing your thoughts about our services
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formCard}>
                        {/* Feedback Textarea */}
                        <div className={styles.field}>
                            <label className={styles.label}>Your Feedback</label>
                            <textarea
                                className={styles.textarea}
                                placeholder="Tell us what you think about our car consultancy services..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={4}
                            />
                        </div>

                        {/* Name & Email Row */}
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label className={styles.label}>Your Name</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Email Address</label>
                                <input
                                    type="email"
                                    className={styles.input}
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className={styles.spinner}></span>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                    Submit Feedback
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
