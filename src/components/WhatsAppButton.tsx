'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './WhatsAppButton.module.css';

export default function WhatsAppButton() {
    const [isVisible, setIsVisible] = useState(true);
    const [position, setPosition] = useState({ x: 30, y: 30 }); // Initial bottom-right offset
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const buttonStartPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // Ensure code runs only on client
        if (typeof window !== 'undefined') {
            const handleMouseMove = (e: MouseEvent) => {
                if (!isDragging) return;
                const dx = e.clientX - dragStartPos.current.x;
                const dy = e.clientY - dragStartPos.current.y;
                setPosition({
                    x: buttonStartPos.current.x - dx,
                    y: buttonStartPos.current.y - dy,
                });
            };

            const handleMouseUp = () => {
                setIsDragging(false);
            };

            const handleTouchMove = (e: TouchEvent) => {
                if (!isDragging) return;
                const touch = e.touches[0];
                const dx = touch.clientX - dragStartPos.current.x;
                const dy = touch.clientY - dragStartPos.current.y;
                setPosition({
                    x: buttonStartPos.current.x - dx,
                    y: buttonStartPos.current.y - dy,
                });
            };

            if (isDragging) {
                window.addEventListener('mousemove', handleMouseMove);
                window.addEventListener('mouseup', handleMouseUp);
                window.addEventListener('touchmove', handleTouchMove, { passive: false });
                window.addEventListener('touchend', handleMouseUp);
            }

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
                window.removeEventListener('touchmove', handleTouchMove);
                window.removeEventListener('touchend', handleMouseUp);
            };
        }
    }, [isDragging]);

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        // Prevent drag if closing
        if ((e.target as HTMLElement).closest(`.${styles.closeBtn}`)) return;

        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        dragStartPos.current = { x: clientX, y: clientY };
        buttonStartPos.current = { x: position.x, y: position.y };
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsVisible(false);
    };

    const handleClick = (e: React.MouseEvent) => {
        // If we dragged more than a tiny bit, prevent click (it was a drag action)
        if (isDragging) {
            e.preventDefault();
        }
    };

    if (!isVisible) return null;

    return (
        <div
            className={`${styles.container} ${isDragging ? styles.isDragging : ''}`}
            style={{
                bottom: `${position.y}px`,
                right: `${position.x}px`
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
        >
            <div className={styles.closeBtn} onClick={handleClose} title="Close">
                ✕
            </div>

            <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappBtn}
                onClick={handleClick}
                aria-label="Chat with us on WhatsApp"
            >
                {/* Official WhatsApp Logo Path */}
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.58 20.16 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.71 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16ZM16.57 14.26C16.32 14.14 15.1 13.54 14.88 13.45C14.66 13.37 14.49 13.32 14.33 13.57C14.16 13.82 13.69 14.37 13.54 14.54C13.39 14.71 13.25 14.73 13 14.61C12.75 14.48 11.95 14.22 11 13.37C10.26 12.71 9.77 11.9 9.64 11.67C9.52 11.45 9.63 11.33 9.76 11.2C9.87 11.09 10 10.92 10.12 10.77C10.24 10.62 10.29 10.52 10.37 10.37C10.45 10.22 10.41 10.09 10.34 9.97C10.28 9.84 9.81 8.7 9.61 8.24C9.42 7.79 9.22 7.85 9.07 7.85C8.93 7.84 8.77 7.84 8.61 7.84C8.44 7.84 8.17 7.9 7.95 8.14C7.72 8.38 7.09 8.97 7.09 10.17C7.09 11.38 7.97 12.54 8.09 12.71C8.22 12.87 9.82 15.34 12.27 16.4C12.85 16.65 13.31 16.8 13.67 16.91C14.25 17.1 14.78 17.07 15.2 17.01C15.67 16.94 16.64 16.42 16.84 15.85C17.04 15.28 17.04 14.79 16.98 14.69C16.92 14.59 16.77 14.53 16.57 14.41V14.26Z" />
                </svg>
            </a>
        </div>
    );
}
