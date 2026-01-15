import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Home from './pages/Home';
import BasketballProject from './pages/BasketballProject';
import FormationControlProject from './pages/FormationControlProject';
import PathPlanningProject from './pages/PathPlanningProject';
import Playground from './pages/Playground';
import './index.css';

// Components
import ThemeToggle from './components/ThemeToggle';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ParticlesBackground from './components/ParticlesBackground';
// Navbar is defined inline in AppContent
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './components/SoundProvider';
import { Toaster } from 'react-hot-toast';

import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import ScrollProgressBar from './components/ScrollProgressBar';
import CustomCursor from './components/CustomCursor';

const AppContent = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = ['About', 'Projects', 'Timeline', 'Skills', 'Contact'];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        setIsMobileMenuOpen(false);
        if (!isHome) return;
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen font-sans text-text bg-background transition-colors duration-300">
            <CustomCursor />
            <ScrollProgressBar />
            <ScrollToTop />
            {location.pathname !== '/playground' && <ParticlesBackground />}

            {/* Navbar */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-lg border-b border-white/5' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                            <Link to="/" className="text-2xl font-bold tracking-tighter hover:text-primary transition-colors">
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
                                className="text-text hover:text-primary focus:outline-none transition-colors"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-text/5 absolute w-full shadow-2xl">
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
            <main>
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                        <Route path="/project/basketball" element={<PageTransition><BasketballProject /></PageTransition>} />
                        <Route path="/project/formation-control" element={<PageTransition><FormationControlProject /></PageTransition>} />
                        <Route path="/project/path-planning" element={<PageTransition><PathPlanningProject /></PageTransition>} />
                        <Route path="/playground" element={<PageTransition><Playground /></PageTransition>} />
                    </Routes>
                </AnimatePresence>
            </main>

            <Footer />
            <Toaster position="bottom-right" />
        </div>
    );
};

const App = () => {
    return (
        <ThemeProvider>
            <SoundProvider>
                <AppContent />
            </SoundProvider>
        </ThemeProvider>
    );
};

export default App;
