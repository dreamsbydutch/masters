const DATAGOLF_FEED_ORIGIN = 'https://feeds.datagolf.com'

export default async function handler(req: { query: Record<string, unknown> }, res: { status: (code: number) => { json: (body: unknown) => void }; setHeader: (name: string, value: string) => void; send: (body: string) => void }) {
	const apiKey = process.env.DG_API_KEY || process.env.VITE_DG_API_KEY

	if (!apiKey) {
		res.status(500).json({ error: 'Missing DG_API_KEY environment variable.' })
		return
	}

	const endpointParam = req.query.endpoint
	const endpoint = Array.isArray(endpointParam) ? endpointParam[0] : endpointParam

	if (!endpoint || typeof endpoint !== 'string') {
		res.status(400).json({ error: 'Missing DataGolf endpoint.' })
		return
	}

	const normalizedEndpoint = endpoint.replace(/^\/+/, '')
	const upstreamUrl = new URL(normalizedEndpoint, `${DATAGOLF_FEED_ORIGIN}/`)

	Object.entries(req.query).forEach(([key, value]) => {
		if (key === 'endpoint') {
			return
		}

		if (Array.isArray(value)) {
			value.forEach((entry) => upstreamUrl.searchParams.append(key, String(entry)))
			return
		}

		if (typeof value !== 'undefined') {
			upstreamUrl.searchParams.set(key, String(value))
		}
	})

	upstreamUrl.searchParams.set('key', apiKey)

	try {
		const upstreamResponse = await fetch(upstreamUrl, {
			headers: {
				Accept: 'application/json',
				'User-Agent': 'masters-pool-vercel-proxy',
			},
		})

		const text = await upstreamResponse.text()
		res.status(upstreamResponse.status)
		res.setHeader('Content-Type', upstreamResponse.headers.get('content-type') ?? 'application/json')
		res.send(text)
	} catch (error) {
		res.status(502).json({
			error: error instanceof Error ? error.message : 'Unable to reach DataGolf.',
		})
	}
}
