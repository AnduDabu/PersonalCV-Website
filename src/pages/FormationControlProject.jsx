import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, Database, Play } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import ScrollReveal from '../components/ScrollReveal';
import SEO from '../components/SEO';

const FormationControlProject = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-background text-text">
            <SEO
                title="Formation Control"
                description="Multi-Agent Formation Control using decentralized consensus algorithms in Python."
            />
            {/* Project Hero */}
            <section className="relative h-[30vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background/95 z-10" />
                <div className="absolute inset-0 bg-surface z-0">
                    <div className="w-full h-full opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
                </div>

                <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Multi-Agent Formation Control</h1>
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {['Python', 'Spiking Neural Networks', 'Control Theory', 'Norse', 'PyTorch', 'Robotics'].map((tech) => (
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
                            This project implements a decentralized control strategy for multi-agent systems to achieve and maintain robust formation shapes.
                            It compares a classical graph-theoretic consensus algorithm with a **neuromorphic approach using Spiking Neural Networks (SNNs)**. The goal is to explore how biological-inspired computing can be applied to complex formation control tasks while ensuring safety constraints through Control Barrier Functions.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                            <div className="bg-surface/30 p-8 rounded-2xl border border-white/5">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                    <Database className="w-5 h-5 text-primary" /> Key Features
                                </h3>
                                <ul className="space-y-3 text-gray-700 dark:text-gray-400">
                                    <li>• Decentralized Consensus Algorithms</li>
                                    <li>• Obstacle Avoidance Integration</li>
                                    <li>• Robustness to Agent Failure</li>
                                    <li>• Scalable to N-agents</li>
                                </ul>
                            </div>
                            <div className="bg-surface/30 p-8 rounded-2xl border border-white/5">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                    <Github className="w-5 h-5 text-primary" /> Technical Stack
                                </h3>
                                <ul className="space-y-3 text-gray-700 dark:text-gray-400">
                                    <li>• Language: Python 3.9+</li>
                                    <li>• AI/ML: PyTorch, Norse (SNN Library)</li>
                                    <li>• Math: NumPy, SciPy, Graph Theory</li>
                                    <li>• Safety: Control Barrier Functions (CBF)</li>
                                </ul>
                            </div>
                        </div>

                        <div className="my-16">
                            <h3 className="text-2xl font-bold mb-6 text-primary border-l-4 border-primary pl-4">Technical Deep Dive</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-100">🧠 Spiking Neural Network (SNN)</h4>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                                        The advanced controller is built using the <strong>Norse</strong> library for deep learning with spikes. Unlike traditional ANNs, this model uses <strong>Leaky Integrate-and-Fire (LIF)</strong> neurons that mimic biological spiking behavior.
                                    </p>
                                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                                        <li><strong>Temporal Processing:</strong> Three <code>LIFBoxCell</code> temporal layers process sequential data to capture system dynamics.</li>
                                        <li><strong>Lifted Neurons:</strong> Uses 'Lifted' neuron layers to handle time-varying inputs effectively.</li>
                                        <li><strong>Hybrid Architecture:</strong> Combines spiking temporal layers with a convolutional 1x1 readout layer for precise velocity control.</li>
                                    </ul>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-100">🛡️ Safety via Control Barrier Functions</h4>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                                        Safety is paramount in autonomous systems. We utilize <strong>Control Barrier Functions (CBFs)</strong> to guarantee collision avoidance.
                                    </p>
                                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                                        <li><strong>Classical Safety:</strong> Solves an optimization problem to ensure the system state stays within a safe set <em>C</em> defined by h(x) ≥ 0.</li>
                                        <li><strong>Learned Safety:</strong> The SNN is trained to approximate this safe behavior, internalizing the collision avoidance logic without the clear computational overhead of online optimization.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mb-8 text-primary">Simulation Demos & Analysis</h2>

                        <div className="space-y-16">
                            {/* Videos Section */}
                            <div className="space-y-8">
                                <h3 className="text-2xl font-bold border-b border-white/10 pb-2">Multi-Agent Simulations</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <div className="bg-surface/50 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                            <VideoPlayer src="/formation-control-media/4Agents.mp4#t=0.1" />
                                        </div>
                                        <h4 className="font-semibold text-lg">4-Agent Formation</h4>
                                        <p className="text-sm text-gray-400">Basic consensus algorithm achieving multiple different shaped formations with 4 agents.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="bg-surface/50 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                            <VideoPlayer src="/formation-control-media/5Agents.mp4#t=0.1" />
                                        </div>
                                        <h4 className="font-semibold text-lg">5-Agent Formation</h4>
                                        <p className="text-sm text-gray-400">Scalability test with 5 agents achieving multiple different shaped formations.</p>
                                    </div>

                                    <div className="space-y-3 md:col-span-2 md:w-2/3 md:mx-auto">
                                        <div className="bg-surface/50 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                            <VideoPlayer src="/formation-control-media/5AgentsSNN.mp4#t=0.1" />
                                        </div>
                                        <h4 className="font-semibold text-lg">SNN-based Control</h4>
                                        <p className="text-sm text-gray-400">Advanced control using Spiking Neural Networks for adaptive formation maintenance.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Graphs Section */}
                            <div className="space-y-8">
                                <h3 className="text-2xl font-bold border-b border-white/10 pb-2">Performance Analysis</h3>

                                <div className="grid grid-cols-1 gap-12">
                                    <div className="bg-surface/30 p-6 rounded-2xl border border-white/5 space-y-4">
                                        <h4 className="text-xl font-semibold text-primary">Consensus Convergence</h4>
                                        <div className="rounded-xl overflow-hidden">
                                            <img
                                                src="/formation-control-media/Plot.jpeg"
                                                alt="Consensus Convergence Plot"
                                                className="w-full h-auto hover:scale-[1.02] transition-transform duration-300"
                                            />
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                            This graph demonstrates the convergence of the multi-agent system. The position errors asymptotically approach zero, driven by the Laplacian-based consensus protocol. The trajectory respects the Control Barrier Function (CBF) constraints <em>h(x) = d² - ||pᵢ - pⱼ||² ≥ 0</em>, ensuring the minimum safety distance <em>d</em> is maintained between all agent pairs during the formation maneuver.
                                        </p>
                                    </div>

                                    <div className="bg-surface/30 p-6 rounded-2xl border border-white/5 space-y-4">
                                        <h4 className="text-xl font-semibold text-primary">SNN Control Response</h4>
                                        <div className="rounded-xl overflow-hidden">
                                            <img
                                                src="/formation-control-media/PlotSNN.jpeg"
                                                alt="SNN Control Plot"
                                                className="w-full h-auto hover:scale-[1.02] transition-transform duration-300"
                                            />
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                            Response analysis of the SNN controller. The plot correlates the neural spiking activity (LIF neuron membrane potentials) with the control output. The SNN successfully approximates the solution of the Quadratic Program (QP) defined by the CBF, learning the non-linear barrier avoidance behavior through its temporal dynamics without solving the optimization problem online.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </ScrollReveal>
            </section>
        </div>
    );
};

export default FormationControlProject;
