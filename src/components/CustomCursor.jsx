import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

// Visible only under the media query in index.css (.custom-cursor): wide viewport, a
// fine pointer, and no reduced-motion preference. The listeners are skipped otherwise.
const ACTIVE_QUERY = '(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

const CustomCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [isHovering, setIsHovering] = useState(false);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        if (!window.matchMedia(ACTIVE_QUERY).matches) return undefined;

        const moveCursor = (e) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            const isClickable =
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.style.cursor === 'pointer';
            setIsHovering(!!isClickable);
        };

        window.addEventListener('mousemove', moveCursor, { passive: true });
        window.addEventListener('mouseover', handleMouseOver, { passive: true });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [cursorX, cursorY]);

    return (
        <>
            <motion.div
                aria-hidden="true"
                className="custom-cursor fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-primary pointer-events-none z-[9999]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    scale: isHovering ? 1.5 : 1,
                    backgroundColor: isHovering ? 'rgba(var(--color-primary), 0.2)' : 'transparent',
                }}
            />
            <motion.div
                aria-hidden="true"
                className="custom-cursor fixed top-0 left-0 w-2 h-2 rounded-full bg-primary pointer-events-none z-[9999]"
                style={{
                    x: cursorX, // Direct tracking for dot
                    y: cursorY,
                    translateX: 12,
                    translateY: 12
                }}
            />
        </>
    );
};

export default CustomCursor;
