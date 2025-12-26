'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './products.module.css';
import Footer from '@/components/Footer';

// Product data
const products = [
    {
        id: 1,
        name: 'Car Rat Protect',
        description: 'Protects wiring and cables from rat damage. Safe, effective, and long-lasting protection for your car.',
        price: 349,
        originalPrice: 499,
        rating: 4.5,
        reviews: 234,
        badge: 'Best Seller'
    },
    {
        id: 2,
        name: 'Foaming Tyre Shiner',
        description: 'Long-lasting shine for your tyres with easy spray application. No mess, no residue.',
        price: 299,
        originalPrice: 399,
        rating: 4.7,
        reviews: 567,
        badge: null
    },
    {
        id: 3,
        name: 'Nano Ceramic Coating',
        description: 'Premium protection with mirror finish. UV protection and water-repellent shield.',
        price: 599,
        originalPrice: 799,
        rating: 4.8,
        reviews: 189,
        badge: 'Premium'
    },
    {
        id: 4,
        name: 'Plastic & Rubber Restorer',
        description: 'Restores faded plastics to new. Brings back original color and shine.',
        price: 349,
        originalPrice: 449,
        rating: 4.4,
        reviews: 321,
        badge: null
    },
    {
        id: 5,
        name: 'Snow Foam Car Shampoo',
        description: 'Rich foam for deep cleaning. pH neutral and safe for all paint types.',
        price: 449,
        originalPrice: 599,
        rating: 4.9,
        reviews: 892,
        badge: 'Top Rated'
    },
    {
        id: 6,
        name: 'Interior Cleaner',
        description: 'Foaming cleaner for all interior surfaces. Removes tough stains and odors.',
        price: 379,
        originalPrice: 499,
        rating: 4.6,
        reviews: 445,
        badge: null
    },
    {
        id: 7,
        name: 'Air Refresher & Sanitizer',
        description: 'Kills 99.9% germs and refreshes cabin air. Long-lasting fresh fragrance.',
        price: 299,
        originalPrice: 399,
        rating: 4.5,
        reviews: 678,
        badge: null
    },
    {
        id: 8,
        name: 'Dashboard Polish',
        description: 'UV protection with matte finish. Prevents cracking and fading.',
        price: 329,
        originalPrice: 449,
        rating: 4.6,
        reviews: 234,
        badge: null
    }
];

const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'cleaning', name: 'Cleaning' },
    { id: 'protection', name: 'Protection' },
    { id: 'exterior', name: 'Exterior' },
    { id: 'interior', name: 'Interior' }
];

export default function ProductsPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [addedToCart, setAddedToCart] = useState<number[]>([]);

    const handleAddToCart = (e: React.MouseEvent, productId: number) => {
        e.preventDefault();
        e.stopPropagation();
        setAddedToCart(prev => [...prev, productId]);
        setTimeout(() => {
            setAddedToCart(prev => prev.filter(id => id !== productId));
        }, 2000);
    };

    return (
        <main className={styles.page}>
            {/* Header Section */}
            <section className={styles.header}>
                <div className={styles.headerContent}>
                    <span className={styles.sectionTag}>Products</span>
                    <h1 className={styles.pageTitle}>
                        Our Car Care <span className={styles.highlight}>Products</span>
                    </h1>
                    <p className={styles.pageSubtitle}>
                        Premium car care products trusted by 10,000+ customers
                    </p>
                </div>
            </section>

            {/* Category Filter Pills */}
            <section className={styles.filterSection}>
                <div className={styles.filterContainer}>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`${styles.filterPill} ${selectedCategory === cat.id ? styles.filterActive : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* Products Grid */}
            <section className={styles.productsSection}>
                <div className={styles.productsContainer}>
                    <div className={styles.productsGrid}>
                        {products.map(product => (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                                className={styles.productCard}
                            >
                                {product.badge && (
                                    <span className={`${styles.badge} ${product.badge === 'Premium' ? styles.badgePremium : ''}`}>
                                        {product.badge}
                                    </span>
                                )}

                                {/* Product Image */}
                                <div className={styles.productImage}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <path d="m21 15-5-5L5 21" />
                                    </svg>
                                </div>

                                {/* Product Name */}
                                <h3 className={styles.productName}>{product.name}</h3>

                                {/* Rating */}
                                <div className={styles.ratingRow}>
                                    <span className={styles.ratingBadge}>★ {product.rating}</span>
                                    <span className={styles.reviewCount}>({product.reviews} reviews)</span>
                                </div>

                                {/* Description */}
                                <p className={styles.productDesc}>{product.description}</p>

                                {/* Price */}
                                <div className={styles.priceRow}>
                                    <span className={styles.price}>₹{product.price}</span>
                                    <span className={styles.originalPrice}>₹{product.originalPrice}</span>
                                    <span className={styles.discount}>
                                        {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                                    </span>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    className={`${styles.btnPrimary} ${addedToCart.includes(product.id) ? styles.added : ''}`}
                                    onClick={(e) => handleAddToCart(e, product.id)}
                                >
                                    {addedToCart.includes(product.id) ? '✓ Added to Cart' : 'Add to Cart'}
                                </button>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
