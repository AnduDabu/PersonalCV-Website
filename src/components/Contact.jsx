import React, { useEffect, useRef, useState } from 'react';
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// The form posts to the Pages Function in functions/api/contact.js, which verifies a
// Cloudflare Turnstile token and forwards to EmailJS with the private key. Nothing
// secret lives in this file: the Turnstile *site* key is public by design.
//
// VITE_TURNSTILE_SITE_KEY is a build-time variable (Pages > Settings > Variables and
// Secrets, set for Production and Preview). Without it the Cloudflare test key is used,
// which renders a widget that always passes; the Function only accepts it if
// TURNSTILE_SECRET is the matching test secret, so a forgotten key fails closed.
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let turnstileLoader = null;
const loadTurnstile = () => {
    if (window.turnstile) return Promise.resolve(window.turnstile);
    if (!turnstileLoader) {
        turnstileLoader = new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = TURNSTILE_SRC;
            s.async = true;
            s.onload = () => resolve(window.turnstile);
            s.onerror = () => {
                turnstileLoader = null;
                reject(new Error('Turnstile failed to load'));
            };
            document.head.appendChild(s);
        });
    }
    return turnstileLoader;
};

const ERROR_TEXT = {
    not_configured: 'The form is not set up yet. Please email me directly.',
    captcha_failed: 'Verification failed. Please try again.',
    captcha_missing: 'Please complete the verification first.',
    invalid_email: 'That email address does not look right.',
    invalid_message: 'The message is too short.',
};

const Contact = () => {
    const formRef = useRef(null);
    const widgetRef = useRef(null);
    const widgetIdRef = useRef(null);
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle | success | error
    const [errorText, setErrorText] = useState('');

    // Render the Turnstile widget once the section mounts.
    useEffect(() => {
        let cancelled = false;
        loadTurnstile()
            .then((turnstile) => {
                if (cancelled || !widgetRef.current || widgetIdRef.current !== null) return;
                widgetIdRef.current = turnstile.render(widgetRef.current, {
                    sitekey: TURNSTILE_SITE_KEY,
                    theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
                    callback: (t) => setToken(t),
                    'expired-callback': () => setToken(''),
                    'error-callback': () => setToken(''),
                });
            })
            .catch((e) => console.error(e));
        return () => {
            cancelled = true;
            if (widgetIdRef.current !== null && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        };
    }, []);

    const resetWidget = () => {
        setToken('');
        if (widgetIdRef.current !== null && window.turnstile) window.turnstile.reset(widgetIdRef.current);
    };

    const showStatus = (next, text = '') => {
        setStatus(next);
        setErrorText(text);
        setTimeout(() => {
            setStatus('idle');
            setErrorText('');
        }, 5000);
    };

    const sendEmail = async (e) => {
        e.preventDefault();
        if (isLoading) return;
        const data = new FormData(formRef.current);
        const payload = {
            name: data.get('name'),
            email: data.get('email'),
            message: data.get('message'),
            website: data.get('website'), // honeypot, empty for humans
            token,
        };
        if (!token) {
            showStatus('error', ERROR_TEXT.captcha_missing);
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const body = await res.json().catch(() => ({}));
            if (res.ok && body.ok) {
                formRef.current.reset();
                showStatus('success');
            } else {
                showStatus('error', ERROR_TEXT[body.error] || 'Sending failed. Please try again.');
            }
        } catch {
            showStatus('error', 'Network error. Please try again.');
        } finally {
            setIsLoading(false);
            resetWidget(); // tokens are single-use
        }
    };

    const inputClass =
        'w-full bg-background/50 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600';

    return (
        <section className="max-w-6xl mx-auto px-4" id="contact">
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">
                Get In <span className="text-primary">Touch</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Left Side: Contact Info */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-12"
                >
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Let's Connect</h3>
                        <p className="text-gray-700 dark:text-gray-400 text-lg leading-relaxed">
                            I'm currently open to new opportunities and collaborations.
                            Whether you have a question about my projects or just want to say hi,
                            I'll try my best to get back to you!
                        </p>
                    </div>

                    <div className="space-y-6">
                        <ContactItem icon={<Mail />} text="contact@alexandrudabu.com" href="mailto:contact@alexandrudabu.com" />
                        <ContactItem icon={<Phone />} text="+40 756 517 830" href="tel:+40756517830" />
                        <ContactItem icon={<MapPin />} text="Bucharest, Romania" />
                    </div>

                    {/* Decorative Blob */}
                    <div className="absolute left-0 bottom-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
                </motion.div>

                {/* Right Side: Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-surface/30 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 dark:border-white/10 shadow-2xl relative overflow-hidden"
                >
                    <form ref={formRef} onSubmit={sendEmail} className="space-y-6 relative z-10" noValidate={false}>
                        <div className="space-y-2">
                            <label htmlFor="contact-name" className="text-sm font-medium text-gray-600 dark:text-gray-400 ml-1">Name</label>
                            <input id="contact-name" type="text" name="name" required maxLength={200} autoComplete="name" className={inputClass} placeholder="John Doe" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="contact-email" className="text-sm font-medium text-gray-600 dark:text-gray-400 ml-1">Email</label>
                            <input id="contact-email" type="email" name="email" required maxLength={320} autoComplete="email" className={inputClass} placeholder="john@example.com" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="contact-message" className="text-sm font-medium text-gray-600 dark:text-gray-400 ml-1">Message</label>
                            <textarea id="contact-message" name="message" required minLength={5} maxLength={5000} rows="4" className={`${inputClass} resize-none`} placeholder="Hello! I'd like to discuss..." />
                        </div>

                        {/* Honeypot: hidden from people, filled by naive bots. */}
                        <div className="hidden" aria-hidden="true">
                            <label htmlFor="contact-website">Website</label>
                            <input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
                        </div>

                        <div ref={widgetRef} className="min-h-[65px]" />

                        <button
                            type="submit"
                            disabled={isLoading || status === 'success'}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                                ${status === 'success'
                                    ? 'bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/50'
                                    : status === 'error'
                                        ? 'bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/50'
                                        : 'bg-primary hover:bg-secondary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40'
                                } disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {isLoading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> Sending...</>
                            ) : status === 'success' ? (
                                <><CheckCircle2 className="w-5 h-5" aria-hidden="true" /> Message Sent!</>
                            ) : status === 'error' ? (
                                <><AlertCircle className="w-5 h-5" aria-hidden="true" /> Failed. Try again.</>
                            ) : (
                                <><Send className="w-5 h-5" aria-hidden="true" /> Send Message</>
                            )}
                        </button>
                        <p role="status" aria-live="polite" className="text-sm text-red-600 dark:text-red-400 min-h-[1.25rem]">
                            {status === 'error' ? errorText : ''}
                        </p>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

const ContactItem = ({ icon, text, href }) => (
    <div className="flex items-center gap-6 group">
        <div className="w-12 h-12 rounded-2xl bg-surface border border-gray-200 dark:border-white/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300 shadow-lg shadow-black/10 dark:shadow-black/20">
            {React.cloneElement(icon, { className: 'w-6 h-6', 'aria-hidden': true })}
        </div>
        {href ? (
            <a href={href} className="text-lg text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">
                {text}
            </a>
        ) : (
            <span className="text-lg text-gray-700 dark:text-gray-300">{text}</span>
        )}
    </div>
);

export default Contact;
