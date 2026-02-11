import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({ 
  title = 'RYŪKAMI | Streetwear con Espíritu de Dragón', 
  description = 'Descubre la colección exclusiva de RYŪKAMI. Streetwear premium inspirado en la cultura urbana y tradicional japonesa. Envíos a todo el Perú.',
  image = 'https://ryukami.store/og-banner.jpg', // Cambiar por URL real del sitio
  url = 'https://ryukami.store',
  type = 'website'
}: SEOProps) {
  const siteTitle = title.includes('RYŪKAMI') ? title : `${title} | RYŪKAMI`;

  return (
    <Helmet>
      {/* Metadatos Estándar */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
