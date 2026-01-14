import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const action = useNavigationType();

    useEffect(() => {
        // Only scroll to top if the navigation is a PUSH (new page) or REPLACE
        // If it's POP (back button), let the browser handle scroll restoration
        if (action !== 'POP') {
            window.scrollTo(0, 0);
        }
    }, [pathname, action]);

    return null;
};

export default ScrollToTop;
