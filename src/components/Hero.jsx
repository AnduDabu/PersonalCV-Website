import { TypeAnimation } from 'react-type-animation';
import ParticlesBackground from './ParticlesBackground';
import { ChevronDown, Github, Linkedin, Mail, Phone } from 'lucide-react';

const Hero = () => {
    return (
        <div className="relative h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center px-4 overflow-hidden">
            {/* Interactive Particles Background */}
            <ParticlesBackground />

            {/* Background Gradient Effect - reduced opacity to let particles shine */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

            {/* Profile Photo */}
            <div className="relative mb-8 group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-primary/50 shadow-[0_0_30px_rgba(20,184,166,0.3)] transition-transform duration-300 group-hover:scale-105">
                    <img src="/profile.jpg?v=1" alt="Alexandru Dabu" className="w-full h-full object-cover" />
                </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                Alexandru <span className="text-primary">Dabu</span>
            </h1>

            <div className="text-2xl md:text-3xl text-gray-800 dark:text-gray-300 mb-8 font-light h-[40px]">
                <TypeAnimation
                    sequence={[
                        'Software Engineer',
                        1000,
                        'AI Enthusiast',
                        1000,
                        'Automation & Computer Science Engineer',
                        2000,
                    ]}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                />
            </div>

            <p className="max-w-2xl text-lg text-gray-700 dark:text-gray-400 mb-8 leading-relaxed transition-colors">
                Passionate about crafting AI/ML-driven automation solutions.
                Bridging the gap between hardware and software to build intelligent systems that scale.
            </p>

            <div className="mb-10">
                <a
                    href="/Alexandru_Dabu_CV.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-primary hover:bg-secondary text-white rounded-full font-bold transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-1 inline-flex items-center gap-2"
                >
                    Download CV
                </a>
            </div>

            <div className="flex gap-6 mb-16">
                <a href="https://github.com/AnduDabu" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full hover:bg-surface border border-transparent hover:border-primary/50 transition-all group" aria-label="GitHub">
                    <Github className="w-6 h-6 text-gray-700 dark:text-gray-400 group-hover:text-primary transition-colors" />
                </a>
                <a href="https://www.linkedin.com/in/alexandru-dabu" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full hover:bg-surface border border-transparent hover:border-primary/50 transition-all group" aria-label="LinkedIn">
                    <Linkedin className="w-6 h-6 text-gray-700 dark:text-gray-400 group-hover:text-primary transition-colors" />
                </a>
                <a href="mailto:alexandru.dabu123@gmail.com" className="p-3 rounded-full hover:bg-surface border border-transparent hover:border-primary/50 transition-all group" aria-label="Email">
                    <Mail className="w-6 h-6 text-gray-700 dark:text-gray-400 group-hover:text-primary transition-colors" />
                </a>
                <a href="tel:+40756517830" className="p-3 rounded-full hover:bg-surface border border-transparent hover:border-primary/50 transition-all group" aria-label="Phone">
                    <Phone className="w-6 h-6 text-gray-700 dark:text-gray-400 group-hover:text-primary transition-colors" />
                </a>
            </div>

            <div className="absolute bottom-10 animate-bounce">
                <ChevronDown className="w-8 h-8 text-primary" />
            </div>
        </div>
    );
};

export default Hero;
