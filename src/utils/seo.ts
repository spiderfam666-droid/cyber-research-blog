import { SITE } from '../consts';
import { assetUrl } from './assets';

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  type?: 'website' | 'article';
  pubDate?: Date;
  author?: string;
  tags?: string[];
}

export function getCanonicalUrl(path: string): string {
  const base = SITE.url.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function getPageTitle(title?: string): string {
  if (!title) return SITE.title;
  return `${title} | ${SITE.author}`;
}

export function getOgImage(image?: string): string {
  if (!image) return assetUrl(SITE.ogImage) ?? SITE.url;
  if (image.startsWith('http')) return image;
  return assetUrl(image) ?? `${SITE.url}/${image}`;
}

export function buildArticleJsonLd(props: {
  title: string;
  description: string;
  url: string;
  pubDate: Date;
  author: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: props.title,
    description: props.description,
    url: props.url,
    datePublished: props.pubDate.toISOString(),
    author: {
      '@type': 'Person',
      name: props.author,
      url: SITE.url,
    },
    publisher: {
      '@type': 'Person',
      name: SITE.author,
    },
    image: props.image ? getOgImage(props.image) : getOgImage(),
  };
}

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.title,
    description: SITE.description,
    url: SITE.url,
    author: {
      '@type': 'Person',
      name: SITE.author,
    },
  };
}
