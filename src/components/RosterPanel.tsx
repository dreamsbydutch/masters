type RosterPanelProps = {
	teamName: string
	golfers: string[]
	tiebreaker: string
}

export function RosterPanel({ teamName, golfers, tiebreaker }: RosterPanelProps) {
	return (
		<div className="bg-[#f9f8df] shadow-[#346c50] shadow-sm mx-2 p-2 sm:p-4 rounded-xl" aria-label={`${teamName} roster`}>
			<div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
				<h3 className="pl-4 font-[MastersDisplay] tracking-wider text-[#346c50] uppercase sm:text-xl">{teamName} roster</h3>
				{tiebreaker ? <p className="text-sm text-[#346c50] sm:text-base">Tiebreaker: {tiebreaker}</p> : null}
			</div>

			<table className="mx-auto w-full max-w-xs table-fixed sm:w-4/5">
				{golfers.map(golfer => {
					const golferName = golfer.split('(')[0].trim()
					const data = golfer.split('(')[1].replace(')', '').trim().split('/')
					const position = data[0]
					const score = data[1]
					return (
						<>
							<tr className="sm:hidden text-[#21483c] border-t first:border-0 border-[#346c50] text-center" key={golfer}>
								<td className={'w-2/12 text-sm' + (position.trim() === '1' ? ' font-bold' : '')}>{position}</td>
								<td className={'w-7/12 break-words px-1 text-sm' + (position.trim() === '1' ? ' font-bold' : '')}>{golferName}</td>
								<td className={'w-3/12 text-sm' + (position.trim() === '1' ? ' font-bold' : '')}>{score}</td>
							</tr>
							<tr className="hidden sm:table-row text-[#21483c] border-t first:border-0 border-[#346c50] text-center" key={golfer}>
								<td className={'w-2/12 px-2 py-0.5' + (position.trim() === '1' ? ' font-bold' : '')}>{position}</td>
								<td className={'w-7/12 break-words px-2 py-0.5' + (position.trim() === '1' ? ' font-bold' : '')}>{golferName}</td>
								<td className={'w-3/12 px-2 py-0.5' + (position.trim() === '1' ? ' font-bold' : '')}>{score}</td>
							</tr>
						</>
					)
				})}
			</table>
		</div>
	)
}
