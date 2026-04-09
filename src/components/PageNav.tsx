type PageNavProps = {
	currentPage: 'pool' | 'pga'
}

const pages = [
	{ id: 'pool', label: 'Pool', hash: '#pool' },
	{ id: 'pga', label: 'PGA', hash: '#pga' },
] as const

export function PageNav({ currentPage }: PageNavProps) {
	return (
		<nav className="mx-auto mt-6 flex w-fit max-w-full flex-wrap justify-center gap-3 rounded-full bg-white/88 px-3 py-3 shadow-lg shadow-[#fbf308]/30 backdrop-blur-sm">
			{pages.map(page => {
				const isActive = page.id === currentPage

				return (
					<a
						key={page.id}
						href={page.hash}
						className={`rounded-full px-5 py-2 font-[MastersDisplay] text-base uppercase tracking-[0.2em] transition sm:text-lg ${
							isActive ? 'bg-[linear-gradient(180deg,#21483c_0%,#346c50_100%)] text-white' : 'bg-[#ece8dc] text-[#21483c] hover:bg-[#d8d2c4]'
						}`}>
						{page.label}
					</a>
				)
			})}
		</nav>
	)
}
