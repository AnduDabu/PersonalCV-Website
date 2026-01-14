import React, { useEffect, useRef, useState } from 'react';
import { Settings, RefreshCw } from 'lucide-react';

class Boid {
    constructor(width, height) {
        this.position = { x: Math.random() * width, y: Math.random() * height };
        this.velocity = { x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4 };
        this.acceleration = { x: 0, y: 0 };
        this.maxForce = 0.2;
        this.maxSpeed = 4;
        this.width = width;
        this.height = height;
    }

    edges() {
        if (this.position.x > this.width) this.position.x = 0;
        else if (this.position.x < 0) this.position.x = this.width;
        if (this.position.y > this.height) this.position.y = 0;
        else if (this.position.y < 0) this.position.y = this.height;
    }

    align(boids, perceptionRadius) {
        let steering = { x: 0, y: 0 };
        let total = 0;
        for (let other of boids) {
            let d = Math.hypot(this.position.x - other.position.x, this.position.y - other.position.y);
            if (other !== this && d < perceptionRadius) {
                steering.x += other.velocity.x;
                steering.y += other.velocity.y;
                total++;
            }
        }
        if (total > 0) {
            steering.x /= total;
            steering.y /= total;
            let len = Math.hypot(steering.x, steering.y);
            if (len > 0) {
                steering.x = (steering.x / len) * this.maxSpeed;
                steering.y = (steering.y / len) * this.maxSpeed;
            }
            steering.x -= this.velocity.x;
            steering.y -= this.velocity.y;
            this.limit(steering, this.maxForce);
        }
        return steering;
    }

    cohesion(boids, perceptionRadius) {
        let steering = { x: 0, y: 0 };
        let total = 0;
        for (let other of boids) {
            let d = Math.hypot(this.position.x - other.position.x, this.position.y - other.position.y);
            if (other !== this && d < perceptionRadius) {
                steering.x += other.position.x;
                steering.y += other.position.y;
                total++;
            }
        }
        if (total > 0) {
            steering.x /= total;
            steering.y /= total;
            steering.x -= this.position.x;
            steering.y -= this.position.y;
            let len = Math.hypot(steering.x, steering.y);
            if (len > 0) {
                steering.x = (steering.x / len) * this.maxSpeed;
                steering.y = (steering.y / len) * this.maxSpeed;
            }
            steering.x -= this.velocity.x;
            steering.y -= this.velocity.y;
            this.limit(steering, this.maxForce);
        }
        return steering;
    }

    separation(boids, perceptionRadius) {
        let steering = { x: 0, y: 0 };
        let total = 0;
        for (let other of boids) {
            let d = Math.hypot(this.position.x - other.position.x, this.position.y - other.position.y);
            if (other !== this && d < perceptionRadius) {
                let diff = { x: this.position.x - other.position.x, y: this.position.y - other.position.y };
                let len = Math.hypot(diff.x, diff.y);
                if (len > 0) {
                    diff.x /= len; // Normalize
                    diff.y /= len;
                    // Weight by distance (closer = more repulsion)
                    diff.x /= d;
                    diff.y /= d;
                    steering.x += diff.x;
                    steering.y += diff.y;
                    total++;
                }
            }
        }
        if (total > 0) {
            steering.x /= total;
            steering.y /= total;
            let len = Math.hypot(steering.x, steering.y);
            if (len > 0) {
                steering.x = (steering.x / len) * this.maxSpeed;
                steering.y = (steering.y / len) * this.maxSpeed;
            }
            steering.x -= this.velocity.x;
            steering.y -= this.velocity.y;
            this.limit(steering, this.maxForce);
        }
        return steering;
    }

    limit(vector, max) {
        let lenSq = vector.x * vector.x + vector.y * vector.y;
        if (lenSq > max * max) {
            let len = Math.sqrt(lenSq);
            vector.x = (vector.x / len) * max;
            vector.y = (vector.y / len) * max;
        }
    }

    flock(boids, weights) {
        let alignment = this.align(boids, 50);
        let cohesion = this.cohesion(boids, 50);
        let separation = this.separation(boids, 50);

        this.acceleration.x += alignment.x * weights.alignment;
        this.acceleration.y += alignment.y * weights.alignment;
        this.acceleration.x += cohesion.x * weights.cohesion;
        this.acceleration.y += cohesion.y * weights.cohesion;
        this.acceleration.x += separation.x * weights.separation;
        this.acceleration.y += separation.y * weights.separation;
    }

    update(speedFactor, forceFactor) {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        // Dynamically limit speed based on slider
        const currentMaxSpeed = this.maxSpeed * speedFactor;
        const currentMaxForce = this.maxForce * forceFactor;

        this.limit(this.velocity, currentMaxSpeed);
        this.acceleration.x = 0;
        this.acceleration.y = 0;
        this.edges();
    }

    draw(ctx) {
        let angle = Math.atan2(this.velocity.y, this.velocity.x);
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(angle);
        ctx.beginPath();
        // Make them slightly larger and sharper
        ctx.moveTo(12, 0);
        ctx.lineTo(-6, 6);
        ctx.lineTo(-6, -6);
        ctx.lineTo(12, 0);
        ctx.fillStyle = '#14b8a6'; // tailwind teal-500
        ctx.fill();
        ctx.restore();
    }
}

const FlockingSimulation = () => {
    const canvasRef = useRef(null);
    const [weights, setWeights] = useState({ alignment: 1.0, cohesion: 1.0, separation: 1.5 });
    const [simParams, setSimParams] = useState({ speed: 0.3, force: 1.0, count: 20 });
    const boidsRef = useRef([]);
    const requestRef = useRef();

    // Use mutable ref for params to avoid re-init loop
    const paramsRef = useRef(simParams);
    const weightsRef = useRef(weights);

    useEffect(() => { paramsRef.current = simParams; }, [simParams]);
    useEffect(() => { weightsRef.current = weights; }, [weights]);

    // Initial setup and loop
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        // Initial setup
        const updateDimensions = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }
        };
        updateDimensions();
        // Simple resize listener
        window.addEventListener('resize', updateDimensions);

        // Initialize boids if empty or count changed
        // (For simplicity in this loop, we just re-init if count mismatch, 
        // to avoid full re-mount flicker, we do it inside animate or separate effect?
        // Let's stick to separate structure for clarity)
    }, []);

    // Re-init boids when count changes
    useEffect(() => {
        const canvas = canvasRef.current;
        const width = canvas.width;
        const height = canvas.height;

        const newBoids = [];
        for (let i = 0; i < simParams.count; i++) {
            // If we have existing boids, keep them to avoid "reset" feel when changing other params
            // But here we depend on simParams.count, so we only run this when count changes
            // If increasing, keep old and add new. If decreasing, slice.
            // For now, simple re-init is fine.
            newBoids.push(new Boid(width, height));
        }
        boidsRef.current = newBoids;
    }, [simParams.count]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const animate = () => {
            const width = canvas.width;
            const height = canvas.height;
            ctx.clearRect(0, 0, width, height);

            for (let boid of boidsRef.current) {
                boid.width = width; // Ensure they know boundaries if resized
                boid.height = height;

                boid.edges();
                boid.flock(boidsRef.current, weightsRef.current);
                // Pass dynamic speed/force limits
                boid.update(paramsRef.current.speed, paramsRef.current.force);
                boid.draw(ctx);
            }
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return (
        <div className="bg-white/50 dark:bg-surface/30 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white transition-colors duration-300">
                <Settings className="w-6 h-6 text-primary" /> Flocking Simulation (Boids)
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3 bg-gray-100 dark:bg-black/40 rounded-xl overflow-hidden shadow-inner border border-gray-200 dark:border-white/10 relative h-[600px] transition-colors duration-300" id="canvas-container">
                    <canvas ref={canvasRef} className="w-full h-full block" />
                </div>

                <div className="space-y-4 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="p-4 bg-gray-50 dark:bg-surface/50 rounded-lg border border-gray-200 dark:border-white/5 space-y-4 transition-colors duration-300">
                        <h3 className="text-base font-semibold text-primary flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" /> Controls
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <label>Speed Limit</label>
                                <span>{Math.round(simParams.speed * 100)}%</span>
                            </div>
                            <input
                                type="range" min="0.1" max="2.0" step="0.1"
                                value={simParams.speed}
                                onChange={(e) => setSimParams({ ...simParams, speed: parseFloat(e.target.value) })}
                                className="w-full accent-primary bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none h-2 cursor-pointer"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <label>Agent Count</label>
                                <span>{simParams.count}</span>
                            </div>
                            <input
                                type="range" min="10" max="200" step="10"
                                value={simParams.count}
                                onChange={(e) => setSimParams({ ...simParams, count: parseInt(e.target.value) })}
                                className="w-full accent-primary bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none h-2 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 p-4 bg-gray-50 dark:bg-surface/30 rounded-lg border border-gray-200 dark:border-white/5 transition-colors duration-300">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Alignment (Direction)</label>
                            <input
                                type="range" min="0" max="3" step="0.1"
                                value={weights.alignment}
                                onChange={(e) => setWeights({ ...weights, alignment: parseFloat(e.target.value) })}
                                className="w-full accent-primary bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none h-2 cursor-pointer"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">Steer towards average heading of local flockmates. Moves the group as a unified entity.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cohesion (Grouping)</label>
                            <input
                                type="range" min="0" max="3" step="0.1"
                                value={weights.cohesion}
                                onChange={(e) => setWeights({ ...weights, cohesion: parseFloat(e.target.value) })}
                                className="w-full accent-primary bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none h-2 cursor-pointer"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">Steer towards average position of flockmates. Keeps the group together.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Separation (Spacing)</label>
                            <input
                                type="range" min="0" max="3" step="0.1"
                                value={weights.separation}
                                onChange={(e) => setWeights({ ...weights, separation: parseFloat(e.target.value) })}
                                className="w-full accent-primary bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none h-2 cursor-pointer"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">Steer to avoid crowding local flockmates. Prevents collisions.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlockingSimulation;
