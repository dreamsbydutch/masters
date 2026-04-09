import { DATAGOLF_IN_PLAY_ENDPOINT, DATAGOLF_LIVE_STATS_ENDPOINT, DATAGOLF_PROXY_ENDPOINT } from '../config/dataSource'
import type { DataGolfLeaderboard, DataGolfLeaderboardEntry } from '../types/datagolf'

type UnknownRecord = Record<string, unknown>

type PartialLeaderboardEntry = {
	id: string
	playerName: string
	position: string | null
	score: string | null
	roundScore: string | null
	thru: string | null
	totalSg: number | null
	makeCutProbability: number | null
	winProbability: number | null
}

const PLAYER_NAME_KEYS = ['player_name', 'player', 'name', 'golfer', 'playerName']
const PLAYER_ID_KEYS = ['dg_id', 'player_id', 'id', 'pid']
const POSITION_KEYS = ['position', 'pos', 'rank', 'place', 'current_position', 'current_pos']
const SCORE_KEYS = ['score', 'score_to_par', 'to_par', 'score_rel', 'total_to_par', 'current_score', 'total']
const ROUND_SCORE_KEYS = ['today', 'round_score', 'round_to_par', 'rd_score', 'round_score_to_par']
const THRU_KEYS = ['thru', 'holes_completed', 'hole', 'status']
const TOTAL_SG_KEYS = ['sg_total', 'strokes_gained_total', 'total_sg']
const MAKE_CUT_KEYS = ['make_cut', 'makeCut', 'make_cut_probability', 'make_cut_prob']
const WIN_PROBABILITY_KEYS = ['win', 'win_prob', 'win_probability', 'win_pct']
const EVENT_NAME_KEYS = ['event_name', 'tournament_name', 'event', 'tournament']

function isRecord(value: unknown): value is UnknownRecord {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asObjectRows(value: unknown): UnknownRecord[] {
	if (!Array.isArray(value)) {
		return []
	}

	return value.filter(isRecord)
}

function getString(value: unknown): string | null {
	if (typeof value === 'string') {
		const trimmed = value.trim()

		return trimmed ? trimmed : null
	}

	if (typeof value === 'number' && Number.isFinite(value)) {
		return String(value)
	}

	return null
}

function getNumber(value: unknown): number | null {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value
	}

	if (typeof value === 'string') {
		const normalized = value.replace('%', '').trim()

		if (!normalized) {
			return null
		}

		const parsed = Number.parseFloat(normalized)

		return Number.isFinite(parsed) ? parsed : null
	}

	return null
}

function readKnownField(record: UnknownRecord, keys: string[]): unknown {
	for (const key of keys) {
		if (key in record) {
			return record[key]
		}
	}

	for (const value of Object.values(record)) {
		if (!isRecord(value)) {
			continue
		}

		for (const key of keys) {
			if (key in value) {
				return value[key]
			}
		}
	}

	return null
}

function readEventName(payload: unknown): string | null {
	if (!isRecord(payload)) {
		return null
	}

	for (const key of EVENT_NAME_KEYS) {
		const directValue = getString(payload[key])

		if (directValue) {
			return directValue
		}
	}

	for (const value of Object.values(payload)) {
		if (!isRecord(value)) {
			continue
		}

		for (const key of EVENT_NAME_KEYS) {
			const nestedValue = getString(value[key])

			if (nestedValue) {
				return nestedValue
			}
		}
	}

	return null
}

function extractRows(payload: unknown): UnknownRecord[] {
	const directRows = asObjectRows(payload)

	if (directRows.length > 0) {
		return directRows
	}

	if (!isRecord(payload)) {
		return []
	}

	const preferredKeys = ['data', 'results', 'players', 'field', 'table', 'stats', 'rows']

	for (const key of preferredKeys) {
		const nestedRows = asObjectRows(payload[key])

		if (nestedRows.length > 0) {
			return nestedRows
		}
	}

	for (const value of Object.values(payload)) {
		const nestedRows = asObjectRows(value)

		if (nestedRows.length > 0) {
			return nestedRows
		}

		if (!isRecord(value)) {
			continue
		}

		for (const nestedValue of Object.values(value)) {
			const deepRows = asObjectRows(nestedValue)

			if (deepRows.length > 0) {
				return deepRows
			}
		}
	}

	return []
}

function normalizePlayerKey(playerName: string): string {
	return playerName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function formatPlayerName(playerName: string): string {
	const [lastName, firstName, ...rest] = playerName.split(',').map((part) => part.trim()).filter(Boolean)

	if (!lastName || !firstName) {
		return playerName
	}

	return [firstName, ...rest, lastName].join(' ')
}

function formatRelativeScore(value: unknown): string | null {
	const stringValue = getString(value)

	if (!stringValue) {
		return null
	}

	const normalized = stringValue.toUpperCase()

	if (normalized === 'E' || normalized === 'CUT' || normalized === 'WD' || normalized === 'DQ') {
		return normalized
	}

	const numericValue = getNumber(stringValue)

	if (numericValue === null) {
		return stringValue
	}

	if (numericValue === 0) {
		return 'E'
	}

	return numericValue > 0 ? `+${numericValue}` : `${numericValue}`
}

function formatPosition(value: unknown): string | null {
	const stringValue = getString(value)

	if (!stringValue) {
		return null
	}

	return stringValue.toUpperCase()
}

function formatThru(value: unknown): string | null {
	const stringValue = getString(value)

	if (!stringValue) {
		return null
	}

	if (/^\d+$/.test(stringValue)) {
		return stringValue === '18' ? 'F' : stringValue
	}

	return stringValue.toUpperCase()
}

function formatProbability(value: unknown): number | null {
	const numericValue = getNumber(value)

	if (numericValue === null) {
		return null
	}

	if (numericValue >= 0 && numericValue <= 1) {
		return numericValue * 100
	}

	return numericValue
}

function shouldClearLiveRoundFields(position: string | null): boolean {
	if (!position) {
		return false
	}

	const normalizedPosition = position.toUpperCase()

	return normalizedPosition === 'CUT' || normalizedPosition === 'DQ'
}

function parseEntry(row: UnknownRecord): PartialLeaderboardEntry | null {
	const playerName = getString(readKnownField(row, PLAYER_NAME_KEYS))

	if (!playerName) {
		return null
	}

	const rawId = getString(readKnownField(row, PLAYER_ID_KEYS))
	const position = formatPosition(readKnownField(row, POSITION_KEYS))
	const roundScore = formatRelativeScore(readKnownField(row, ROUND_SCORE_KEYS))
	const thru = formatThru(readKnownField(row, THRU_KEYS))

	return {
		id: rawId ?? normalizePlayerKey(playerName),
		playerName: formatPlayerName(playerName),
		position,
		score: formatRelativeScore(readKnownField(row, SCORE_KEYS)),
		roundScore: shouldClearLiveRoundFields(position) ? '' : roundScore,
		thru: shouldClearLiveRoundFields(position) ? '' : thru,
		totalSg: getNumber(readKnownField(row, TOTAL_SG_KEYS)),
		makeCutProbability: formatProbability(readKnownField(row, MAKE_CUT_KEYS)),
		winProbability: formatProbability(readKnownField(row, WIN_PROBABILITY_KEYS)),
	}
}

function parsePositionRank(position: string): number {
	const match = position.match(/(\d+)/)

	if (!match) {
		return Number.POSITIVE_INFINITY
	}

	return Number.parseInt(match[1], 10)
}

function parseScoreValue(score: string): number {
	if (score === 'E') {
		return 0
	}

	const parsed = Number.parseFloat(score)

	return Number.isFinite(parsed) ? parsed : Number.POSITIVE_INFINITY
}

function getStatusGroup(position: string): number {
	const normalizedPosition = position.toUpperCase()

	if (normalizedPosition === 'CUT') {
		return 1
	}

	if (normalizedPosition === 'WD') {
		return 2
	}

	if (normalizedPosition === 'DQ') {
		return 3
	}

	return 0
}

function compareEntries(a: DataGolfLeaderboardEntry, b: DataGolfLeaderboardEntry): number {
	const statusGroupDelta = getStatusGroup(a.position) - getStatusGroup(b.position)

	if (statusGroupDelta !== 0) {
		return statusGroupDelta
	}

	const scoreDelta = parseScoreValue(a.score) - parseScoreValue(b.score)

	if (scoreDelta !== 0) {
		return scoreDelta
	}

	const positionDelta = parsePositionRank(a.position) - parsePositionRank(b.position)

	if (positionDelta !== 0) {
		return positionDelta
	}

	return a.playerName.localeCompare(b.playerName, undefined, { sensitivity: 'base' })
}

function mergeEntries(primaryRows: UnknownRecord[], secondaryRows: UnknownRecord[]): DataGolfLeaderboardEntry[] {
	const entryMap = new Map<string, PartialLeaderboardEntry>()

	for (const row of [...primaryRows, ...secondaryRows]) {
		const parsedEntry = parseEntry(row)

		if (!parsedEntry) {
			continue
		}

		const existingEntry = entryMap.get(parsedEntry.id)

		if (!existingEntry) {
			entryMap.set(parsedEntry.id, parsedEntry)
			continue
		}

		entryMap.set(parsedEntry.id, {
			...existingEntry,
			position: existingEntry.position ?? parsedEntry.position,
			score: existingEntry.score ?? parsedEntry.score,
			roundScore: existingEntry.roundScore ?? parsedEntry.roundScore,
			thru: existingEntry.thru ?? parsedEntry.thru,
			totalSg: existingEntry.totalSg ?? parsedEntry.totalSg,
			makeCutProbability: existingEntry.makeCutProbability ?? parsedEntry.makeCutProbability,
			winProbability: existingEntry.winProbability ?? parsedEntry.winProbability,
		})
	}

	return Array.from(entryMap.values())
		.map((entry) => ({
			id: entry.id,
			playerName: entry.playerName,
			position: entry.position ?? '--',
			score: entry.score ?? '--',
			roundScore: entry.roundScore ?? '--',
			thru: entry.thru ?? '--',
			totalSg: entry.totalSg,
			makeCutProbability: entry.makeCutProbability,
			winProbability: entry.winProbability,
		}))
		.sort(compareEntries)
}

async function fetchDataGolfPayload(url: URL): Promise<unknown> {
	const response = await fetch(url, {
		headers: {
			Accept: 'application/json',
		},
	})

	if (!response.ok) {
		if (response.status === 404) {
			throw new Error('DataGolf proxy route was not found. Run through Vite locally or deploy with a backend route such as Vercel Functions.')
		}

		throw new Error(`DataGolf request failed with status ${response.status}.`)
	}

	return response.json() as Promise<unknown>
}

function buildUrl(endpoint: string, params: Record<string, string>): URL {
	const baseUrl = typeof window === 'undefined' ? 'http://localhost' : window.location.origin
	const url = new URL(DATAGOLF_PROXY_ENDPOINT, baseUrl)
	url.searchParams.set('endpoint', endpoint)

	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, value)
	}

	return url
}

export async function fetchDataGolfLeaderboard(): Promise<DataGolfLeaderboard> {
	const liveStatsUrl = buildUrl(DATAGOLF_LIVE_STATS_ENDPOINT, {
		stats: 'sg_total',
		round: 'event_cumulative',
		display: 'value',
		file_format: 'json',
	})

	const inPlayUrl = buildUrl(DATAGOLF_IN_PLAY_ENDPOINT, {
		tour: 'pga',
		dead_heat: 'no',
		odds_format: 'percent',
		file_format: 'json',
	})

	const [liveStatsResult, inPlayResult] = await Promise.allSettled([
		fetchDataGolfPayload(liveStatsUrl),
		fetchDataGolfPayload(inPlayUrl),
	])

	if (liveStatsResult.status === 'rejected' && inPlayResult.status === 'rejected') {
		throw liveStatsResult.reason instanceof Error ? liveStatsResult.reason : new Error('Unable to load DataGolf data.')
	}

	const liveStatsPayload = liveStatsResult.status === 'fulfilled' ? liveStatsResult.value : null
	const inPlayPayload = inPlayResult.status === 'fulfilled' ? inPlayResult.value : null
	const entries = mergeEntries(extractRows(inPlayPayload), extractRows(liveStatsPayload))

	if (entries.length === 0) {
		throw new Error('DataGolf returned no live PGA leaderboard rows.')
	}

	return {
		eventName: readEventName(inPlayPayload) ?? readEventName(liveStatsPayload) ?? 'DataGolf PGA Tour Live',
		entries,
	}
}
