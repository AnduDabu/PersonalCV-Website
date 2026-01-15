import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();
    const action = useNavigationType();

    useEffect(() => {
        // Handle hash scrolling with retry logic
        if (hash) {
            const id = hash.replace('#', '');
            const attemptScroll = (attempts = 0) => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                } else if (attempts < 5) { // Retry for ~500ms
                    setTimeout(() => attemptScroll(attempts + 1), 100);
                }
            };
            attemptScroll();
        }
        // Only scroll to top if NO hash and standard navigation
        else if (action !== 'POP') {
            window.scrollTo(0, 0);
        }
    }, [pathname, hash, action]);

    return null;
};

export default ScrollToTop;
