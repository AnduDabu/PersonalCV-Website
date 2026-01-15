import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import ProjectGallery from '../components/ProjectGallery';
import Timeline from '../components/Timeline';
import Skills from '../components/Skills';
import About from '../components/About';
import Contact from '../components/Contact';
import ScrollReveal from '../components/ScrollReveal';
import SEO from '../components/SEO';

const Home = () => {
    return (
        <div className="relative">
            <SEO
                title="Home"
                description="Alexandru Dabu - Automation & Computer Science Engineer specializing in AI, Robotics, and Full-Stack Development."
            />
            <section id="hero">
                <Hero />
            </section>

            <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-surface/30">
                <ScrollReveal>
                    <About />
                </ScrollReveal>
            </section>

            <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <ScrollReveal>
                    <ProjectGallery />
                </ScrollReveal>
            </section>

            <section id="timeline" className="py-20 px-4 sm:px-6 lg:px-8 bg-surface/30">
                <div className="max-w-7xl mx-auto">
                    <ScrollReveal>
                        <Timeline />
                    </ScrollReveal>
                </div>
            </section>

            <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <ScrollReveal>
                    <Skills />
                </ScrollReveal>
            </section>

            <section id="playground-teaser" className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <ScrollReveal>
                    <motion.div
                        className="relative bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 rounded-2xl p-8 text-center backdrop-blur-sm overflow-hidden group"
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{ border: '1px solid rgba(var(--color-primary), 0.2)' }}
                    >


                        {/* Title with slaming effect */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-4 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            <motion.div
                                animate={{
                                    rotate: [-5, 5, -5],
                                    y: [-2, 2, -2]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <Gamepad2 className="w-10 h-10 text-primary drop-shadow-[0_0_8px_rgba(var(--color-primary),0.5)]" />
                            </motion.div>

                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="flex"
                            >
                                {Array.from("Want to see something fun?").map((char, index) => (
                                    <motion.span
                                        key={index}
                                        style={{ display: "inline-block", marginRight: char === " " ? "0.3em" : "0" }}
                                        animate={{ y: [0, -6, 0] }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: index * 0.1,
                                            repeatDelay: 2
                                        }}
                                    >
                                        {char === " " ? "\u00A0" : char}
                                    </motion.span>
                                ))}
                            </motion.span>
                        </div>

                        <motion.p
                            className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto text-lg leading-relaxed"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            I've built an <strong className="text-primary">Interactive Playground</strong> to showcase real-time algorithms and simulations.
                            It's a great way to see the code in action—without distracting from the serious stuff!
                        </motion.p>

                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.8 }}
                            className="relative z-10 inline-block"
                        >
                            <Link
                                to="/playground"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105 active:scale-95 group/btn overflow-hidden relative"
                            >
                                <span className="relative z-10">Enter Playground</span>
                                <motion.span
                                    className="relative z-10 ml-2"
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    →
                                </motion.span>
                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </ScrollReveal>
            </section>

            <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-surface/30">
                <ScrollReveal>
                    <Contact />
                </ScrollReveal>
            </section>
        </div>
    );
};

export default Home;
