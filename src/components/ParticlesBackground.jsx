import React, { useRef, useEffect } from 'react';

const ParticlesBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const particleCount = Math.min(Math.floor(window.innerWidth * window.innerHeight / 20000), 50);

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1,
                });
            }
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Use cached color value
            const particleColor = isDarkRef.current ? 'rgba(255, 255, 255, 0.5)' : 'rgba(20, 184, 166, 0.5)';

            particles.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.fill();

                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;

                    // Quick check to avoid expensive sqrt
                    if (Math.abs(dx) > 110 || Math.abs(dy) > 110) continue;

                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 110) {
                        ctx.beginPath();
                        ctx.strokeStyle = isDarkRef.current
                            ? `rgba(255, 255, 255, ${0.1 * (1 - distance / 110)})`
                            : `rgba(20, 184, 166, ${0.15 * (1 - distance / 110)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(drawParticles);
        };

        // Theme observer
        const isDarkRef = { current: document.documentElement.classList.contains('dark') };
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    isDarkRef.current = document.documentElement.classList.contains('dark');
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        drawParticles();

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };


    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-60"
        />
    );
};

export default ParticlesBackground;
