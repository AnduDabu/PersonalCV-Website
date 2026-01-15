import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Check, Loader2, FileText } from 'lucide-react';
import { useSound } from './SoundProvider';

const ResumeButton = ({ href = "/CV2025_EN-2.pdf" }) => {
    const [status, setStatus] = useState('idle'); // idle, compiling, success
    const { playClick } = useSound();

    const handleClick = (e) => {
        e.preventDefault();
        if (status !== 'idle') return;

        playClick();
        setStatus('compiling');

        // Simulate compilation/preparation
        setTimeout(() => {
            setStatus('success');

            // Trigger download after animation
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = href;
                link.download = 'CV2025_EN-2.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Reset after delay
                setTimeout(() => {
                    setStatus('idle');
                }, 3000);
            }, 500);
        }, 2000);
    };

    return (
        <button
            onClick={handleClick}
            className="group relative overflow-hidden rounded-full font-bold focus:outline-none bg-transparent isolate transform-gpu"
            style={{ width: '200px', height: '56px' }} // Fixed dimensions to prevent layout shift
        >
            <AnimatePresence mode="wait">
                {status === 'idle' && (
                    <motion.div
                        key="idle"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center gap-2 bg-primary text-white hover:bg-secondary transition-colors rounded-full"
                    >
                        <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Download CV</span>
                    </motion.div>
                )}

                {status === 'compiling' && (
                    <motion.div
                        key="compiling"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center gap-2 bg-gray-900 text-primary rounded-full"
                    >
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="font-mono text-sm">Compiling...</span>

                        {/* Progress Bar background */}
                        <motion.div
                            className="absolute bottom-0 left-0 h-1 bg-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />
                    </motion.div>
                )}

                {status === 'success' && (
                    <motion.div
                        key="success"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center gap-2 bg-green-500 text-white"
                    >
                        <Check className="w-6 h-6" />
                        <span>Ready!</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
};

export default ResumeButton;
