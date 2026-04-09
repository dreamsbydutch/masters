type RosterPanelProps = {
	teamName: string
	golfers: string[]
	tiebreaker: string
}

export function RosterPanel({ teamName, golfers, tiebreaker }: RosterPanelProps) {
	return (
		<div className="bg-[#f9f8df] shadow-[#346c50] shadow-sm mx-2 p-2 sm:p-4 rounded-xl" aria-label={`${teamName} roster`}>
			<div className="mb-2 flex flex-nowrap items-baseline justify-between">
				<h3 className="font-[MastersDisplay] sm:text-xl pl-4 tracking-wider text-[#346c50] uppercase">{teamName} roster</h3>
				{tiebreaker ? <p className="text-[#346c50] text-sm sm:text-base">Tiebreaker: {tiebreaker}</p> : null}
			</div>

			<table className="w-full xs:w-4/5 max-w-xs mx-auto">
				{golfers.map(golfer => {
					const golferName = golfer.split('(')[0].trim()
					const data = golfer.split('(')[1].replace(')', '').trim().split('/')
					const position = data[0]
					const score = data[1]
					return (
						<>
							<tr className="sm:hidden text-[#21483c] border-t first:border-0 border-[#346c50] text-center" key={golfer}>
								<td className={'text-sm' + (position.trim() === '1' ? ' font-bold' : '')}>{position}</td>
								<td className={'text-sm' + (position.trim() === '1' ? ' font-bold' : '')}>{golferName}</td>
								<td className={'text-sm' + (position.trim() === '1' ? ' font-bold' : '')}>{score}</td>
							</tr>
							<tr className="hidden sm:table-row text-[#21483c] border-t first:border-0 border-[#346c50] text-center" key={golfer}>
								<td className={'py-0.5 px-2' + (position.trim() === '1' ? ' font-bold' : '')}>{position}</td>
								<td className={'py-0.5 px-2' + (position.trim() === '1' ? ' font-bold' : '')}>{golferName}</td>
								<td className={'py-0.5 px-2' + (position.trim() === '1' ? ' font-bold' : '')}>{score}</td>
							</tr>
						</>
					)
				})}
			</table>
		</div>
	)
}
