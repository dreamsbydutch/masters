const DATAGOLF_FEED_ORIGIN = 'https://feeds.datagolf.com'
const API_PREFIX = '/api/datagolf/'

function jsonResponse(body: unknown, init?: ResponseInit): Response {
	return new Response(JSON.stringify(body), {
		...init,
		headers: {
			'content-type': 'application/json',
			...(init?.headers ?? {}),
		},
	})
}

export default {
	async fetch(request: Request): Promise<Response> {
		const apiKey = process.env.DG_API_KEY || process.env.VITE_DG_API_KEY

		if (!apiKey) {
			return jsonResponse({ error: 'Missing DG_API_KEY environment variable.' }, { status: 500 })
		}

		const incomingUrl = new URL(request.url)

		if (!incomingUrl.pathname.startsWith(API_PREFIX)) {
			return jsonResponse({ error: 'Invalid DataGolf route.' }, { status: 404 })
		}

		const upstreamPath = incomingUrl.pathname.slice(API_PREFIX.length)

		if (!upstreamPath) {
			return jsonResponse({ error: 'Missing DataGolf endpoint path.' }, { status: 400 })
		}

		const upstreamUrl = new URL(upstreamPath, `${DATAGOLF_FEED_ORIGIN}/`)

		incomingUrl.searchParams.forEach((value, key) => {
			upstreamUrl.searchParams.set(key, value)
		})
		upstreamUrl.searchParams.set('key', apiKey)

		try {
			const upstreamResponse = await fetch(upstreamUrl, {
				headers: {
					Accept: 'application/json',
					'User-Agent': 'masters-pool-vercel-proxy',
				},
			})

			return new Response(await upstreamResponse.text(), {
				status: upstreamResponse.status,
				headers: {
					'content-type': upstreamResponse.headers.get('content-type') ?? 'application/json',
				},
			})
		} catch (error) {
			return jsonResponse(
				{
					error: error instanceof Error ? error.message : 'Unable to reach DataGolf.',
				},
				{ status: 502 },
			)
		}
	},
}
