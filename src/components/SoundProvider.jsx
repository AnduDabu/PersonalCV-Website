import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const SoundContext = createContext();

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
};

export const SoundProvider = ({ children }) => {
    const [soundEnabled, setSoundEnabled] = useState(false);
    const audioContextRef = useRef(null);

    // Initialize AudioContext lazily and reuse it
    const getAudioContext = () => {
        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioContextRef.current = new AudioContext();
            }
        }
        // Resume if suspended (browser autoplay policy)
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume().catch(e => console.log('Audio resume failed', e));
        }
        return audioContextRef.current;
    };

    // Load preference from local storage
    useEffect(() => {
        const saved = localStorage.getItem('soundEnabled');
        if (saved !== null) {
            setSoundEnabled(JSON.parse(saved));
        }
    }, []);

    const toggleSound = () => {
        setSoundEnabled(prev => {
            const newState = !prev;
            localStorage.setItem('soundEnabled', JSON.stringify(newState));
            if (newState) {
                // Initialize context immediately when enabled to be ready
                getAudioContext();
            }
            return newState;
        });
    };

    const playTone = useCallback((freqStart, freqEnd, duration, volStart, volEnd, type = 'sine') => {
        if (!soundEnabled) return;

        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = type;

            const now = ctx.currentTime;

            // Frequency Ramp
            osc.frequency.setValueAtTime(freqStart, now);
            osc.frequency.exponentialRampToValueAtTime(freqEnd, now + duration);

            // Volume Envelope
            gain.gain.setValueAtTime(volStart, now);
            gain.gain.linearRampToValueAtTime(volEnd, now + duration * 0.1); // Attack
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);   // Release

            osc.start(now);
            osc.stop(now + duration + 0.1);

            // Cleanup nodes (optional but good practice)
            setTimeout(() => {
                try {
                    osc.disconnect();
                    gain.disconnect();
                } catch (e) {
                    // Ignore disconnect errors
                }
            }, (duration * 1000) + 200);

        } catch (e) {
            console.error("Audio playback error", e);
        }
    }, [soundEnabled]);

    const playClick = useCallback(() => {
        // Softer "bubble" pop sound: 600Hz -> 300Hz, 150ms
        playTone(600, 300, 0.15, 0, 0.15);
    }, [playTone]);

    const playHover = useCallback(() => {
        // Very subtle high tick: 400Hz static, 50ms, low volume
        playTone(400, 400, 0.05, 0, 0.05);
    }, [playTone]);

    return (
        <SoundContext.Provider value={{ soundEnabled, toggleSound, playClick, playHover }}>
            {children}
        </SoundContext.Provider>
    );
};

export default SoundProvider;
