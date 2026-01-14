import React from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

const Contact = () => {
    return (
        <section className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Get In <span className="text-primary">Touch</span></h2>

            <div className="bg-surface/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Let's Connect</h3>
                            <p className="text-gray-700 dark:text-gray-400">
                                I'm currently open to new opportunities and collaborations.
                                Whether you have a question or just want to say hi, I'll try my best to get back to you!
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-gray-800 dark:text-gray-300">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <a href="mailto:alexandru.dabu123@gmail.com" className="hover:text-primary transition-colors">alexandru.dabu123@gmail.com</a>
                            </div>
                            <div className="flex items-center gap-4 text-gray-800 dark:text-gray-300">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <a href="tel:+40756517830" className="hover:text-primary transition-colors">+40 756 517 830</a>
                            </div>
                            <div className="flex items-center gap-4 text-gray-800 dark:text-gray-300">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <span>Bucharest, Romania</span>
                            </div>
                        </div>
                    </div>

                    {/* Simple Action Box */}
                    <div className="flex flex-col justify-center items-center bg-background/50 rounded-2xl p-6 border border-white/5 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/25 animate-pulse">
                            <Send className="w-8 h-8 text-white ml-1" />
                        </div>
                        <h4 className="text-lg font-bold mb-2">Ready to Start?</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-500 mb-6">Send me an email directly and let's discuss how we can work together.</p>

                        <a
                            href="mailto:alexandru.dabu123@gmail.com"
                            className="w-full py-3 bg-primary hover:bg-secondary text-white rounded-xl font-bold transition-all shadow-md hover:shadow-xl"
                        >
                            Send Message
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
