type SearchToolbarProps = {
	searchTerm: string
	onSearchChange: (value: string) => void
	lastUpdatedLabel: string
	isRefreshing: boolean
}

export function SearchToolbar({
	searchTerm,
	onSearchChange,
	lastUpdatedLabel,
	isRefreshing,
}: SearchToolbarProps) {
	return (
		<section className="rounded-t-[100px] bg-linear-to-b from-[#dad9d4] to-white pt-8 pb-2 md:rounded-t-full" aria-labelledby="leaderboard-title">
			<div className="text-4xl sm:text-5xl font-[MastersDisplay] text-[#fbf308] text-shadow-lg text-shadow-[#21483c] text-center uppercase pt-2 pb-6">
				Leaderboard
			</div>

			<div className="mx-auto flex w-7/8 max-w-2xl flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
				<input
					id="team-search"
					name="team-search"
					type="text"
					inputMode="search"
					autoComplete="off"
					autoCorrect="off"
					autoCapitalize="none"
					spellCheck={false}
					placeholder="Search by team name"
					value={searchTerm}
					onChange={event => onSearchChange(event.target.value)}
					className="w-full min-w-0 rounded-xl border-2 border-[#346c50] bg-white px-4 py-2 text-[#21483c] transition hover:border-[#21483c] focus:border-[#21483c] focus:outline-none focus:ring-2 focus:ring-[#21483c]/50 sm:flex-1"
				/>

				<dl className="w-full text-center sm:w-auto sm:max-w-[11rem] sm:text-right" aria-label="Leaderboard status">
					<div className="py-1">
						<dt className="text-xs sm:text-sm tracking-widest text-[#346c50] uppercase">Updated</dt>
						<dd className="text-sm text-[#346c50] sm:text-base md:text-lg">{isRefreshing ? 'Refreshing...' : lastUpdatedLabel}</dd>
					</div>
				</dl>
			</div>
		</section>
	)
}
