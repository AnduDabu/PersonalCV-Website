import React from 'react';

// Catches render errors below it so a bug in one page shows a message instead of a blank
// screen. Class component because React has no hook equivalent for componentDidCatch.
class ErrorBoundary extends React.Component {
    state = { error: null };

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.error('Render error', error, info);
    }

    render() {
        if (!this.state.error) return this.props.children;
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24">
                <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                    The page hit an error while rendering. Reloading usually fixes it.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 rounded-full bg-primary text-white font-bold hover:bg-secondary transition-colors"
                >
                    Reload
                </button>
            </div>
        );
    }
}

export default ErrorBoundary;
