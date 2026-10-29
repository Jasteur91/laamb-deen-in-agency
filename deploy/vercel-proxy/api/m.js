export const config = { runtime: 'edge' };

// Files live in the public GitHub repo Jasteur91/laamb-deen-in-agency, pinned to one commit.
const ORIGIN = 'https://raw.githubusercontent.com/Jasteur91/laamb-deen-in-agency/39cdc539ca291a825b955b4d29afdd8105945df7/';
const TYPES = {
  html: 'text/html; charset=utf-8', mp4: 'video/mp4', jpg: 'image/jpeg', jpeg: 'image/jpeg',
  png: 'image/png', webp: 'image/webp', svg: 'image/svg+xml', mp3: 'audio/mpeg', pdf: 'application/pdf'
};

export default async function handler(req) {
  const url = new URL(req.url);
  const p = url.searchParams.get('p') || '';
  if (!/^[A-Za-z0-9_\-./]+$/.test(p) || p.includes('..') || p.startsWith('/')) return new Response('Not found', { status: 404 });
  const ext = p.split('.').pop().toLowerCase();
  const type = TYPES[ext];
  if (!type) return new Response('Not found', { status: 404 });

  const fwd = {};
  const range = req.headers.get('range');
  if (range && ext !== 'html') fwd.range = range;
  const up = await fetch(ORIGIN + p, { method: req.method === 'HEAD' ? 'HEAD' : 'GET', headers: fwd });
  if (up.status !== 200 && up.status !== 206) return new Response('Not found', { status: up.status === 404 ? 404 : 502 });

  const h = new Headers();
  h.set('content-type', type);
  for (const k of ['content-length', 'content-range', 'etag', 'last-modified']) {
    const v = up.headers.get(k);
    if (v) h.set(k, v);
  }
  if (ext !== 'html') h.set('accept-ranges', 'bytes');
  if (ext === 'html') {
    h.set('cache-control', 'public, max-age=60, s-maxage=600');
  } else {
    // Byte-range responses must never be shared from the CDN cache, or one range is served for every request.
    h.set('cache-control', 'public, max-age=86400');
    h.set('cdn-cache-control', 'no-store');
    h.set('vercel-cdn-cache-control', 'no-store');
  }
  h.set('x-content-type-options', 'nosniff');
  return new Response(req.method === 'HEAD' ? null : up.body, { status: up.status, headers: h });
}
