import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Layout, Zap, Smartphone } from 'lucide-react';


const FreelanceCTA = () => {
    const benefits = [
        { icon: Layout, text: "Modern Design" },
        { icon: Zap, text: "High Performance" },
        { icon: Smartphone, text: "Mobile First" }
    ];

    return (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-surface to-secondary/10 dark:from-primary/5 dark:via-black dark:to-secondary/5" />

            {/* Animated Grid/Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="relative z-10 px-8 py-16 md:py-20 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12">

                {/* Text Content */}
                <div className="flex-1 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Open for Opportunities</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-text"
                    >
                        Want a website <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">just like this?</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-xl mx-auto md:mx-0"
                    >
                        I help individuals and startups build stunning, high-performance web applications that leave a lasting impression.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-wrap justify-center md:justify-start gap-4 mb-8"
                    >
                        {benefits.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                <item.icon className="w-4 h-4 text-primary" />
                                {item.text}
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Call to Action Button */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                    className="flex-shrink-0 relative group"
                >
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500" />

                    <a
                        href="#contact"
                        className="relative z-10 flex items-center gap-4 px-8 py-5 bg-text text-background rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        Start Your Project
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default FreelanceCTA;
