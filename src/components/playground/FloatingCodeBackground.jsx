import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const codeSnippets = [
    '{ }', '=>', '</>', '01', '[]', '&&', '||',
    'func', 'ret', 'if', 'for', 'var', 'let',
    '0', '1', 'x', 'i', 'y', '*', ';',
    'print', 'void', 'null', 'NaN'
];

const FloatingCodeBackground = () => {
    const [elements, setElements] = useState([]);

    useEffect(() => {
        // Generate random elements only on client side to match hydration
        const newElements = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
            left: Math.random() * 100,
            duration: 15 + Math.random() * 20,
            delay: Math.random() * 5,
            scale: 0.5 + Math.random() * 0.5,
            opacity: 0.1 + Math.random() * 0.2
        }));
        setElements(newElements);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
            {elements.map((el) => (
                <motion.div
                    key={el.id}
                    className="absolute text-primary font-mono font-bold"
                    style={{
                        left: `${el.left}%`,
                        fontSize: `${1 + Math.random()}rem`,
                    }}
                    initial={{
                        y: '110vh',
                        opacity: 0,
                        rotate: 0
                    }}
                    animate={{
                        y: '-10vh',
                        opacity: [0, el.opacity, 0],
                        rotate: [0, Math.random() * 360]
                    }}
                    transition={{
                        duration: el.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: el.delay,
                        repeatDelay: Math.random() * 5
                    }}
                >
                    {el.text}
                </motion.div>
            ))}

            {/* Gradient Overlay to ensure readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background opacity-80" />
        </div>
    );
};

export default FloatingCodeBackground;
