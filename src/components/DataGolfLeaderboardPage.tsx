import { useEffect, useState } from 'react'
import { REFRESH_INTERVAL_MS } from '../config/dataSource'
import { fetchDataGolfLeaderboard } from '../lib/fetchDataGolfLeaderboard'
import type { DataGolfLeaderboardEntry } from '../types/datagolf'
import { DataGolfLeaderboardTable } from './DataGolfLeaderboardTable'

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

	return 'Unable to load the PGA leaderboard right now.'
}

export function DataGolfLeaderboardPage() {
	const [entries, setEntries] = useState<DataGolfLeaderboardEntry[]>([])
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
				const nextLeaderboard = await fetchDataGolfLeaderboard()

				if (!isMounted) {
					return
				}

				setEntries(nextLeaderboard.entries)
				setLastUpdated(new Date())
				setWarningMessage(null)
				setErrorMessage(null)
			} catch (error) {
				if (!isMounted) {
					return
				}

				const message = getErrorMessage(error)

				if (entries.length > 0) {
					setWarningMessage('Live update failed. Showing the latest available PGA standings.')
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

	return (
		<section className="my-8 mx-auto max-w-4xl">
			{isLoading ? (
				<section className="mx-auto rounded-xl bg-white px-5 py-5 shadow-lg shadow-[#fbf308]" aria-live="polite">
					<div className="m-4 flex flex-col gap-1">
						<h2 className="font-[MastersDisplay] text-2xl tracking-wider text-[#346c50] uppercase sm:text-3xl">Loading PGA leaderboard...</h2>
					</div>
				</section>
			) : errorMessage ? (
				<section className="mx-auto flex flex-col gap-2 rounded-xl bg-white px-5 py-5 shadow-lg shadow-[#fbf308]" aria-live="assertive">
					<h2 className="font-[MastersDisplay] text-xl leading-none tracking-wider text-[#346c50] uppercase sm:text-2xl md:text-3xl">
						Unable to load PGA standings
					</h2>
					<p className="text-lg text-[#21483c] md:text-xl">{errorMessage}</p>
				</section>
			) : (
				<>
					<section
						className="rounded-t-[100px] md:rounded-t-full bg-linear-to-b from-[#dad9d4] to-white pt-8 pb-2"
						aria-labelledby="pga-leaderboard-title">
						<div className="mx-auto flex w-7/8 max-w-2xl flex-col gap-4">
							<div className="text-center">
								<div
									id="pga-leaderboard-title"
									className="font-[MastersDisplay] text-4xl uppercase tracking-wide text-[#fbf308] text-shadow-lg text-shadow-[#21483c] sm:text-5xl">
									Leaderboard
								</div>
							</div>

							<div className="flex justify-center">
								<div className="text-sm text-[#346c50]">
									<div>
										<span className="text-xs uppercase tracking-[0.2em] pr-2">Updated</span>
										<span className="text-sm text-[#21483c] sm:text-base md:text-lg">
											{isRefreshing ? 'Refreshing...' : formatTimestamp(lastUpdated)}
										</span>
									</div>
								</div>
							</div>

							{warningMessage ? (
								<p className="rounded-xl border border-[#c39e2c] bg-[#fff7d6] px-4 py-3 text-sm text-[#5d4a0d] sm:text-base">{warningMessage}</p>
							) : null}
						</div>
					</section>

					<DataGolfLeaderboardTable entries={entries} />
				</>
			)}
		</section>
	)
}
