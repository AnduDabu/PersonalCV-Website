import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description }) => {
    return (
        <Helmet>
            <title>{title} | Alexandru Dabu</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={`${title} | Alexandru Dabu`} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content="https://alexandrudabu.com/og-image.png" />
            <meta property="og:type" content="website" />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={`${title} | Alexandru Dabu`} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content="https://alexandrudabu.com/og-image.png" />
        </Helmet>
    );
};

export default SEO;
