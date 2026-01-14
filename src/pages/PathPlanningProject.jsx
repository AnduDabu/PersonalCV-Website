import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, Database, Play } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import ScrollReveal from '../components/ScrollReveal';
import SEO from '../components/SEO';

const PathPlanningProject = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-background text-text">
            <SEO
                title="Path Planning"
                description="Advanced path planning in hazardous environments using optimization algorithms."
            />
            {/* Project Hero */}
            <section className="relative h-[30vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background/95 z-10" />
                <div className="absolute inset-0 bg-surface z-0">
                    <div className="w-full h-full opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
                </div>

                <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Path Planning in Hazardous Environments</h1>
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {['Python', 'PRM', 'A*', 'NumPy', 'Matplotlib'].map((tech) => (
                            <span key={tech} className="px-3 py-1 bg-surface/50 border border-white/10 rounded-full text-sm font-medium text-primary">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-20 px-4 max-w-5xl mx-auto">
                <ScrollReveal>
                    <Link
                        to="/#projects"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/');
                            setTimeout(() => {
                                const element = document.getElementById('projects');
                                if (element) element.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                        }}
                        className="inline-flex items-center gap-2 text-primary hover:text-secondary mb-12 transition-colors font-medium no-underline cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Portfolio
                    </Link>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold mb-6 text-primary">Project Overview</h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                            This project implements a robust path planning system for autonomous agents navigating in complex, obstacle-rich environments.
                            It utilizes the <strong>Probabilistic Roadmap (PRM)</strong> algorithm to construct a graph of feasible paths by random sampling, followed by the <strong>A* (A-Star)</strong> search algorithm to find the optimal path from start to goal.
                            The modular design allows for flexible obstacle mapping and easy integration with different robot models.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                            <div className="bg-surface/30 p-8 rounded-2xl border border-white/5">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                    <Database className="w-5 h-5 text-primary" /> Key Features
                                </h3>
                                <ul className="space-y-3 text-gray-700 dark:text-gray-400">
                                    <li>• <strong>PRM Construction:</strong> Efficient random sampling and node connection.</li>
                                    <li>• <strong>A* Optimization:</strong> Determines the shortest path in the generated graph.</li>
                                    <li>• <strong>Collision Avoidance:</strong> Bresenham's line algorithm for robust obstacle detection.</li>
                                    <li>• <strong>Modular Architecture:</strong> Separated logic for graph building, search, and visualization.</li>
                                </ul>
                            </div>
                            <div className="bg-surface/30 p-8 rounded-2xl border border-white/5">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                    <Github className="w-5 h-5 text-primary" /> Technical Stack
                                </h3>
                                <ul className="space-y-3 text-gray-700 dark:text-gray-400">
                                    <li>• <strong>Language:</strong> Python 3</li>
                                    <li>• <strong>Algorithms:</strong> PRM, A*, Bresenham</li>
                                    <li>• <strong>Libraries:</strong> NumPy (calculation), Matplotlib (visualization)</li>
                                    <li>• <strong>Input:</strong> Image-based obstacle maps</li>
                                </ul>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mb-8 text-primary">Simulation Demo</h2>

                        <div className="space-y-12">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold">Path Finding Visualization</h3>
                                <p className="text-gray-700 dark:text-gray-400">
                                    Simulation demonstrating the PRM algorithm generating nodes (blue dots), connecting valid paths (black lines), and finding the optimal route (red line) from start (green) to goal (red X).
                                </p>
                                <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                                    <VideoPlayer src="https://pub-c9add4fb2a554c62867fd1ad02e30165.r2.dev/pathplanning.mp4#t=0.1" />
                                </div>
                            </div>
                        </div>

                    </div>
                </ScrollReveal>
            </section>
        </div>
    );
};

export default PathPlanningProject;
