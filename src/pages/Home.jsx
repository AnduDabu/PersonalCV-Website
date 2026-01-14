import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
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
                    <div className="bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 border border-primary/10 dark:border-primary/20 rounded-2xl p-8 text-center backdrop-blur-sm">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white flex items-center justify-center gap-3">
                            <Gamepad2 className="w-8 h-8 text-primary" />
                            Want to see something fun?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                            I've built an <strong>Interactive Playground</strong> to showcase real-time algorithms and simulations.
                            It's a great way to see the code in action—without distracting from the serious stuff!
                        </p>
                        <Link
                            to="/playground"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-primary/25"
                        >
                            Enter Playground
                        </Link>
                    </div>
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
