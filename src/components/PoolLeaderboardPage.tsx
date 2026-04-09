import { useCallback, useEffect, useMemo, useState } from 'react'
import { REFRESH_INTERVAL_MS } from '../config/dataSource'
import { filterEntries } from '../lib/filterEntries'
import { fetchLeaderboard } from '../lib/fetchLeaderboard'
import type { LeaderboardEntry } from '../types/leaderboard'
import { LeaderboardTable } from './LeaderboardTable'
import { SearchToolbar } from './SearchToolbar'

function formatTimestamp(timestamp: Date | null): string {
	if (!timestamp) {
		return 'Awaiting live data'
	}

	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	}).format(timestamp)
}

function getErrorMessage(error: unknown): string {
	if (error instanceof Error && error.message) {
		return error.message
	}

	return 'Unable to load the leaderboard right now.'
}

export function PoolLeaderboardPage() {
	const [entries, setEntries] = useState<LeaderboardEntry[]>([])
	const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
	const [searchTerm, setSearchTerm] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [warningMessage, setWarningMessage] = useState<string | null>(null)
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

	useEffect(() => {
		let isMounted = true

		async function loadEntries(options?: { silent?: boolean }) {
			const silent = options?.silent ?? false

			if (silent) {
				setIsRefreshing(true)
			} else {
				setIsLoading(true)
				setErrorMessage(null)
			}

			try {
				const nextEntries = await fetchLeaderboard()
				const validIds = new Set(nextEntries.map((entry) => entry.id))

				if (!isMounted) {
					return
				}

				setEntries(nextEntries)
				setExpandedRows((current) => {
					const nextExpanded = new Set<string>()

					current.forEach((entryId) => {
						if (validIds.has(entryId)) {
							nextExpanded.add(entryId)
						}
					})

					return nextExpanded
				})
				setLastUpdated(new Date())
				setWarningMessage(null)
				setErrorMessage(null)
			} catch (error) {
				if (!isMounted) {
					return
				}

				const message = getErrorMessage(error)

				if (entries.length > 0) {
					setWarningMessage('Live update failed. Showing the latest available standings.')
				} else {
					setErrorMessage(message)
				}
			} finally {
				if (isMounted) {
					setIsLoading(false)
					setIsRefreshing(false)
				}
			}
		}

		void loadEntries()

		const intervalId = window.setInterval(() => {
			void loadEntries({ silent: true })
		}, REFRESH_INTERVAL_MS)

		return () => {
			isMounted = false
			window.clearInterval(intervalId)
		}
	}, [entries.length])

	const handleToggleRow = useCallback((entryId: string) => {
		setExpandedRows((current) => {
			const next = new Set(current)

			if (next.has(entryId)) {
				next.delete(entryId)
			} else {
				next.add(entryId)
			}

			return next
		})
	}, [])

	const filteredEntries = useMemo(() => filterEntries(entries, searchTerm), [entries, searchTerm])

	return isLoading ? (
		<section className="my-8 mx-auto max-w-4xl rounded-xl bg-white px-5 py-5 shadow-lg shadow-[#fbf308]" aria-live="polite">
			<div className="m-4 flex flex-col gap-1">
				<h2 className="font-[MastersDisplay] text-2xl tracking-wider text-[#346c50] uppercase sm:text-3xl">Loading live results...</h2>
			</div>
		</section>
	) : errorMessage ? (
		<section className="my-8 mx-auto flex max-w-4xl flex-col gap-2 rounded-xl bg-white px-5 py-5 shadow-lg shadow-[#fbf308]" aria-live="assertive">
			<h2 className="font-[MastersDisplay] text-xl leading-none tracking-wider text-[#346c50] uppercase sm:text-2xl md:text-3xl">
				Unable to load live standings
			</h2>
			<p className="text-lg text-[#21483c] md:text-xl">{errorMessage}</p>
		</section>
	) : (
		<section className="my-8 mx-auto max-w-4xl">
			<SearchToolbar
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
				lastUpdatedLabel={formatTimestamp(lastUpdated)}
				isRefreshing={isRefreshing}
			/>
			{warningMessage ? (
				<p className="border-x border-[#c39e2c] bg-[#fff7d6] px-8 py-3 text-base text-[#5d4a0d]">{warningMessage}</p>
			) : null}
			<LeaderboardTable
				entries={filteredEntries}
				expandedRows={expandedRows}
				onToggleRow={handleToggleRow}
			/>
		</section>
	)
}
