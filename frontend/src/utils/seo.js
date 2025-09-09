import React from 'react';
import { Helmet } from 'react-helmet';

export const SEO = ({ title, description, canonical }) => (
  <Helmet>
    {title && <title>{title}</title>}
    {description && <meta name="description" content={description} />}
    {canonical && <link rel="canonical" href={canonical} />}
  </Helmet>
);
