import type { Connect } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const DATAGOLF_PROXY_PREFIX = '/api/datagolf';
const DATAGOLF_FEED_ORIGIN = 'https://feeds.datagolf.com';

function createDataGolfMiddleware(apiKey: string): Connect.NextHandleFunction {
  return async (req, res, next) => {
    if (!req.url || !req.url.startsWith(DATAGOLF_PROXY_PREFIX)) {
      next();
      return;
    }

    const requestUrl = new URL(req.url, 'http://localhost');
    const upstreamPath = requestUrl.pathname.slice(DATAGOLF_PROXY_PREFIX.length);

    if (!upstreamPath) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Missing DataGolf endpoint path.' }));
      return;
    }

    const upstreamUrl = new URL(upstreamPath, DATAGOLF_FEED_ORIGIN);
    requestUrl.searchParams.forEach((value, key) => {
      upstreamUrl.searchParams.set(key, value);
    });
    upstreamUrl.searchParams.set('key', apiKey);

    try {
      const upstreamResponse = await fetch(upstreamUrl, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'masters-pool-vite-proxy',
        },
      });

      const text = await upstreamResponse.text();
      res.statusCode = upstreamResponse.status;
      res.setHeader('Content-Type', upstreamResponse.headers.get('content-type') ?? 'application/json');
      res.end(text);
    } catch (error) {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error: error instanceof Error ? error.message : 'Unable to reach DataGolf.',
        }),
      );
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const dataGolfKey = env.DG_API_KEY || env.VITE_DG_API_KEY;
  const dataGolfMiddleware = dataGolfKey ? createDataGolfMiddleware(dataGolfKey) : null;

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'datagolf-proxy',
        configureServer(server) {
          if (dataGolfMiddleware) {
            server.middlewares.use(dataGolfMiddleware);
          }
        },
        configurePreviewServer(server) {
          if (dataGolfMiddleware) {
            server.middlewares.use(dataGolfMiddleware);
          }
        },
      },
    ],
  };
});
