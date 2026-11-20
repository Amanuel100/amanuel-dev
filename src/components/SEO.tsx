import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
export default function SEO({ title = 'Creative Web Developer', description = 'I build immersive, high-performance web experiences. Explore the work, process, and creative practice of Amanuel Eyob in Addis Ababa.' }: { title?: string; description?: string }) {
  const { pathname } = useLocation(); const site = (import.meta.env.VITE_SITE_URL as string | undefined) || 'https://amanueleyob.dev'; const fullTitle = `Amanuel Eyob — ${title}`;
  return <Helmet><title>{fullTitle}</title><meta name="description" content={description} /><link rel="canonical" href={`${site}${pathname}`} /><meta property="og:title" content={fullTitle} /><meta property="og:description" content={description} /><meta property="og:url" content={`${site}${pathname}`} /><meta property="og:type" content="website" /><meta property="og:image" content={`${site}/og-image.jpg`} /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content={fullTitle} /><meta name="twitter:description" content={description} /><meta name="twitter:image" content={`${site}/og-image.jpg`} /></Helmet>;
}
