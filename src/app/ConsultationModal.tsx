'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Added for navigation
import styles from './ConsultationModal.module.css';

interface ShortlistedCar {
    id: number;
    name: string;
    whyThis: string;
    whyNot: string;
    comments: string;
}

interface FormData {
    budget: string;
    familySize: string;
    priorities: string[];
    shortlistedCars: ShortlistedCar[];
}

interface ConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
    const router = useRouter(); // Initialize router
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        budget: '',
        familySize: '',
        priorities: [],
        shortlistedCars: [{ id: 1, name: '', whyThis: '', whyNot: '', comments: '' }]
    });

    // Intro texts for each step
    const introTexts = [
        "Let's start with your budget to find the best value.",
        "Knowing your family size helps us recommend space & safety.",
        "What matters most to you in a car?",
        "Tell us about the cars you are currently considering."
    ];

    if (!isOpen) return null;

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // For now, just close. In real app, submit data.
        console.log("Submitted Data:", formData);

        // Redirect to Plans page
        router.push('/plans');

        onClose();
    };

    const handleChipSelect = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePriorityToggle = (priority: string) => {
        setFormData(prev => {
            const current = prev.priorities;
            if (current.includes(priority)) {
                return { ...prev, priorities: current.filter(p => p !== priority) };
            }
            if (current.length >= 3) return prev; // Max 3
            return { ...prev, priorities: [...current, priority] };
        });
    };

    // Car Management
    const handleCarChange = (id: number, field: keyof ShortlistedCar, value: string) => {
        setFormData(prev => ({
            ...prev,
            shortlistedCars: prev.shortlistedCars.map(car =>
                car.id === id ? { ...car, [field]: value } : car
            )
        }));
    };

    const addCar = () => {
        if (formData.shortlistedCars.length >= 3) return;
        setFormData(prev => ({
            ...prev,
            shortlistedCars: [
                ...prev.shortlistedCars,
                { id: Date.now(), name: '', whyThis: '', whyNot: '', comments: '' }
            ]
        }));
    };

    const removeCar = (id: number) => {
        setFormData(prev => ({
            ...prev,
            shortlistedCars: prev.shortlistedCars.filter(car => car.id !== id)
        }));
    };

    const budgetOptions = ['Under 10 Lakhs', '10-15 Lakhs', '15-20 Lakhs', '20-30 Lakhs', '30 Lakhs+', 'Flexible'];
    const familyOptions = ['1-2 People', '3-4 People', '5+ People', 'Pet Friendly Needed'];
    const priorityOptions = ['Safety', 'Mileage', 'Performance', 'Comfort', 'Features', 'Resale Value', 'Brand Image', 'After Sales'];

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button onClick={onClose} className={styles.closeBtn}>&times;</button>

                <div className={styles.header}>
                    <h2 className={styles.title}>Let's find your perfect car</h2>
                    <p className={styles.subtitle}>{introTexts[step - 1]}</p>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${(step / 4) * 100}%` }}
                        />
                    </div>
                </div>

                <div className={styles.content}>
                    {step === 1 && (
                        <div>
                            <h3 className={styles.stepTitle}>What is your budget?</h3>
                            <div className={styles.chipGrid}>
                                {budgetOptions.map(opt => (
                                    <div
                                        key={opt}
                                        className={`${styles.chip} ${formData.budget === opt ? styles.chipSelected : ''}`}
                                        onClick={() => handleChipSelect('budget', opt)}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h3 className={styles.stepTitle}>Family Size & Usage</h3>
                            <div className={styles.chipGrid}>
                                {familyOptions.map(opt => (
                                    <div
                                        key={opt}
                                        className={`${styles.chip} ${formData.familySize === opt ? styles.chipSelected : ''}`}
                                        onClick={() => handleChipSelect('familySize', opt)}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h3 className={styles.stepTitle}>Top Priorities (Pick 3)</h3>
                            <div className={styles.chipGrid}>
                                {priorityOptions.map(opt => (
                                    <div
                                        key={opt}
                                        className={`${styles.chip} ${formData.priorities.includes(opt) ? styles.chipSelected : ''}`}
                                        onClick={() => handlePriorityToggle(opt)}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <h3 className={styles.stepTitle}>Shortlisted Cars</h3>
                            <p className={styles.stepDesc}>Add up to 3 cars you are considering.</p>

                            {formData.shortlistedCars.map((car, index) => (
                                <div key={car.id} className={styles.carCard}>
                                    <div className={styles.carCardHeader}>
                                        <span className={styles.carCardTitle}>Car {index + 1}</span>
                                        {formData.shortlistedCars.length > 1 && (
                                            <button type="button" onClick={() => removeCar(car.id)} className={styles.removeBtn}>Remove</button>
                                        )}
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <input
                                            placeholder="Car Name (e.g. Creta SX)"
                                            value={car.name}
                                            onChange={(e) => handleCarChange(car.id, 'name', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}

                            {formData.shortlistedCars.length < 3 && (
                                <button type="button" onClick={addCar} className={styles.addCarBtn}>
                                    + Add Another Car
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    {step > 1 && (
                        <button onClick={handleBack} className={styles.backBtn}>Back</button>
                    )}
                    {step < 4 ? (
                        <button onClick={handleNext} className={styles.nextBtn}>Next</button>
                    ) : (
                        <button onClick={handleSubmit} className={styles.submitBtn}>
                            See Plans & Pricing
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
