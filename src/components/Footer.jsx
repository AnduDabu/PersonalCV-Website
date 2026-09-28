import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-surface/30 border-t border-white/5 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                    {/* Copyright & Branding */}
                    <div className="text-center md:text-left">
                        <p className="text-xl font-bold mb-2">Alexandru <span className="text-primary">Dabu</span></p>
                        <p className="text-gray-700 dark:text-gray-400 text-sm">
                            © {new Date().getFullYear()} All rights reserved.
                        </p>
                    </div>

                    {/* Quick Socials */}
                    <div className="flex gap-6">
                        <a href="https://github.com/AnduDabu" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-gray-700 dark:text-gray-400 hover:text-primary transition-colors">
                            <Github className="w-5 h-5" aria-hidden="true" />
                        </a>
                        <a href="https://www.linkedin.com/in/alexandru-dabu" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-700 dark:text-gray-400 hover:text-primary transition-colors">
                            <Linkedin className="w-5 h-5" aria-hidden="true" />
                        </a>
                        <a href="mailto:contact@alexandrudabu.com" aria-label="Email" className="text-gray-700 dark:text-gray-400 hover:text-primary transition-colors">
                            <Mail className="w-5 h-5" aria-hidden="true" />
                        </a>
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-700 dark:text-gray-400 text-xs">
                    Built with <span className="text-primary font-bold">React</span> & <span className="text-primary font-bold">Tailwind CSS</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
