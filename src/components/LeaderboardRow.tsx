import { memo } from 'react'
import { formatCurrency } from '../lib/formatCurrency'
import type { LeaderboardEntry } from '../types/leaderboard'
import { RosterPanel } from './RosterPanel'

type LeaderboardRowProps = {
	entry: LeaderboardEntry
	isExpanded: boolean
	hasTopBorder: boolean
	onToggle: (entryId: string) => void
}

export const LeaderboardRow = memo(function LeaderboardRow({ entry, isExpanded, hasTopBorder, onToggle }: LeaderboardRowProps) {
	const detailsId = `roster-${entry.id}`

	return (
		<>
			<tr
				className={`${hasTopBorder ? 'border-t border-[#346c50]' : ''} w-full cursor-pointer`}
				onClick={() => onToggle(entry.id)}
				aria-label={isExpanded ? `Hide ${entry.teamName} roster` : `View ${entry.teamName} roster`}
				aria-expanded={isExpanded}
				aria-controls={detailsId}>
				<td className="w-1/12 text-center font-[MastersDisplay] tracking-wide text-lg sm:text-xl text-[#21483c]">{entry.rank}</td>
				<td className="w-8/12 text-lg font-[MastersDisplay] sm:text-xl md:text-2xl pl-4 py-1">{entry.teamName}</td>
				<td className="w-3/12 text-center font-[MastersDisplay] tracking-wide text-lg sm:text-xl text-[#21483c]">{formatCurrency(entry.earnings)}</td>
				<td className="w-1/12 text-right">
					<svg
						aria-hidden="true"
						className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
						viewBox="0 0 20 20"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</td>
			</tr>
			<tr id={detailsId} hidden={!isExpanded}>
				<td className="pb-4" colSpan={4}>
					<RosterPanel teamName={entry.teamName} golfers={entry.golfers} tiebreaker={entry.tiebreaker} />
				</td>
			</tr>
		</>
	)
})
