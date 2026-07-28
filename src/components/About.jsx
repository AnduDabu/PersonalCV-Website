import React from 'react';
import { Code, Cpu, Workflow, Globe } from 'lucide-react';

const About = () => {
    return (
        <section className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-20 text-center">About <span className="text-primary">Me</span></h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Image / Visual Side */}
                <div className="relative">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-surface/50 border border-white/5 relative z-10 group">
                        <img
                            src="/profile.jpg?v=1"
                            alt="Alexandru Dabu"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl -z-10"></div>
                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-2xl -z-10"></div>
                </div>

                {/* Content Side */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Building Intelligent Systems with <span className="text-primary">Passion</span> & <span className="text-primary">Precision</span>
                    </h3>

                    <p className="text-gray-700 dark:text-gray-400 leading-relaxed text-lg">
                        I am a graduate in <strong>Automation and Computer Engineering</strong>, currently working as a <strong>Python developer within an actuarial team</strong> at Allianz Services, building the internal software behind <strong>IFRS 17</strong> and <strong>Solvency II</strong> reporting.
                    </p>

                    <p className="text-gray-700 dark:text-gray-400 leading-relaxed text-lg">
                        My work is about turning manual, repetitive processes into reliable automated workflows — from data pipelines and Excel reporting to cloud-orchestrated financial model runs. Alongside this, I freelance on full-stack web applications and automation for small businesses.
                    </p>

                    <p className="text-gray-700 dark:text-gray-400 leading-relaxed text-lg">
                        That sits on top of hands-on experience ranging from hardware, low-level programming, and robotics to advanced control design, computer vision, and cross-platform mobile development. I am a curious and adaptable engineer who enjoys bringing ideas to life—whether that means architecting a full-stack application or fine-tuning a model.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="p-4 rounded-xl bg-surface border border-white/5 hover:border-primary/20 transition-colors">
                            <Workflow className="w-8 h-8 text-primary mb-2" />
                            <h4 className="font-bold">Automation & Data</h4>
                        </div>
                        <div className="p-4 rounded-xl bg-surface border border-white/5 hover:border-primary/20 transition-colors">
                            <Globe className="w-8 h-8 text-primary mb-2" />
                            <h4 className="font-bold">Full-Stack Web</h4>
                        </div>
                        <div className="p-4 rounded-xl bg-surface border border-white/5 hover:border-primary/20 transition-colors">
                            <Cpu className="w-8 h-8 text-primary mb-2" />
                            <h4 className="font-bold">AI & Computer Vision</h4>
                        </div>
                        <div className="p-4 rounded-xl bg-surface border border-white/5 hover:border-primary/20 transition-colors">
                            <Code className="w-8 h-8 text-primary mb-2" />
                            <h4 className="font-bold">Software Development</h4>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default About;
