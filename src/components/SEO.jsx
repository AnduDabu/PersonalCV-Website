import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

// The site answers on both alexandrudabu.com and www.alexandrudabu.com, since the apex
// is a Pages custom domain rather than a redirect. Without a canonical URL, search
// engines index the two hostnames as separate sites and split the ranking signals
// between them. www is the canonical host — it is what the CV prints and what every
// outbound link uses.
const SITE_URL = 'https://www.alexandrudabu.com';

const SEO = ({ title, description }) => {
    const { pathname } = useLocation();
    const canonical = `${SITE_URL}${pathname}`;
    const fullTitle = `${title} | Alexandru Dabu`;
    const image = `${SITE_URL}/og-image.png`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonical} />

            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonical} />
            <meta property="og:image" content={image} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Alexandru Dabu" />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:url" content={canonical} />
            <meta property="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEO;
