import { memo, type ReactNode } from 'react'
import type { LeaderboardEntry } from '../types/leaderboard'
import { LeaderboardRow } from './LeaderboardRow'

type LeaderboardTableProps = {
	entries: LeaderboardEntry[]
	expandedRows: Set<string>
	onToggleRow: (entryId: string) => void
	footer?: ReactNode
}

export const LeaderboardTable = memo(function LeaderboardTable({ entries, expandedRows, onToggleRow, footer }: LeaderboardTableProps) {
	if (entries.length === 0) {
		return (
			<section className="py-8 bg-white rounded-b-xl text-center" aria-live="polite">
				<h3 className="font-[MastersDisplay] text-xl sm:text-2xl md:text-3xl tracking-wide text-[#21483c] uppercase">No teams found</h3>
				<p className="mt-2 text-sm sm:text-base md:text-lg text-[#21483c]">Try a different team name to find your pool entry.</p>
			</section>
		)
	}

	return (
		<section className="rounded-b-xl bg-white pb-12">
			<table className="w-11/12 mx-auto max-w-2xl ">
				<thead>
					<tr>
						<th className="font-[MastersDisplay] font-light tracking-widest text-sm sm:text-base md:text-lg uppercase">Pos</th>
						<th className="font-[MastersDisplay] font-light tracking-widest text-sm sm:text-base md:text-lg uppercase text-left pl-6">Team</th>
						<th className="font-[MastersDisplay] font-light tracking-widest text-sm sm:text-base md:text-lg uppercase">Team Earnings</th>
						<th className="font-[MastersDisplay] font-light tracking-widest text-sm sm:text-base md:text-lg uppercase"></th>
					</tr>
				</thead>
				<tbody>
					{entries.map(entry => (
						<LeaderboardRow key={entry.id} entry={entry} isExpanded={expandedRows.has(entry.id)} onToggle={onToggleRow} />
					))}
				</tbody>
			</table>
			{footer}
		</section>
	)
})
