import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AppScreensCarousel = ({ images }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative group">
            {/* Scroll Buttons */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-4 py-4 px-2 scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {images.map((img, index) => (
                    <div
                        key={index}
                        className="flex-none w-[200px] md:w-[250px] snap-center shrink-0 transition-transform hover:scale-105"
                    >
                        <img
                            src={img}
                            alt={`App Screenshot ${index + 1}`}
                            className="w-full h-auto rounded-xl border border-white/10 shadow-lg"
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AppScreensCarousel;
