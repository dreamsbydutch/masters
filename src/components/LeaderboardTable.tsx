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
			<table className="mx-auto w-11/12 max-w-2xl table-fixed">
				<thead>
					<tr>
						<th className="w-1/12 font-[MastersDisplay] font-light tracking-widest text-sm sm:text-base md:text-lg uppercase">Pos</th>
						<th className="w-7/12 pl-4 text-left font-[MastersDisplay] text-sm font-light tracking-widest uppercase sm:pl-6 sm:text-base md:text-lg">Team</th>
						<th className="w-3/12 font-[MastersDisplay] font-light tracking-widest text-sm sm:text-base md:text-lg uppercase">Team Earnings</th>
						<th className="w-1/12 font-[MastersDisplay] font-light tracking-widest text-sm sm:text-base md:text-lg uppercase"></th>
					</tr>
				</thead>
				<tbody>
					{entries.map((entry, index) => (
						<LeaderboardRow
							key={entry.id}
							entry={entry}
							isExpanded={expandedRows.has(entry.id)}
							hasTopBorder={index === 0 || entries[index - 1].rank !== entry.rank}
							onToggle={onToggleRow}
						/>
					))}
				</tbody>
			</table>
			{footer}
		</section>
	)
})
