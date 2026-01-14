import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoPlayer from './VideoPlayer';

const FeatureShowcase = ({ groups }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="space-y-4">
            {groups.map((group, index) => (
                <FeatureAccordionItem
                    key={index}
                    group={group}
                    isActive={index === activeIndex}
                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                />
            ))}
        </div>
    );
};

const FeatureAccordionItem = ({ group, isActive, onClick }) => {
    return (
        <motion.div
            layout
            initial={false}
            onClick={onClick}
            className={`rounded-2xl border transition-colors cursor-pointer overflow-hidden ${isActive
                ? 'bg-surface/50 border-primary/50 shadow-2xl ring-1 ring-primary/20'
                : 'bg-surface/20 border-white/5 hover:bg-surface/30'
                }`}
        >
            {/* Header */}
            <motion.div layout className="p-6 flex items-center justify-between">
                <h3 className={`text-xl font-bold transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                    {group.title}
                </h3>
                <div className={`p-2 rounded-full transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-500'}`}>
                    <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'rotate-90' : ''}`} />
                </div>
            </motion.div>

            {/* Expanded Content */}
            <AnimatePresence initial={false}>
                {isActive && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 pb-8 pt-2 cursor-default" onClick={(e) => e.stopPropagation()}>
                            <FeatureGroupContent items={group.items} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Renamed for clarity, logic remains similar but streamlined for the new layout
const FeatureGroupContent = ({ items }) => {
    const scrollRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);

    // Auto-sort videos to the beginning
    const sortedItems = [...items].sort((a, b) => {
        if (a.type === 'video' && b.type !== 'video') return -1;
        if (a.type !== 'video' && b.type === 'video') return 1;
        return 0;
    });

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -350 : 350;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <>
            <div className="relative group/carousel">
                {/* Scroll Buttons */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white p-3 rounded-r-xl opacity-0 group-hover/carousel:opacity-100 transition-opacity disabled:opacity-0 backdrop-blur-sm"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white p-3 rounded-l-xl opacity-0 group-hover/carousel:opacity-100 transition-opacity disabled:opacity-0 backdrop-blur-sm"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Items Container */}
                <motion.div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 py-4 px-2 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {sortedItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="flex-none snap-center flex flex-col gap-3"
                            style={{ width: item.width || (item.type === 'video' ? '300px' : '260px') }}
                        >
                            {/* Media Container */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="rounded-xl overflow-hidden border border-white/10 shadow-lg bg-surface/50 relative hover:border-primary hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300"
                            >
                                {item.type === 'video' ? (
                                    <VideoPlayer
                                        src={item.src}
                                        aspectRatio={item.aspectRatio || "aspect-[9/16]"}
                                        objectFit={item.objectFit}
                                    />
                                ) : (
                                    <div
                                        onClick={() => setSelectedImage(item.src)}
                                        className="cursor-zoom-in group/image overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors z-10" />
                                        <img
                                            src={item.src}
                                            alt={item.caption}
                                            className={`w-full h-auto object-cover ${item.aspectRatio || "aspect-[9/16]"}`}
                                            loading="lazy"
                                        />
                                    </div>
                                )}
                            </motion.div>

                            {/* Caption */}
                            <div className="bg-surface/30 p-3 rounded-lg border border-white/5 backdrop-blur-sm">
                                <p className="text-sm font-medium text-center text-gray-700 dark:text-gray-300">
                                    {item.caption}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(null);
                            }}
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={selectedImage}
                            alt="Full View"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default FeatureShowcase;
