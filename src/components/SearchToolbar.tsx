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
		<section className=" rounded-t-[100px] md:rounded-t-full bg-linear-to-b from-[#dad9d4] to-white pt-8 pb-2" aria-labelledby="leaderboard-title">
			<div className="text-4xl sm:text-5xl font-[MastersDisplay] text-[#fbf308] text-shadow-lg text-shadow-[#21483c] text-center uppercase pt-2 pb-6">
				Leaderboard
			</div>

			<div className="w-7/8 max-w-2xl mx-auto flex flex-row justify-between">
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
					className="rounded-xl w-9/12 border-2 border-[#346c50] px-4 bg-white text-[#21483c] hover:border-[#21483c] focus:outline-none focus:ring-2 focus:ring-[#21483c]/50 focus:border-[#21483c] transition"
				/>

				<dl className="w-2/12 md:w-1/12" aria-label="Leaderboard status">
					<div className="py-1 text-nowrap">
						<dt className="text-xs sm:text-sm tracking-widest text-[#346c50] uppercase">Updated</dt>
						<dd className="text-sm sm:text-md md:text-lg text-[#346c50]">{isRefreshing ? 'Refreshing...' : lastUpdatedLabel}</dd>
					</div>
				</dl>
			</div>
		</section>
	)
}
