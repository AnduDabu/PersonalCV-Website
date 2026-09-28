import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { ROUTES, SITE_URL, SITE_NAME, OG_IMAGE } from '../routesMeta';

// Runtime <head> tags. The same values are baked into per-route static HTML at build time
// by scripts/inject-meta.mjs, so crawlers that skip JavaScript see them too. Both read
// src/routesMeta.js; edit titles and descriptions there, not here.
//
// Canonical is always the www host: the apex serves the same content, and without a
// canonical search engines would split ranking between the two hostnames.
const SEO = ({ title, description, noindex = false }) => {
    const { pathname } = useLocation();
    const meta = ROUTES[pathname] || {};
    const fullTitle = title ? `${title} | ${SITE_NAME}` : meta.title || `${SITE_NAME} | Portfolio`;
    const desc = description || meta.description || '';
    const canonical = `${SITE_URL}${pathname}`;
    const image = `${SITE_URL}${OG_IMAGE.path}`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={desc} />
            <link rel="canonical" href={canonical} />
            {noindex && <meta name="robots" content="noindex" />}

            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:locale" content="en_US" />
            <meta property="og:url" content={canonical} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={desc} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content={String(OG_IMAGE.width)} />
            <meta property="og:image:height" content={String(OG_IMAGE.height)} />
            <meta property="og:image:alt" content={OG_IMAGE.alt} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={desc} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEO;
