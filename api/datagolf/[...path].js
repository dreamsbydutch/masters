const DATAGOLF_FEED_ORIGIN = 'https://feeds.datagolf.com';

export default async function handler(req, res) {
  const apiKey = process.env.DG_API_KEY || process.env.VITE_DG_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: 'Missing DG_API_KEY environment variable.' });
    return;
  }

  const rawPath = req.query.path;
  const pathSegments = Array.isArray(rawPath) ? rawPath : rawPath ? [rawPath] : [];

  if (pathSegments.length === 0) {
    res.status(400).json({ error: 'Missing DataGolf endpoint path.' });
    return;
  }

  const upstreamUrl = new URL(pathSegments.join('/'), `${DATAGOLF_FEED_ORIGIN}/`);

  Object.entries(req.query).forEach(([key, value]) => {
    if (key === 'path') {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((entry) => upstreamUrl.searchParams.append(key, String(entry)));
      return;
    }

    if (typeof value !== 'undefined') {
      upstreamUrl.searchParams.set(key, String(value));
    }
  });

  upstreamUrl.searchParams.set('key', apiKey);

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'masters-pool-vercel-proxy',
      },
    });

    const text = await upstreamResponse.text();
    const contentType = upstreamResponse.headers.get('content-type') ?? 'application/json';

    res.status(upstreamResponse.status);
    res.setHeader('Content-Type', contentType);
    res.send(text);
  } catch (error) {
    res.status(502).json({
      error: error instanceof Error ? error.message : 'Unable to reach DataGolf.',
    });
  }
}
