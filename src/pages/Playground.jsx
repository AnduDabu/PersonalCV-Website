import React from 'react';
import FlockingSimulation from '../components/playground/FlockingSimulation';
import PathfindingVisualizer from '../components/playground/PathfindingVisualizer';
import FloatingCodeBackground from '../components/playground/FloatingCodeBackground';
import SEO from '../components/SEO';
import { Gamepad2, Terminal, Code2, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Playground = () => {
    const [activeGame, setActiveGame] = React.useState('pathfinding');

    return (
        <div className="min-h-screen bg-background text-text overflow-hidden relative">
            <FloatingCodeBackground />
            <SEO
                title="Interactive Playground"
                description="Interactive tech demos showcasing Flocking Simulation (Boids) and Pathfinding (A*) algorithms."
            />

            <section className="relative py-20 px-4 z-10">
                <div className="max-w-7xl mx-auto mb-12 text-center">

                    {/* "System Ready" Intro - Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-3 bg-surface/50 px-5 py-2 rounded-full border border-primary/20 mb-6"
                    >
                        <Gamepad2 className="w-5 h-5 text-primary animate-pulse" />
                        <span className="text-sm font-semibold tracking-wide uppercase text-primary animate-pulse">Experimental Zone</span>
                    </motion.div>

                    {/* "System Ready" Intro - Typing Title */}
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <span className="inline-block relative">
                            Interactive <span className="text-primary">Playground</span>
                            <motion.span
                                className="absolute -bottom-2 left-0 w-full h-1 bg-primary"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.8, delay: 0.8, ease: "circOut" }}
                            />
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-xl text-gray-400 max-w-2xl mx-auto mb-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                    >
                        A collection of interactive simulations and experiments exploring algorithmic complexity, emergent behavior, and computer science concepts.
                    </motion.p>

                    {/* Neon "Active State" Selector */}
                    <div className="inline-flex bg-surface/30 p-1.5 rounded-xl border border-white/5 backdrop-blur-sm relative z-10">
                        {[
                            { id: 'pathfinding', label: 'Pathfinding Visualizer', icon: Code2 },
                            { id: 'flocking', label: 'Flocking Simulation', icon: Cpu },
                        ].map((game) => (
                            <button
                                key={game.id}
                                onClick={() => setActiveGame(game.id)}
                                className={`relative px-6 py-2.5 rounded-lg text-sm font-bold transition-colors duration-300 flex items-center gap-2 z-10 ${activeGame === game.id ? 'text-white' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {activeGame === game.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary shadow-lg shadow-primary/25 rounded-lg -z-10"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <game.icon className="w-4 h-4" />
                                {game.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto">
                    {/* Content Container with "Holo-Deck" Transition */}
                    <motion.div
                        layout
                        className="relative"
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ duration: 0.8, delay: 1.2, ease: "circOut" }}
                    >
                        {/* Scanline effect for container */}
                        <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20 rounded-2xl"></div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeGame}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-surface/50 backdrop-blur-sm"
                            >
                                {activeGame === 'flocking' ? <FlockingSimulation /> : <PathfindingVisualizer />}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Playground;
