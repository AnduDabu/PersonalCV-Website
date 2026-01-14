import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description }) => {
    return (
        <Helmet>
            <title>{title} | Alexandru Dabu</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={`${title} | Alexandru Dabu`} />
            <meta property="og:description" content={description} />
            <meta property="twitter:title" content={`${title} | Alexandru Dabu`} />
            <meta property="twitter:description" content={description} />
        </Helmet>
    );
};

export default SEO;
