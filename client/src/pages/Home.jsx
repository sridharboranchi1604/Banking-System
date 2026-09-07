import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import yesBankLogo from "../assets/yesbank-logo.png";
import heroImage from "../assets/hero.png";

function Home() {
    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [openMenu, setOpenMenu] = useState(null);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    // =====================================================
    // HERO SLIDES
    // =====================================================

    const slides = [
        {
            tag: "DIGITAL BANKING",
            title: "Banking made",
            highlight: "simple & secure.",
            description:
                "Experience simple, smart and secure banking designed around your everyday financial needs.",
            button: "Login to Banking",
        },

        {
            tag: "SMART BANKING",
            title: "Everything you need",
            highlight: "in one place.",
            description:
                "Check your balance, manage payees, transfer money and track your transactions with ease.",
            button: "Explore Banking",
        },

        {
            tag: "EASY TRANSFERS",
            title: "Send money",
            highlight: "with confidence.",
            description:
                "Transfer money securely to your registered payees through your digital banking account.",
            button: "Transfer Money",
        },

        {
            tag: "SECURE BANKING",
            title: "Your money.",
            highlight: "Your control.",
            description:
                "Stay connected with your account and keep track of every transaction from one secure dashboard.",
            button: "Access Account",
        },
    ];

    // =====================================================
    // AUTOMATIC CAROUSEL
    // =====================================================

    useEffect(() => {
        const slider = setInterval(() => {
            setCurrentSlide((previousSlide) => {
                return (previousSlide + 1) % slides.length;
            });
        }, 5000);

        return () => clearInterval(slider);
    }, [slides.length]);

    // =====================================================
    // CAROUSEL CONTROLS
    // =====================================================

    const nextSlide = () => {
        setCurrentSlide((previousSlide) => {
            return (previousSlide + 1) % slides.length;
        });
    };

    const previousSlide = () => {
        setCurrentSlide((previousSlide) => {
            return (
                (previousSlide - 1 + slides.length) %
                slides.length
            );
        });
    };

    // =====================================================
    // MENU CONTROL
    // =====================================================

    const toggleMenu = (menuName) => {
        setOpenMenu(
            openMenu === menuName ? null : menuName
        );
    };

    // =====================================================
    // CLOSE MENUS
    // =====================================================

    const closeMenus = () => {
        setOpenMenu(null);
    };

    // =====================================================
    // NAVIGATION
    // =====================================================

    const goToLogin = () => {
        closeMenus();
        setMobileMenu(false);
        navigate("/login");
    };

    const goToRegister = () => {
        closeMenus();
        setMobileMenu(false);
        navigate("/register");
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            className="home-page"
            onClick={() => {
                if (openMenu) {
                    setOpenMenu(null);
                }
            }}
        >

            {/* =================================================
          TOP ACCESSIBILITY BAR
      ================================================= */}

            <div className="top-bar">

                <div className="top-bar-left">
                    <span>
                        Skip to Main Content
                    </span>
                </div>

                <div className="accessibility-options">

                    <button type="button">
                        A-
                    </button>

                    <button type="button">
                        A
                    </button>

                    <button type="button">
                        A+
                    </button>

                    <button
                        type="button"
                        className="theme-button"
                    >
                        A
                    </button>

                    <button
                        type="button"
                        className="dark-button"
                    >
                        A
                    </button>

                </div>

            </div>


            {/* =================================================
          MAIN HEADER
      ================================================= */}

            <header className="main-header">

                <div className="header-container">

                    {/* LOGO */}

                    <div
                        className="home-logo"
                        onClick={() => navigate("/")}
                    >
                        <img
                            src={yesBankLogo}
                            alt="YES BANK"
                        />
                    </div>


                    {/* DESKTOP MAIN NAVIGATION */}

                    <nav className="main-navigation">

                        <button
                            type="button"
                            className="main-nav-active"
                        >
                            PERSONAL
                        </button>

                        <span className="nav-divider"></span>

                        <button type="button">
                            CORPORATE
                        </button>

                        <span className="nav-divider"></span>

                        <button type="button">
                            DIGITAL
                        </button>

                        <span className="nav-divider"></span>

                        <button type="button">
                            BUSINESS
                        </button>

                        <span className="nav-divider"></span>

                        <button type="button">
                            AGRI & MICRO
                        </button>

                    </nav>


                    {/* HEADER ACTIONS */}

                    <div className="header-actions">

                        <button
                            type="button"
                            className="complaint-link"
                        >
                            LODGE A COMPLAINT
                        </button>

                        <button
                            type="button"
                            className="circle-action"
                            title="Help"
                        >
                            ?
                        </button>

                        <button
                            type="button"
                            className="circle-action"
                            title="Notifications"
                        >
                            ♧
                        </button>

                        <button
                            type="button"
                            className="header-login"
                            onClick={(event) => {
                                event.stopPropagation();
                                goToLogin();
                            }}
                        >
                            Login
                            <span>⌄</span>
                        </button>

                    </div>


                    {/* MOBILE MENU BUTTON */}

                    <button
                        type="button"
                        className="mobile-menu-button"
                        onClick={(event) => {
                            event.stopPropagation();
                            setMobileMenu(!mobileMenu);
                            setOpenMenu(null);
                        }}
                        aria-label="Open menu"
                    >
                        ☰
                    </button>

                </div>

            </header>


            {/* =================================================
          MOBILE NAVIGATION
      ================================================= */}

            {mobileMenu && (

                <div className="mobile-navigation">

                    <button
                        type="button"
                        onClick={goToLogin}
                    >
                        Login
                    </button>

                    <button type="button">
                        Personal
                    </button>

                    <button type="button">
                        Corporate
                    </button>

                    <button type="button">
                        Digital Banking
                    </button>

                    <button type="button">
                        Business
                    </button>

                    <button type="button">
                        Accounts
                    </button>

                    <button type="button">
                        Loans
                    </button>

                    <button type="button">
                        Cards
                    </button>

                    <button type="button">
                        Payments
                    </button>

                    <button type="button">
                        Investments
                    </button>

                    <button
                        type="button"
                        onClick={goToRegister}
                    >
                        Open an Account
                    </button>

                </div>

            )}


            {/* =================================================
          BLUE PRODUCT NAVIGATION
      ================================================= */}

            <nav className="product-navigation">

                <div className="product-nav-container">

                    {/* ACCOUNTS */}

                    <div className="nav-dropdown">

                        <button
                            type="button"
                            className="product-nav-button"
                            onClick={(event) => {
                                event.stopPropagation();
                                toggleMenu("accounts");
                            }}
                        >
                            Accounts
                            <span>⌄</span>
                        </button>

                        {openMenu === "accounts" && (

                            <div className="nav-dropdown-menu">

                                <div>
                                    <strong>
                                        Savings Account
                                    </strong>

                                    <span>
                                        Simple everyday banking
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        Current Account
                                    </strong>

                                    <span>
                                        Banking for businesses
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        Salary Account
                                    </strong>

                                    <span>
                                        Convenient salary banking
                                    </span>
                                </div>

                            </div>

                        )}

                    </div>


                    {/* LOANS */}

                    <div className="nav-dropdown">

                        <button
                            type="button"
                            className="product-nav-button"
                            onClick={(event) => {
                                event.stopPropagation();
                                toggleMenu("loans");
                            }}
                        >
                            Loans
                            <span>⌄</span>
                        </button>

                        {openMenu === "loans" && (

                            <div className="nav-dropdown-menu">

                                <div>
                                    <strong>
                                        Personal Loan
                                    </strong>

                                    <span>
                                        Flexible personal financing
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        Home Loan
                                    </strong>

                                    <span>
                                        Make your dream home possible
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        Vehicle Loan
                                    </strong>

                                    <span>
                                        Finance your next vehicle
                                    </span>
                                </div>

                            </div>

                        )}

                    </div>


                    {/* CARDS */}

                    <div className="nav-dropdown">

                        <button
                            type="button"
                            className="product-nav-button"
                            onClick={(event) => {
                                event.stopPropagation();
                                toggleMenu("cards");
                            }}
                        >
                            Cards
                            <span>⌄</span>
                        </button>

                        {openMenu === "cards" && (

                            <div className="nav-dropdown-menu">

                                <div>
                                    <strong>
                                        Credit Cards
                                    </strong>

                                    <span>
                                        Rewards and lifestyle benefits
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        Debit Cards
                                    </strong>

                                    <span>
                                        Secure everyday payments
                                    </span>
                                </div>

                            </div>

                        )}

                    </div>


                    {/* PAYMENTS */}

                    <div className="nav-dropdown">

                        <button
                            type="button"
                            className="product-nav-button"
                            onClick={(event) => {
                                event.stopPropagation();
                                toggleMenu("payments");
                            }}
                        >
                            Payments
                            <span>⌄</span>
                        </button>

                        {openMenu === "payments" && (

                            <div className="nav-dropdown-menu">

                                <div>
                                    <strong>
                                        Money Transfer
                                    </strong>

                                    <span>
                                        Transfer money securely
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        UPI Payments
                                    </strong>

                                    <span>
                                        Fast digital payments
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        Bill Payments
                                    </strong>

                                    <span>
                                        Pay your bills easily
                                    </span>
                                </div>

                            </div>

                        )}

                    </div>


                    {/* INVEST & INSURE */}

                    <div className="nav-dropdown">

                        <button
                            type="button"
                            className="product-nav-button"
                            onClick={(event) => {
                                event.stopPropagation();
                                toggleMenu("invest");
                            }}
                        >
                            Invest & Insure
                            <span>⌄</span>
                        </button>

                        {openMenu === "invest" && (

                            <div className="nav-dropdown-menu">

                                <div>
                                    <strong>
                                        Investments
                                    </strong>

                                    <span>
                                        Plan for your financial future
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        Insurance
                                    </strong>

                                    <span>
                                        Protect what matters to you
                                    </span>
                                </div>

                            </div>

                        )}

                    </div>


                    {/* SIMPLE NAV LINKS */}

                    <button
                        type="button"
                        className="product-nav-link"
                    >
                        NRI
                    </button>

                    <button
                        type="button"
                        className="product-nav-link"
                    >
                        Rewards & Offers
                    </button>

                    <button
                        type="button"
                        className="product-nav-link"
                    >
                        YES Premium
                    </button>

                    <button
                        type="button"
                        className="product-nav-link"
                    >
                        YES Grandeur
                    </button>

                    <button
                        type="button"
                        className="product-nav-link"
                    >
                        YES First
                    </button>

                    <button
                        type="button"
                        className="product-nav-link"
                    >
                        YES Private
                    </button>

                </div>

            </nav>


            {/* =================================================
          MAIN CONTENT
      ================================================= */}

            <main id="main-content">

                {/* =================================================
            HERO CAROUSEL
        ================================================= */}

                <section className="hero-section">

                    {slides.map((slide, index) => (

                        <div
                            key={index}
                            className={`hero-slide ${currentSlide === index
                                    ? "hero-slide-active"
                                    : ""
                                }`}
                        >

                            <div className="hero-slide-content">

                                {/* LEFT */}

                                <div className="hero-slide-text">

                                    <span className="hero-banner-tag">
                                        {slide.tag}
                                    </span>

                                    <h1>

                                        {slide.title}

                                        <br />

                                        <strong>
                                            {slide.highlight}
                                        </strong>

                                    </h1>

                                    <p>
                                        {slide.description}
                                    </p>


                                    <div className="hero-buttons">

                                        <button
                                            type="button"
                                            className="hero-primary-button"
                                            onClick={goToLogin}
                                        >
                                            {slide.button}

                                            <span>
                                                →
                                            </span>
                                        </button>


                                        <button
                                            type="button"
                                            className="hero-secondary-button"
                                            onClick={goToRegister}
                                        >
                                            Open an Account
                                        </button>

                                    </div>

                                </div>


                                {/* RIGHT VISUAL */}

                                <div className="hero-slide-visual">

                                    <div className="hero-glow"></div>

                                    <div className="hero-image-card">

                                        <img
                                            src={heroImage}
                                            alt="Digital banking"
                                        />

                                    </div>


                                    {/* FLOATING SECURITY CARD */}

                                    <div className="hero-floating-card">

                                        <span className="floating-card-icon">
                                            ✓
                                        </span>

                                        <div>

                                            <strong>

                                                {index === 0 &&
                                                    "Secure Banking"}

                                                {index === 1 &&
                                                    "Easy Management"}

                                                {index === 2 &&
                                                    "Fast Transfers"}

                                                {index === 3 &&
                                                    "Account Protection"}

                                            </strong>

                                            <span>

                                                {index === 0 &&
                                                    "Your money, protected."}

                                                {index === 1 &&
                                                    "Everything in one place."}

                                                {index === 2 &&
                                                    "Simple and convenient."}

                                                {index === 3 &&
                                                    "Bank with confidence."}

                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}


                    {/* PREVIOUS */}

                    <button
                        type="button"
                        className="hero-arrow hero-arrow-left"
                        onClick={previousSlide}
                        aria-label="Previous slide"
                    >
                        ‹
                    </button>


                    {/* NEXT */}

                    <button
                        type="button"
                        className="hero-arrow hero-arrow-right"
                        onClick={nextSlide}
                        aria-label="Next slide"
                    >
                        ›
                    </button>


                    {/* SLIDE DOTS */}

                    <div className="hero-dots">

                        {slides.map((_, index) => (

                            <button
                                type="button"
                                key={index}
                                className={`hero-dot ${currentSlide === index
                                        ? "active"
                                        : ""
                                    }`}
                                onClick={() =>
                                    setCurrentSlide(index)
                                }
                                aria-label={`Go to slide ${index + 1
                                    }`}
                            ></button>

                        ))}

                    </div>

                </section>


                {/* =================================================
            PRODUCTS
        ================================================= */}

                {/* =================================================
    PRODUCTS SECTION
================================================= */}

                <section className="products-section">

                    <div className="products-section-header">

                        <div>
                            <span className="products-eyebrow">
                                OUR PRODUCTS
                            </span>

                            <h2>
                                Banking solutions
                                <br />
                                designed for you
                            </h2>
                        </div>

                        <p>
                            Explore simple and convenient financial
                            solutions designed to help you manage
                            your money with confidence.
                        </p>

                    </div>


                    <div className="premium-products-grid">

                        {/* SAVINGS ACCOUNT */}

                        <article className="premium-product-card">

                            <div className="product-card-top">

                                <div className="premium-product-icon savings-icon">
                                    ₹
                                </div>

                                <span className="product-number">
                                    01
                                </span>

                            </div>

                            <h3>
                                Savings Account
                            </h3>

                            <p>
                                A simple and secure way to manage
                                your everyday banking and savings.
                            </p>

                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                            >
                                Explore Account
                                <span>→</span>
                            </button>

                        </article>


                        {/* PERSONAL LOAN */}

                        <article className="premium-product-card">

                            <div className="product-card-top">

                                <div className="premium-product-icon loan-icon">
                                    ◈
                                </div>

                                <span className="product-number">
                                    02
                                </span>

                            </div>

                            <h3>
                                Personal Loans
                            </h3>

                            <p>
                                Flexible financing solutions for
                                your personal needs and goals.
                            </p>

                            <button type="button">
                                Explore Loans
                                <span>→</span>
                            </button>

                        </article>


                        {/* CARDS */}

                        <article className="premium-product-card">

                            <div className="product-card-top">

                                <div className="premium-product-icon card-icon">
                                    ◇
                                </div>

                                <span className="product-number">
                                    03
                                </span>

                            </div>

                            <h3>
                                Cards
                            </h3>

                            <p>
                                Convenient and secure payment options
                                for your everyday purchases.
                            </p>

                            <button type="button">
                                Explore Cards
                                <span>→</span>
                            </button>

                        </article>


                        {/* MONEY TRANSFER */}

                        <article className="premium-product-card product-highlight">

                            <div className="product-card-top">

                                <div className="premium-product-icon transfer-icon">
                                    ⇄
                                </div>

                                <span className="product-number">
                                    04
                                </span>

                            </div>

                            <h3>
                                Money Transfer
                            </h3>

                            <p>
                                Send money securely to your registered
                                payees from your banking account.
                            </p>

                            <button
                                type="button"
                                onClick={goToLogin}
                            >
                                Transfer Money
                                <span>→</span>
                            </button>

                        </article>

                    </div>


                    {/* PRODUCT BOTTOM LINK */}

                    <div className="products-view-all">

                        <span>
                            Looking for more banking solutions?
                        </span>

                        <button type="button">
                            View All Products →
                        </button>

                    </div>

                </section>


                {/* =================================================
            WHY CHOOSE US
        ================================================= */}

                <section className="why-section">

                    <div className="why-content">

                        <div className="why-heading">

                            <span>
                                BANKING MADE BETTER
                            </span>

                            <h2>
                                Everything you need,
                                <br />
                                all in one place.
                            </h2>

                        </div>


                        <div className="why-points">

                            <div className="why-point">

                                <div>
                                    ✓
                                </div>

                                <section>

                                    <h3>
                                        Secure Banking
                                    </h3>

                                    <p>
                                        Your banking information is
                                        protected with secure
                                        authentication.
                                    </p>

                                </section>

                            </div>


                            <div className="why-point">

                                <div>
                                    ✓
                                </div>

                                <section>

                                    <h3>
                                        Easy Money Transfers
                                    </h3>

                                    <p>
                                        Send money to registered
                                        payees quickly and conveniently.
                                    </p>

                                </section>

                            </div>


                            <div className="why-point">

                                <div>
                                    ✓
                                </div>

                                <section>

                                    <h3>
                                        Track Transactions
                                    </h3>

                                    <p>
                                        Keep track of your transfers
                                        and account activity.
                                    </p>

                                </section>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
            LOGIN CTA
        ================================================= */}

                <section className="login-cta">

                    <div>

                        <span>
                            DIGITAL BANKING
                        </span>

                        <h2>
                            Ready to manage your money?
                        </h2>

                        <p>
                            Sign in to access your personalized
                            banking dashboard.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={goToLogin}
                    >
                        Login to Banking →
                    </button>

                </section>

            </main>


            {/* =================================================
          FLOATING ACTION BUTTONS
      ================================================= */}

            <div className="floating-actions">

                <button
                    type="button"
                    className="important-button"
                >
                    <span>
                        ⓘ
                    </span>

                    Important Advisory
                </button>


                <button
                    type="button"
                    className="rates-button"
                >
                    <span>
                        %
                    </span>

                    Rates
                </button>


                <button
                    type="button"
                    className="help-button"
                >
                    Need Help?
                    <br />
                    <strong>
                        Ask Me!
                    </strong>
                </button>

            </div>


            {/* =================================================
          FOOTER
      ================================================= */}

            <footer className="home-footer">

                <div className="footer-content">

                    {/* BRAND */}

                    <div className="footer-brand">

                        <img
                            src={yesBankLogo}
                            alt="YES BANK"
                        />

                        <p>
                            Digital Banking Management System
                        </p>

                    </div>


                    {/* BANKING */}

                    <div className="footer-column">

                        <h4>
                            Banking
                        </h4>

                        <span>
                            Accounts
                        </span>

                        <span>
                            Loans
                        </span>

                        <span>
                            Cards
                        </span>

                        <span>
                            Payments
                        </span>

                    </div>


                    {/* SUPPORT */}

                    <div className="footer-column">

                        <h4>
                            Support
                        </h4>

                        <span>
                            Help Centre
                        </span>

                        <span>
                            Contact Us
                        </span>

                        <span>
                            Security
                        </span>

                        <span>
                            FAQs
                        </span>

                    </div>


                    {/* QUICK ACCESS */}

                    <div className="footer-column">

                        <h4>
                            Quick Access
                        </h4>

                        <span onClick={goToLogin}>
                            Login
                        </span>

                        <span onClick={goToRegister}>
                            Create Account
                        </span>

                        <span onClick={() => navigate("/dashboard")}>
                            Dashboard
                        </span>

                    </div>

                </div>


                {/* FOOTER BOTTOM */}

                <div className="footer-bottom">

                    <span>
                        © 2026 Banking Management System
                    </span>

                    <span>
                        College Project
                    </span>

                </div>

            </footer>

        </div>
    );
}

export default Home;