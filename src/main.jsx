import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

// Inter, self-hosted. Only the latin subset is downloaded thanks to unicode-range.
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/inter/latin-ext-400.css'
import '@fontsource/inter/latin-ext-500.css'
import '@fontsource/inter/latin-ext-600.css'
import '@fontsource/inter/latin-ext-700.css'

// After a deploy, a tab that still holds the old index.html asks for page chunks whose
// hashes no longer exist. Pages answers those with the HTML shell, the import fails, and
// Vite fires this event. Reload once to pick up the new index.html; the session flag
// prevents a reload loop if the chunk is genuinely missing.
window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    try {
        if (sessionStorage.getItem('chunk-reload')) return;
        sessionStorage.setItem('chunk-reload', '1');
    } catch { /* storage unavailable: still reload */ }
    window.location.reload();
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <HelmetProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </HelmetProvider>
        </ErrorBoundary>
    </React.StrictMode>,
)
