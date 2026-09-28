import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const NotFound = () => (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24">
        <SEO title="Page not found" description="This page does not exist." noindex />
        <p className="text-primary font-mono text-sm mb-4">404</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Page not found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
            The address you followed does not exist on this site.
        </p>
        <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold hover:bg-secondary transition-colors"
        >
            <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
    </div>
);

export default NotFound;
