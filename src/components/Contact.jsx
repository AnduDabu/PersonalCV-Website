import React, { useRef, useState } from 'react';
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';

// ----------------------------------------------------
// 🔐 EMAILJS CONFIGURATION
// ----------------------------------------------------
const SERVICE_ID = 'service_y36z8s9';
const TEMPLATE_ID = 'template_0kbtsud';
const PUBLIC_KEY = '25qsN1sMMN-7a62Do';

const Contact = () => {
    const formRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle | success | error

    const sendEmail = (e) => {
        e.preventDefault();
        setIsLoading(true);

        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
            .then((result) => {
                console.log(result.text);
                setStatus('success');
                setIsLoading(false);
                e.target.reset(); // Clear form
                setTimeout(() => setStatus('idle'), 5000); // Reset status after 5s
            }, (error) => {
                console.log(error.text);
                setStatus('error');
                setIsLoading(false);
                setTimeout(() => setStatus('idle'), 5000);
            });
    };

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
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            Let's Connect
                        </h3>
                        <p className="text-gray-400 text-lg leading-relaxed">
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

                {/* Right Side: Interactive Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-surface/30 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden"
                >
                    <form ref={formRef} onSubmit={sendEmail} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-600"
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-600"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Message</label>
                            <textarea
                                name="message"
                                required
                                rows="4"
                                className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none placeholder:text-gray-600"
                                placeholder="Hello! I'd like to discuss..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || status === 'success'}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all 
                                ${status === 'success'
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                    : status === 'error'
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                                        : 'bg-primary hover:bg-secondary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40'
                                } disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {isLoading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                            ) : status === 'success' ? (
                                <><CheckCircle2 className="w-5 h-5" /> Message Sent!</>
                            ) : status === 'error' ? (
                                <><AlertCircle className="w-5 h-5" /> Failed. Try again.</>
                            ) : (
                                <><Send className="w-5 h-5" /> Send Message</>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

// Helper Component for consistent styling
const ContactItem = ({ icon, text, href }) => (
    <div className="flex items-center gap-6 group">
        <div className="w-12 h-12 rounded-2xl bg-surface border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300 shadow-lg shadow-black/20">
            {React.cloneElement(icon, { className: "w-6 h-6" })}
        </div>
        {href ? (
            <a href={href} className="text-lg text-gray-300 hover:text-white transition-colors">
                {text}
            </a>
        ) : (
            <span className="text-lg text-gray-300">{text}</span>
        )}
    </div>
);

export default Contact;
