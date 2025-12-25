'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ConsultationModal.module.css';

interface ShortlistEntry {
    product: string;
    whyThis: string;
    whyNot: string;
    comments: string;
}

interface FormData {
    fullName: string;
    email: string;
    whatsapp: string;
    city: string;
    pinCode: string;
    state: string;
    budget: string;
    familySize: string;
    priority1: string;
    priority2: string;
    priority3: string;
    shortlist1: ShortlistEntry;
    shortlist2: ShortlistEntry;
    shortlist3: ShortlistEntry;
}

interface ConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const emptyShortlist = { product: '', whyThis: '', whyNot: '', comments: '' };

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [submissionId, setSubmissionId] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        fullName: '', email: '', whatsapp: '', city: '', pinCode: '', state: '',
        budget: '', familySize: '', priority1: '', priority2: '', priority3: '',
        shortlist1: { ...emptyShortlist },
        shortlist2: { ...emptyShortlist },
        shortlist3: { ...emptyShortlist }
    });

    // 1. Initialize Session on Mount
    useEffect(() => {
        if (isOpen && !submissionId) {
            fetch('/api/consultation/init', { method: 'POST' })
                .then(res => res.json())
                .then(data => {
                    if (data.submissionId) setSubmissionId(data.submissionId);
                })
                .catch(err => console.error('Failed to init session:', err));
        }
    }, [isOpen, submissionId]);

    // 2. Autosave on Data Change (Debounced)
    useEffect(() => {
        if (!submissionId) return;

        const timer = setTimeout(() => {
            fetch('/api/consultation/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ submissionId, data: formData })
            }).catch(err => console.error('Autosave failed:', err));
        }, 1000); // 1-second debounce

        return () => clearTimeout(timer);
    }, [formData, submissionId]);

    if (!isOpen) return null;

    const handleNext = () => {
        if (step === 1) {
            if (!formData.fullName || !formData.whatsapp) {
                alert('Please fill in at least your Name and WhatsApp number.');
                return;
            }
        }
        setStep(prev => prev + 1);
    };

    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Final sync ensured by Autosave, strictly navigate
        router.push('/plans');
        onClose();
    };

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleShortlistChange = (slot: 'shortlist1' | 'shortlist2' | 'shortlist3', field: keyof ShortlistEntry, value: string) => {
        setFormData(prev => ({
            ...prev,
            [slot]: { ...prev[slot], [field]: value }
        }));
    };

    const budgetOptions = ['Under 10 Lakhs', '10-15 Lakhs', '15-20 Lakhs', '20-30 Lakhs', '30 Lakhs+', 'Flexible'];
    const familyOptions = ['1-2 People', '3-4 People', '5+ People'];
    const priorities = ['', 'Safety', 'Mileage', 'Performance', 'Comfort', 'Features', 'Resale Value', 'Brand Image', 'After Sales'];

    const progress = (step / 3) * 100;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button onClick={onClose} className={styles.closeBtn} title="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <div className={styles.header}>
                    <h2 className={styles.title}>Let's find your perfect car</h2>
                    <p className={styles.subtitle}>
                        {step === 1 && "Start with your details so we can reach you."}
                        {step === 2 && "Tell us your budget and what matters most."}
                        {step === 3 && "Which cars are you currently considering?"}
                    </p>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                    </div>
                </div>

                <div className={styles.content}>
                    {step === 1 && (
                        <div>
                            <h3 className={styles.stepTitle}>Your Details</h3>
                            <div className={styles.gridTwoCol}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Full Name <span className={styles.required}>*</span></label>
                                    <div className={styles.inputWrapper}>
                                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        <input
                                            className={styles.input}
                                            placeholder="John Doe"
                                            value={formData.fullName}
                                            onChange={e => handleChange('fullName', e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>WhatsApp Number <span className={styles.required}>*</span></label>
                                    <div className={styles.inputWrapper}>
                                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                        <input
                                            className={styles.input}
                                            placeholder="+91 98765 43210"
                                            value={formData.whatsapp}
                                            onChange={e => handleChange('whatsapp', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Email Address</label>
                                <div className={styles.inputWrapper}>
                                    <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                    <input
                                        className={styles.input}
                                        placeholder="john@example.com"
                                        type="email"
                                        value={formData.email}
                                        onChange={e => handleChange('email', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={styles.gridTwoCol}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>City</label>
                                    <div className={styles.inputWrapper}>
                                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                        <input
                                            className={styles.input}
                                            placeholder="Mumbai"
                                            value={formData.city}
                                            onChange={e => handleChange('city', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>PIN Code</label>
                                    <div className={styles.inputWrapper}>
                                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                        <input
                                            className={styles.input}
                                            placeholder="400001"
                                            value={formData.pinCode}
                                            onChange={e => handleChange('pinCode', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>State</label>
                                <div className={styles.inputWrapper}>
                                    <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
                                    <input
                                        className={styles.input}
                                        placeholder="Maharashtra"
                                        value={formData.state}
                                        onChange={e => handleChange('state', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} style={{ marginBottom: '12px', display: 'block' }}>Car Buying Budget</label>
                                <div className={styles.chipGrid}>
                                    {budgetOptions.map(opt => (
                                        <div
                                            key={opt}
                                            className={`${styles.chip} ${formData.budget === opt ? styles.chipSelected : ''}`}
                                            onClick={() => handleChange('budget', opt)}
                                        >
                                            {/* Icon could go here if needed */}
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label} style={{ marginBottom: '12px', display: 'block' }}>Family Size</label>
                                <div className={styles.chipGrid}>
                                    {familyOptions.map(opt => (
                                        <div
                                            key={opt}
                                            className={`${styles.chip} ${formData.familySize === opt ? styles.chipSelected : ''}`}
                                            onClick={() => handleChange('familySize', opt)}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <h3 className={styles.stepTitle} style={{ marginTop: '30px' }}>Your Priorities</h3>
                            <div className={styles.gridTwoCol}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>1st Priority</label>
                                    <select
                                        className={styles.select}
                                        value={formData.priority1}
                                        onChange={e => handleChange('priority1', e.target.value)}
                                    >
                                        <option value="">Select Priority</option>
                                        {priorities.map(p => p && <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>2nd Priority</label>
                                    <select
                                        className={styles.select}
                                        value={formData.priority2}
                                        onChange={e => handleChange('priority2', e.target.value)}
                                    >
                                        <option value="">Select Priority</option>
                                        {priorities.map(p => p && <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>3rd Priority</label>
                                    <select
                                        className={styles.select}
                                        value={formData.priority3}
                                        onChange={e => handleChange('priority3', e.target.value)}
                                    >
                                        <option value="">Select Priority</option>
                                        {priorities.map(p => p && <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h3 className={styles.stepTitle}>Your Shortlist</h3>
                            <p className={styles.subtitle} style={{ marginBottom: '20px' }}>Tell us about the top 3 cars you have in mind.</p>

                            {/* Shortlist 1 */}
                            <div className={styles.shortlistCard}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.numberBadge}>1</span>
                                    <span>First Choice</span>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Car Name</label>
                                    <div className={styles.inputWrapper}>
                                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle><path d="M5 17h12"></path></svg>
                                        <input
                                            className={styles.input}
                                            placeholder="e.g. Creta SX"
                                            value={formData.shortlist1.product}
                                            onChange={e => handleShortlistChange('shortlist1', 'product', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className={styles.gridTwoCol}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Pros</label>
                                        <div className={styles.inputWrapper}>
                                            <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#16a34a' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                            <input
                                                className={styles.input}
                                                placeholder="Pros (e.g. Good mileage)"
                                                value={formData.shortlist1.whyThis}
                                                onChange={e => handleShortlistChange('shortlist1', 'whyThis', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Cons</label>
                                        <div className={styles.inputWrapper}>
                                            <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ef4444' }}><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                                            <input
                                                className={styles.input}
                                                placeholder="Cons (e.g. Low clearance)"
                                                value={formData.shortlist1.whyNot}
                                                onChange={e => handleShortlistChange('shortlist1', 'whyNot', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Comments</label>
                                    <div className={styles.inputWrapper}>
                                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ top: '14px' }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                        <textarea
                                            className={styles.textarea}
                                            placeholder="Any specific doubts?"
                                            value={formData.shortlist1.comments}
                                            onChange={e => handleShortlistChange('shortlist1', 'comments', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shortlist 2 */}
                            <div className={styles.shortlistCard}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.numberBadge}>2</span>
                                    <span>Second Choice</span>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Car Name</label>
                                    <div className={styles.inputWrapper}>
                                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle><path d="M5 17h12"></path></svg>
                                        <input
                                            className={styles.input}
                                            placeholder="e.g. Nexon"
                                            value={formData.shortlist2.product}
                                            onChange={e => handleShortlistChange('shortlist2', 'product', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className={styles.gridTwoCol}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Pros</label>
                                        <div className={styles.inputWrapper}>
                                            <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#16a34a' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                            <input
                                                className={styles.input}
                                                placeholder="Pros (e.g. Good mileage)"
                                                value={formData.shortlist2.whyThis}
                                                onChange={e => handleShortlistChange('shortlist2', 'whyThis', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Cons</label>
                                        <div className={styles.inputWrapper}>
                                            <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ef4444' }}><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                                            <input
                                                className={styles.input}
                                                placeholder="Cons (e.g. Low clearance)"
                                                value={formData.shortlist2.whyNot}
                                                onChange={e => handleShortlistChange('shortlist2', 'whyNot', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Comments</label>
                                    <div className={styles.inputWrapper}>
                                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ top: '14px' }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                        <textarea
                                            className={styles.textarea}
                                            placeholder="Any specific doubts?"
                                            value={formData.shortlist2.comments}
                                            onChange={e => handleShortlistChange('shortlist2', 'comments', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shortlist 3 */}
                            <div className={styles.shortlistCard}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.numberBadge}>3</span>
                                    <span>Third Choice</span>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Car Name</label>
                                    <div className={styles.inputWrapper}>
                                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle><path d="M5 17h12"></path></svg>
                                        <input
                                            className={styles.input}
                                            placeholder="e.g. Seltos"
                                            value={formData.shortlist3.product}
                                            onChange={e => handleShortlistChange('shortlist3', 'product', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className={styles.gridTwoCol}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Pros</label>
                                        <div className={styles.inputWrapper}>
                                            <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#16a34a' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                            <input
                                                className={styles.input}
                                                placeholder="Pros (e.g. Good mileage)"
                                                value={formData.shortlist3.whyThis}
                                                onChange={e => handleShortlistChange('shortlist3', 'whyThis', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Cons</label>
                                        <div className={styles.inputWrapper}>
                                            <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ef4444' }}><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                                            <input
                                                className={styles.input}
                                                placeholder="Cons (e.g. Low clearance)"
                                                value={formData.shortlist3.whyNot}
                                                onChange={e => handleShortlistChange('shortlist3', 'whyNot', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Comments</label>
                                    <div className={styles.inputWrapper}>
                                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ top: '14px' }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                        <textarea
                                            className={styles.textarea}
                                            placeholder="Any specific doubts?"
                                            value={formData.shortlist3.comments}
                                            onChange={e => handleShortlistChange('shortlist3', 'comments', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    {step > 1 && (
                        <button onClick={handleBack} className={styles.backBtn}>Back</button>
                    )}
                    {step < 3 ? (
                        <button onClick={handleNext} className={styles.nextBtn}>
                            Next Step
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </button>
                    ) : (
                        <button onClick={handleSubmit} className={styles.submitBtn}>
                            See Plans & Pricing
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
