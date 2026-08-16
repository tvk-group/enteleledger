#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const robots = readFileSync(new URL('../robots.txt', import.meta.url), 'utf8');
const sitemap = readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8');
const origin = 'https://www.enteleledger.com/';
const required = [
  '<link rel="canonical" href="' + origin + '"',
  '<meta property="og:url" content="' + origin + '"',
  '<meta name="twitter:card" content="summary_large_image"',
  '<meta name="twitter:title"',
  '<meta name="twitter:description"',
  '<meta name="twitter:image"',
  '<link rel="manifest" href="/manifest.webmanifest"',
  '<link rel="icon"',
  '<script type="application/ld+json">'
];
for (const marker of required) {
  if (!html.includes(marker)) throw new Error('Missing SEO marker: ' + marker);
}
const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? '';
const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? '';
if (title.length < 30 || title.length > 65) throw new Error('Title length must be 30–65 characters');
if (description.length < 70 || description.length > 170) throw new Error('Description length must be 70–170 characters');
const jsonText = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
const graph = JSON.parse(jsonText ?? '{}')['@graph'] ?? [];
for (const type of ['WebSite', 'WebPage']) {
  if (!graph.some((node) => node['@type'] === type)) throw new Error('Missing JSON-LD type: ' + type);
}
if (!robots.includes('Sitemap: ' + origin + 'sitemap.xml')) throw new Error('robots.txt sitemap mismatch');
if (!sitemap.includes('<loc>' + origin + '</loc>')) throw new Error('sitemap canonical mismatch');
console.log('SEO contract verified');
