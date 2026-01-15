import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const TiltCard = ({ children, className = "", ...props }) => {
    const ref = useRef(null);
    const rectRef = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smoother spring configuration
    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
    const mouseXSpring = useSpring(x, springConfig);
    const mouseYSpring = useSpring(y, springConfig);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseEnter = (e) => {
        // Cache rect on enter to avoid thrashing during move
        rectRef.current = ref.current.getBoundingClientRect();

        // Compose external handler
        props.onMouseEnter?.(e);
    };

    const handleMouseMove = (e) => {
        if (!rectRef.current) return;

        const rect = rectRef.current;
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);

        props.onMouseMove?.(e);
    };

    const handleMouseLeave = (e) => {
        x.set(0);
        y.set(0);
        rectRef.current = null;
        props.onMouseLeave?.(e);
    };

    // Filter props to separate event handlers from rest
    const { onMouseEnter, onMouseMove, onMouseLeave, style, ...restProps } = props;

    return (
        <motion.div
            ref={ref}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            {...restProps}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
                ...style
            }}
            className={className}
        >
            <div style={{ transform: "translateZ(30px)" }}>
                {children}
            </div>
        </motion.div>
    );
};

export default TiltCard;
