import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Home from './pages/Home';
import './index.css';

import ThemeToggle from './components/ThemeToggle';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ParticlesBackground from './components/ParticlesBackground';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './components/SoundProvider';
import PageTransition from './components/PageTransition';
import ScrollProgressBar from './components/ScrollProgressBar';
import CustomCursor from './components/CustomCursor';
import ErrorBoundary from './components/ErrorBoundary';

// Only the home page is in the entry bundle. The rest load on first visit; Vite emits
// one chunk per page. If a chunk from an older deploy is gone, main.jsx reloads once.
const BasketballProject = lazy(() => import('./pages/BasketballProject'));
const FormationControlProject = lazy(() => import('./pages/FormationControlProject'));
const PathPlanningProject = lazy(() => import('./pages/PathPlanningProject'));
const Playground = lazy(() => import('./pages/Playground'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Page = ({ children }) => (
    <PageTransition>
        <Suspense fallback={<div className="min-h-screen" />}>{children}</Suspense>
    </PageTransition>
);

const AppContent = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mainRef = useRef(null);

    const navItems = ['About', 'Projects', 'Timeline', 'Skills', 'Contact'];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close the mobile menu on Escape.
    useEffect(() => {
        if (!isMobileMenuOpen) return;
        const onKey = (e) => e.key === 'Escape' && setIsMobileMenuOpen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isMobileMenuOpen]);

    // On route change: close the menu and move keyboard focus to the new page content so
    // screen-reader and keyboard users are not left on the old position.
    useEffect(() => {
        setIsMobileMenuOpen(false);
        mainRef.current?.focus({ preventScroll: true });
    }, [location.pathname]);

    const scrollToSection = (id) => {
        setIsMobileMenuOpen(false);
        if (!isHome) return;
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen font-sans text-text bg-background transition-colors duration-300">
            <CustomCursor />
            <ScrollProgressBar />
            <ScrollToTop />
            {location.pathname !== '/playground' && <ParticlesBackground />}

            {/* Navbar */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-lg border-b border-white/5' : 'bg-transparent'}`} aria-label="Main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="text-2xl font-bold tracking-tighter hover:text-primary transition-colors">
                                Alexandru<span className="text-primary">Dabu</span>
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-center space-x-8">
                                {isHome ? (
                                    navItems.map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => scrollToSection(item.toLowerCase())}
                                            className="hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            {item}
                                        </button>
                                    ))
                                ) : (
                                    <Link to="/" className="hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">Back to Home</Link>
                                )}
                                <Link to="/playground" className="hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1">
                                    Playground
                                </Link>
                                <ThemeToggle />
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center gap-4">
                            <ThemeToggle />
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-text hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded transition-colors"
                                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                                aria-expanded={isMobileMenuOpen}
                                aria-controls="mobile-menu"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div id="mobile-menu" className="md:hidden bg-background/95 backdrop-blur-xl border-b border-text/5 absolute w-full shadow-2xl">
                        <div className="px-4 pt-4 pb-6 space-y-2">
                            {isHome ? (
                                navItems.map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => scrollToSection(item.toLowerCase())}
                                        className="text-text/80 hover:text-primary hover:bg-surface/50 block px-4 py-3 rounded-lg text-lg font-medium w-full text-left transition-colors"
                                    >
                                        {item}
                                    </button>
                                ))
                            ) : (
                                <Link
                                    to="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-text/80 hover:text-primary hover:bg-surface/50 block px-4 py-3 rounded-lg text-lg font-medium transition-colors"
                                >
                                    Back to Home
                                </Link>
                            )}
                            <Link
                                to="/playground"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-text/80 hover:text-primary hover:bg-surface/50 block px-4 py-3 rounded-lg text-lg font-medium transition-colors"
                            >
                                Playground
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main ref={mainRef} tabIndex={-1} className="outline-none">
                <ErrorBoundary>
                    <AnimatePresence mode="wait">
                        <Routes location={location} key={location.pathname}>
                            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                            <Route path="/project/basketball" element={<Page><BasketballProject /></Page>} />
                            <Route path="/project/formation-control" element={<Page><FormationControlProject /></Page>} />
                            <Route path="/project/path-planning" element={<Page><PathPlanningProject /></Page>} />
                            <Route path="/playground" element={<Page><Playground /></Page>} />
                            <Route path="*" element={<Page><NotFound /></Page>} />
                        </Routes>
                    </AnimatePresence>
                </ErrorBoundary>
            </main>

            <Footer />
        </div>
    );
};

const App = () => {
    return (
        // reducedMotion="user" makes every framer-motion animation respect the OS
        // "reduce motion" setting. The site is animation-heavy, so this matters.
        <MotionConfig reducedMotion="user">
            <ThemeProvider>
                <SoundProvider>
                    <AppContent />
                </SoundProvider>
            </ThemeProvider>
        </MotionConfig>
    );
};

export default App;
