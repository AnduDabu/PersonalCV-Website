// Single source of truth for per-route <title>/description/canonical.
// Used at runtime by SEO.jsx and at build time by scripts/inject-meta.mjs, which writes
// one static HTML file per route so link unfurlers (LinkedIn, WhatsApp, Slack, iMessage…)
// see the right tags without running JavaScript.
export const SITE_URL = 'https://www.alexandrudabu.com';
export const SITE_NAME = 'Alexandru Dabu';
export const OG_IMAGE = { path: '/og-image.png', width: 1200, height: 630, alt: 'Alexandru Dabu, Python and automation developer' };

export const ROUTES = {
    '/': {
        title: 'Alexandru Dabu | Portfolio',
        description: 'Alexandru Dabu - Python developer building automation for IFRS 17 and Solvency II reporting at Allianz Services, and full-stack web applications as a freelancer.',
    },
    '/project/basketball': {
        title: 'Basketball AI App | Alexandru Dabu',
        description: 'AI-powered Basketball Social Media App with shot analysis and real-time feedback.',
    },
    '/project/formation-control': {
        title: 'Formation Control | Alexandru Dabu',
        description: 'Multi-Agent Formation Control using decentralized consensus algorithms in Python.',
    },
    '/project/path-planning': {
        title: 'Path Planning | Alexandru Dabu',
        description: 'Advanced path planning in hazardous environments using optimization algorithms.',
    },
    '/playground': {
        title: 'Interactive Playground | Alexandru Dabu',
        description: 'Interactive tech demos showcasing Flocking Simulation (Boids) and Pathfinding (A*) algorithms.',
    },
};
