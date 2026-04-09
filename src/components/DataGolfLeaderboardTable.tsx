import { memo } from 'react'
import type { DataGolfLeaderboardEntry } from '../types/datagolf'

type DataGolfLeaderboardTableProps = {
	entries: DataGolfLeaderboardEntry[]
}

function formatPercent(value: number | null): string {
	if (value === null) {
		return '--'
	}

	return `${value.toFixed(1)}%`
}

export const DataGolfLeaderboardTable = memo(function DataGolfLeaderboardTable({ entries }: DataGolfLeaderboardTableProps) {
	if (entries.length === 0) {
		return (
			<section className="rounded-b-xl bg-white py-8 text-center" aria-live="polite">
				<h3 className="font-[MastersDisplay] text-xl tracking-wide text-[#21483c] uppercase sm:text-2xl md:text-3xl">No players found</h3>
				<p className="mt-2 text-sm text-[#21483c] sm:text-base md:text-lg">Try a different player name or wait for live scoring to begin.</p>
			</section>
		)
	}

	return (
		<section className="rounded-b-xl bg-white pb-12">
			<table className="mx-auto w-11/12 max-w-2xl table-fixed sm:max-w-4xl">
				<thead>
					<tr>
						<th className="w-[12%] py-3 text-center font-[MastersDisplay] text-xs font-light uppercase tracking-widest sm:text-base md:text-lg">
							Pos
						</th>
						<th className="w-[40%] py-3 pl-3 text-left font-[MastersDisplay] text-xs font-light uppercase tracking-widest sm:w-[32%] sm:pl-6 sm:text-base md:text-lg">
							Player
						</th>
						<th className="w-[16%] py-3 text-center font-[MastersDisplay] text-xs font-light uppercase tracking-widest sm:w-[10%] sm:text-base md:text-lg">
							Score
						</th>
						<th className="w-[16%] py-3 text-center font-[MastersDisplay] text-xs font-light uppercase tracking-widest sm:w-[10%] sm:text-base md:text-lg">
							Today
						</th>
						<th className="w-[16%] py-3 text-center font-[MastersDisplay] text-xs font-light uppercase tracking-widest sm:w-[10%] sm:text-base md:text-lg">
							Thru
						</th>
						<th className="hidden py-3 text-center font-[MastersDisplay] text-xs font-light uppercase tracking-widest sm:table-cell sm:w-[15%] sm:text-base md:text-lg">
							Make Cut
						</th>
						<th className="hidden py-3 text-center font-[MastersDisplay] text-xs font-light uppercase tracking-widest sm:table-cell sm:w-[15%] sm:text-base md:text-lg">
							Win
						</th>
					</tr>
				</thead>
				<tbody>
					{entries.map((entry, index) => (
						<tr key={entry.id} className={index === 0 || entries[index - 1].position !== entry.position ? 'border-t border-[#346c50]' : ''}>
							<td className="w-[12%] py-2 text-center font-[MastersDisplay] text-base tracking-wider text-[#21483c] sm:py-3 sm:text-2xl">
								{entry.position}
							</td>
							<td className="w-[40%] py-2 pl-3 font-[MastersDisplay] text-sm leading-tight text-[#15311f] sm:w-[32%] sm:py-3 sm:pl-4 sm:text-xl md:text-2xl">
								{entry.playerName}
							</td>
							<td className="w-[16%] py-2 text-center font-[MastersDisplay] text-base tracking-wider text-[#21483c] sm:w-[10%] sm:py-3 sm:text-xl md:text-2xl">
								{entry.score}
							</td>
							<td className="w-[16%] py-2 text-center font-[MastersDisplay] text-sm tracking-wider text-[#21483c] sm:w-[10%] sm:py-3 sm:text-lg md:text-xl">
								{entry.roundScore}
							</td>
							<td className="w-[16%] py-2 text-center font-[MastersDisplay] text-sm tracking-wider text-[#21483c] sm:w-[10%] sm:py-3 sm:text-lg md:text-xl">
								{entry.thru}
							</td>
							<td className="hidden w-[12%] py-3 text-center font-[MastersDisplay] text-lg tracking-wider text-[#21483c] sm:table-cell sm:w-[15%] sm:text-lg md:text-xl">
								{formatPercent(entry.makeCutProbability)}
							</td>
							<td className="hidden w-[12%] py-3 text-center font-[MastersDisplay] text-lg tracking-wider text-[#21483c] sm:table-cell sm:w-[15%] sm:text-lg md:text-xl">
								{formatPercent(entry.winProbability)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</section>
	)
})
