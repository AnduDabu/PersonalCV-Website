import React from 'react';
import { Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSound } from './SoundProvider';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const { soundEnabled, toggleSound, playClick } = useSound();

    const handleThemeToggle = () => {
        playClick();
        toggleTheme();
    };

    const handleSoundToggle = () => {
        // We don't play click here to avoid loop/confusion, or we can?
        // Let's play a click IF we are turning it ON (it will play effectively)
        // actually playClick checks soundEnabled, so if we toggle first, it might not be updated in closure immediately?
        // Let's just toggle.
        toggleSound();
        if (!soundEnabled) { // If we are enabling it
            // Force play a feedback sound?
            // playClick() might use the old state value due to closure if not careful, but context updates.
            setTimeout(() => playClick(), 50);
        }
    };

    return (
        <div className="flex items-center gap-1 bg-surface/30 backdrop-blur-sm rounded-full p-1 border border-white/5">
            <button
                onClick={handleSoundToggle}
                className={`p-2 rounded-full transition-all duration-300 ${soundEnabled ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                aria-label="Toggle Sound"
                title={soundEnabled ? "Mute Sounds" : "Enable Sounds"}
            >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-0.5"></div>
            <button
                onClick={handleThemeToggle}
                className="p-2 rounded-full hover:bg-surface/50 transition-colors text-gray-800 dark:text-white hover:text-primary dark:hover:text-primary"
                aria-label="Toggle Theme"
            >
                <motion.div
                    initial={false}
                    animate={{ rotate: theme === 'dark' ? 360 : 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.div>
            </button>
        </div>
    );
};

export default ThemeToggle;
