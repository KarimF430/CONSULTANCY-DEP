'use client';

import { useState, useMemo } from 'react';
import styles from './SlotPicker.module.css';

interface SlotPickerProps {
    selectedSlot: { date: string; time: string } | null;
    onSelectSlot: (slot: { date: string; time: string }) => void;
}

// Generate next 7 days
const generateDates = () => {
    const dates = [];
    const today = new Date();
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push({
            date: date.toISOString().split('T')[0],
            day: i === 0 ? 'TODAY' : i === 1 ? 'TOMORROW' : dayNames[date.getDay()],
            dayNum: date.getDate(),
            slotsCount: Math.floor(Math.random() * 10) + 8, // 8-17 slots per day
        });
    }
    return dates;
};

// Generate time slots
const timeSlots = {
    morning: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
    afternoon: ['12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'],
    evening: ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM'],
};

export default function SlotPicker({ selectedSlot, onSelectSlot }: SlotPickerProps) {
    const dates = useMemo(() => generateDates(), []);
    const [selectedDate, setSelectedDate] = useState(dates[0].date);

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
    };

    const handleTimeSelect = (time: string) => {
        onSelectSlot({ date: selectedDate, time });
    };

    const isTimeSelected = (time: string) => {
        return selectedSlot?.date === selectedDate && selectedSlot?.time === time;
    };

    // Simulate some unavailable slots (random for demo)
    const isSlotUnavailable = (time: string) => {
        const hash = time.charCodeAt(0) + selectedDate.charCodeAt(selectedDate.length - 1);
        return hash % 7 === 0;
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h3 className={styles.title}>Availability</h3>
                <div className={styles.timezone}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    <span>Asia/Kolkata</span>
                </div>
            </div>

            {/* Date Picker Strip */}
            <div className={styles.dateStrip}>
                {dates.map((d) => (
                    <button
                        key={d.date}
                        onClick={() => handleDateSelect(d.date)}
                        className={`${styles.dateCard} ${selectedDate === d.date ? styles.dateCardActive : ''}`}
                    >
                        <span className={styles.dayLabel}>{d.day}</span>
                        <span className={styles.dayNum}>{d.dayNum}</span>
                        <span className={styles.slotsLabel}>{d.slotsCount} slots</span>
                    </button>
                ))}
            </div>

            {/* Time Slots */}
            <div className={styles.slotsContainer}>
                <h4 className={styles.slotGroupTitle}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="5" />
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                    Morning
                </h4>
                <div className={styles.slotsGrid}>
                    {timeSlots.morning.map((time) => (
                        <button
                            key={time}
                            onClick={() => !isSlotUnavailable(time) && handleTimeSelect(time)}
                            disabled={isSlotUnavailable(time)}
                            className={`${styles.slotBtn} ${isTimeSelected(time) ? styles.slotBtnActive : ''} ${isSlotUnavailable(time) ? styles.slotBtnDisabled : ''}`}
                        >
                            {time}
                        </button>
                    ))}
                </div>

                <h4 className={styles.slotGroupTitle}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="5" />
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2" />
                    </svg>
                    Afternoon
                </h4>
                <div className={styles.slotsGrid}>
                    {timeSlots.afternoon.map((time) => (
                        <button
                            key={time}
                            onClick={() => !isSlotUnavailable(time) && handleTimeSelect(time)}
                            disabled={isSlotUnavailable(time)}
                            className={`${styles.slotBtn} ${isTimeSelected(time) ? styles.slotBtnActive : ''} ${isSlotUnavailable(time) ? styles.slotBtnDisabled : ''}`}
                        >
                            {time}
                        </button>
                    ))}
                </div>

                <h4 className={styles.slotGroupTitle}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                    Evening
                </h4>
                <div className={styles.slotsGrid}>
                    {timeSlots.evening.map((time) => (
                        <button
                            key={time}
                            onClick={() => !isSlotUnavailable(time) && handleTimeSelect(time)}
                            disabled={isSlotUnavailable(time)}
                            className={`${styles.slotBtn} ${isTimeSelected(time) ? styles.slotBtnActive : ''} ${isSlotUnavailable(time) ? styles.slotBtnDisabled : ''}`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>

            {/* Info */}
            <p className={styles.infoText}>
                A consultation with our expert generally takes 15-30 minutes.
            </p>
        </div>
    );
}
