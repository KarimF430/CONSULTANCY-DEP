'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './product.module.css';
import Footer from '@/components/Footer';

// Product data for Nano Ceramic Coating
const product = {
    id: 3,
    name: 'Nano Ceramic Coating',
    fullName: 'Nano Ceramic Coating for Car & Bike | 250ml | Easy-to-Apply DIY Spray | High Gloss Finish with UV & Water Repellent Shield',
    shortDesc: 'Professional-grade ceramic coating with mirror finish',
    price: 599,
    originalPrice: 799,
    rating: 4.5,
    reviews: 189,
    bought: '100+',
    inStock: true,
    images: [
        '/products/ceramic-coating-1.png',
        '/products/ceramic-coating-2.png',
        '/products/ceramic-coating-3.png',
        '/products/ceramic-coating-4.png',
    ],
    highlights: [
        'Instant shine with easy spray application',
        'UV protection that lasts up to 5 washes',
        'Water-repellent hydrophobic coating',
        'Safe for all paint & chrome surfaces'
    ],
    features: [
        { icon: 'spray', title: 'Easy Application', desc: 'Spray, spread, and wipe for instant results' },
        { icon: 'shield', title: 'UV Protection', desc: 'Shields paint from harmful sun rays' },
        { icon: 'droplet', title: 'Hydrophobic', desc: 'Water beads off instantly' },
        { icon: 'clock', title: 'Long Lasting', desc: 'Protection lasts 5+ washes' }
    ],
    howToUse: [
        { step: 1, title: 'Clean Surface', desc: 'Ensure the car surface is clean and dry' },
        { step: 2, title: 'Shake Well', desc: 'Shake the bottle thoroughly before use' },
        { step: 3, title: 'Spray Evenly', desc: 'Spray product evenly on one panel at a time' },
        { step: 4, title: 'Wait 1 Min', desc: 'Let it sit for about a minute' },
        { step: 5, title: 'Wipe Off', desc: 'Buff with clean microfiber cloth in circular motions' }
    ],
    specs: {
        'Volume': '250ml',
        'Type': 'Spray',
        'Suitable For': 'Cars & Bikes',
        'Surfaces': 'Paint, Chrome',
        'Protection': 'Up to 5 washes',
        'Origin': 'Made in India'
    }
};

// Initial reviews
const initialReviews = [
    { id: 1, name: 'Amit K.', rating: 5, verified: true, date: '2 weeks ago', title: 'Amazing shine!', text: 'Applied on my Honda City - the shine is incredible. Easy to apply, worth every rupee!', helpful: 24 },
    { id: 2, name: 'Priya S.', rating: 5, verified: true, date: '1 month ago', title: 'Best ceramic coating', text: 'Finally a product that delivers. My car looks showroom fresh!', helpful: 18 },
    { id: 3, name: 'Rahul M.', rating: 4, verified: true, date: '1 month ago', title: 'Good value', text: 'Nice shine and easy to use. Water beading effect is clearly visible.', helpful: 12 },
];

const suggestions = [
    { id: 5, name: 'Snow Foam Shampoo', price: 449, rating: 4.9 },
    { id: 2, name: 'Tyre Shiner', price: 299, rating: 4.7 },
    { id: 4, name: 'Plastic Restorer', price: 349, rating: 4.4 },
];

export default function ProductDetailPage() {
    const [currentImage, setCurrentImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const galleryRef = useRef<HTMLDivElement>(null);

    // Review system state
    const [reviews, setReviews] = useState(initialReviews);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewName, setReviewName] = useState('');
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    const discount = Math.round((1 - product.price / product.originalPrice) * 100);

    const handleAddToCart = () => {
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2500);
    };

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const handleSubmitReview = () => {
        if (reviewRating === 0 || !reviewName.trim() || !reviewTitle.trim() || !reviewText.trim()) {
            return;
        }
        const newReview = {
            id: reviews.length + 1,
            name: reviewName,
            rating: reviewRating,
            verified: false,
            date: 'Just now',
            title: reviewTitle,
            text: reviewText,
            helpful: 0
        };
        setReviews([newReview, ...reviews]);
        setShowReviewModal(false);
        setReviewRating(0);
        setReviewName('');
        setReviewTitle('');
        setReviewText('');
    };

    const handleTouchScroll = () => {
        if (galleryRef.current) {
            const scrollPos = galleryRef.current.scrollLeft;
            const imageWidth = galleryRef.current.offsetWidth;
            const newIndex = Math.round(scrollPos / imageWidth);
            setCurrentImage(newIndex);
        }
    };

    const Stars = ({ rating }: { rating: number }) => (
        <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={star <= rating ? styles.starFilled : styles.starEmpty}>★</span>
            ))}
        </div>
    );

    // SVG Icon components
    const FeatureIcon = ({ type }: { type: string }) => {
        switch (type) {
            case 'spray':
                return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v2M12 8V6M12 10a2 2 0 100-4 2 2 0 000 4z" /><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><path d="M8 12l4-2 4 2" /></svg>;
            case 'shield':
                return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
            case 'droplet':
                return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /></svg>;
            case 'clock':
                return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>;
            default:
                return null;
        }
    };

    const TruckIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" />
            <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
    );

    const ReturnIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" /><path d="M3 3v5h5" />
        </svg>
    );

    const VerifiedIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 12l2 2 4-4" /><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        </svg>
    );

    const ThumbsUpIcon = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
        </svg>
    );

    return (
        <div className={styles.page}>
            {/* Desktop Breadcrumb */}
            <nav className={styles.breadcrumb}>
                <Link href="/">Home</Link>
                <span>/</span>
                <Link href="/products">Products</Link>
                <span>/</span>
                <span>{product.name}</span>
            </nav>

            <main className={styles.main}>
                {/* Product Hero Section */}
                <section className={styles.productHero}>
                    {/* Image Gallery */}
                    <div className={styles.gallery}>
                        <div
                            className={styles.imageCarousel}
                            ref={galleryRef}
                            onScroll={handleTouchScroll}
                        >
                            {product.images.map((img, idx) => (
                                <div key={idx} className={styles.carouselSlide}>
                                    <Image
                                        src={img}
                                        alt={`${product.name} - View ${idx + 1}`}
                                        fill
                                        className={styles.productImg}
                                        priority={idx === 0}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Discount Badge */}
                        <div className={styles.discountTag}>{discount}% OFF</div>

                        {/* Image Dots */}
                        <div className={styles.imageDots}>
                            {product.images.map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`${styles.dot} ${currentImage === idx ? styles.dotActive : ''}`}
                                    onClick={() => setCurrentImage(idx)}
                                />
                            ))}
                        </div>

                        {/* Desktop Thumbnails */}
                        <div className={styles.thumbnails}>
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    className={`${styles.thumb} ${currentImage === idx ? styles.thumbActive : ''}`}
                                    onClick={() => setCurrentImage(idx)}
                                >
                                    <Image src={img} alt="" width={72} height={72} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className={styles.productInfo}>
                        {/* Product Name */}
                        <h1 className={styles.productName}>{product.name}</h1>

                        {/* Title */}
                        <p className={styles.title}>{product.fullName}</p>

                        {/* Rating */}
                        <div className={styles.ratingBar}>
                            <div className={styles.ratingBadge}>
                                <span>{product.rating}</span>
                                <Stars rating={Math.floor(product.rating)} />
                            </div>
                            <span className={styles.ratingCount}>{product.reviews} Ratings</span>
                            <span className={styles.boughtBadge}>{product.bought} bought recently</span>
                        </div>

                        {/* Price */}
                        <div className={styles.priceSection}>
                            <div className={styles.priceMain}>
                                <span className={styles.discountLabel}>-{discount}%</span>
                                <span className={styles.currentPrice}>₹{product.price}</span>
                            </div>
                            <div className={styles.priceSecondary}>
                                M.R.P: <span className={styles.strikePrice}>₹{product.originalPrice}</span>
                                <span className={styles.taxInfo}>Inclusive of all taxes</span>
                            </div>
                        </div>

                        {/* Add to Cart - Right after pricing */}
                        <div className={styles.cartSection}>
                            <div className={styles.qtySelector}>
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                            <button
                                className={`${styles.addToCartBtn} ${addedToCart ? styles.added : ''}`}
                                onClick={handleAddToCart}
                            >
                                {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className={styles.trustBadges}>
                            <div className={styles.trustItem}>
                                <span className={styles.trustIcon}><TruckIcon /></span>
                                <div>
                                    <strong>Free Delivery</strong>
                                    <p>Orders above ₹499</p>
                                </div>
                            </div>
                            <div className={styles.trustItem}>
                                <span className={styles.trustIcon}><ReturnIcon /></span>
                                <div>
                                    <strong>Easy Returns</strong>
                                    <p>7 day policy</p>
                                </div>
                            </div>
                            <div className={styles.trustItem}>
                                <span className={styles.trustIcon}><VerifiedIcon /></span>
                                <div>
                                    <strong>Genuine Product</strong>
                                    <p>100% authentic</p>
                                </div>
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className={styles.highlights}>
                            <h3>Highlights</h3>
                            <ul>
                                {product.highlights.map((h, i) => (
                                    <li key={i}>
                                        <span className={styles.checkIcon}>✓</span>
                                        {h}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className={styles.featuresSection}>
                    <h2>Why Choose This Product</h2>
                    <div className={styles.featuresGrid}>
                        {product.features.map((f, i) => (
                            <div key={i} className={styles.featureCard}>
                                <span className={styles.featureIcon}><FeatureIcon type={f.icon} /></span>
                                <h4>{f.title}</h4>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Collapsible Sections */}
                <section className={styles.detailSections}>
                    {/* How to Use */}
                    <div className={styles.collapsible}>
                        <button
                            className={styles.collapsibleHeader}
                            onClick={() => toggleSection('howto')}
                        >
                            <span>How to Use</span>
                            <svg className={activeSection === 'howto' ? styles.rotated : ''} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6,9 12,15 18,9" />
                            </svg>
                        </button>
                        <div className={`${styles.collapsibleContent} ${activeSection === 'howto' ? styles.open : ''}`}>
                            <div className={styles.stepsGrid}>
                                {product.howToUse.map((s) => (
                                    <div key={s.step} className={styles.stepCard}>
                                        <span className={styles.stepNum}>{s.step}</span>
                                        <div>
                                            <h5>{s.title}</h5>
                                            <p>{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className={styles.collapsible}>
                        <button
                            className={styles.collapsibleHeader}
                            onClick={() => toggleSection('specs')}
                        >
                            <span>Specifications</span>
                            <svg className={activeSection === 'specs' ? styles.rotated : ''} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6,9 12,15 18,9" />
                            </svg>
                        </button>
                        <div className={`${styles.collapsibleContent} ${activeSection === 'specs' ? styles.open : ''}`}>
                            <div className={styles.specsGrid}>
                                {Object.entries(product.specs).map(([key, val]) => (
                                    <div key={key} className={styles.specItem}>
                                        <span className={styles.specLabel}>{key}</span>
                                        <span className={styles.specValue}>{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Reviews */}
                <section className={styles.reviewsSection}>
                    <div className={styles.reviewsHeader}>
                        <h2>Customer Reviews</h2>
                        <div className={styles.overallRating}>
                            <span className={styles.bigNum}>{product.rating}</span>
                            <div>
                                <Stars rating={Math.floor(product.rating)} />
                                <p>{reviews.length} reviews</p>
                            </div>
                        </div>
                    </div>

                    {/* Write Review Button */}
                    <button
                        className={styles.writeReviewBtn}
                        onClick={() => setShowReviewModal(true)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Write a Review
                    </button>

                    <div className={styles.reviewsList}>
                        {reviews.map((r) => (
                            <div key={r.id} className={styles.reviewCard}>
                                <div className={styles.reviewTop}>
                                    <div className={styles.reviewerInfo}>
                                        <span className={styles.reviewerAvatar}>{r.name[0]}</span>
                                        <div>
                                            <span className={styles.reviewerName}>{r.name}</span>
                                            {r.verified && <span className={styles.verifiedBadge}>✓ Verified</span>}
                                        </div>
                                    </div>
                                    <span className={styles.reviewDate}>{r.date}</span>
                                </div>
                                <Stars rating={r.rating} />
                                <h4>{r.title}</h4>
                                <p>{r.text}</p>
                                <button className={styles.helpfulBtn}><ThumbsUpIcon /> Helpful ({r.helpful})</button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Suggestions */}
                <section className={styles.suggestionsSection}>
                    <h2>Frequently Bought Together</h2>
                    <div className={styles.suggestionsScroll}>
                        {suggestions.map((s) => (
                            <Link key={s.id} href={`/products/${s.id}`} className={styles.suggestionCard}>
                                <div className={styles.suggestionImg}>
                                    <span>{s.name}</span>
                                </div>
                                <div className={styles.suggestionInfo}>
                                    <h4>{s.name}</h4>
                                    <div className={styles.suggestionMeta}>
                                        <span className={styles.suggestionPrice}>₹{s.price}</span>
                                        <span className={styles.suggestionRating}>★ {s.rating}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>

            {/* Review Modal */}
            {showReviewModal && (
                <div className={styles.modalOverlay} onClick={() => setShowReviewModal(false)}>
                    <div className={styles.reviewModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Write a Review</h3>
                            <button
                                className={styles.closeModalBtn}
                                onClick={() => setShowReviewModal(false)}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            {/* Star Rating */}
                            <div className={styles.ratingSelector}>
                                <label>Your Rating</label>
                                <div className={styles.starSelector}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className={`${styles.starBtn} ${star <= (hoverRating || reviewRating) ? styles.starActive : ''}`}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setReviewRating(star)}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <span className={styles.ratingLabel}>
                                    {reviewRating === 1 && 'Poor'}
                                    {reviewRating === 2 && 'Fair'}
                                    {reviewRating === 3 && 'Good'}
                                    {reviewRating === 4 && 'Very Good'}
                                    {reviewRating === 5 && 'Excellent'}
                                </span>
                            </div>

                            {/* Name */}
                            <div className={styles.formGroup}>
                                <label>Your Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={reviewName}
                                    onChange={(e) => setReviewName(e.target.value)}
                                />
                            </div>

                            {/* Review Title */}
                            <div className={styles.formGroup}>
                                <label>Review Title</label>
                                <input
                                    type="text"
                                    placeholder="Give your review a title"
                                    value={reviewTitle}
                                    onChange={(e) => setReviewTitle(e.target.value)}
                                />
                            </div>

                            {/* Review Text */}
                            <div className={styles.formGroup}>
                                <label>Your Review</label>
                                <textarea
                                    placeholder="Share your experience with this product..."
                                    rows={4}
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => setShowReviewModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.submitReviewBtn}
                                onClick={handleSubmitReview}
                                disabled={!reviewRating || !reviewName.trim() || !reviewTitle.trim() || !reviewText.trim()}
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
