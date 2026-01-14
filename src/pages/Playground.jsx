import React from 'react';
import FlockingSimulation from '../components/playground/FlockingSimulation';
import PathfindingVisualizer from '../components/playground/PathfindingVisualizer';
import SEO from '../components/SEO';
import { Gamepad2 } from 'lucide-react';

const Playground = () => {
    const [activeGame, setActiveGame] = React.useState('pathfinding');

    return (
        <div className="min-h-screen bg-background text-text">
            <SEO
                title="Interactive Playground"
                description="Interactive tech demos showcasing Flocking Simulation (Boids) and Pathfinding (A*) algorithms."
            />

            <section className="relative py-20 px-4">
                <div className="max-w-7xl mx-auto mb-12 text-center">
                    <div className="inline-flex items-center gap-3 bg-surface/50 px-5 py-2 rounded-full border border-primary/20 mb-6 animate-fade-in-up">
                        <Gamepad2 className="w-5 h-5 text-primary" />
                        <span className="text-sm font-semibold tracking-wide uppercase text-primary">Experimental Zone</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Interactive <span className="text-primary">Playground</span></h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
                        A collection of interactive simulations and experiments exploring algorithmic complexity, emergent behavior, and computer science concepts.
                    </p>

                    {/* Game Selector Tabs */}
                    <div className="inline-flex bg-surface/50 p-1.5 rounded-xl border border-white/5 backdrop-blur-sm relative z-10">
                        <button
                            onClick={() => setActiveGame('flocking')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeGame === 'flocking'
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Flocking Simulation
                        </button>
                        <button
                            onClick={() => setActiveGame('pathfinding')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeGame === 'pathfinding'
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Pathfinding Visualizer
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto">
                    {/* Content Container */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeGame === 'flocking' ? <FlockingSimulation /> : <PathfindingVisualizer />}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Playground;
