import { useEffect, useState } from 'react'
import { BackgroundSlideshow } from './components/BackgroundSlideshow'
import { Masthead } from './components/Masthead'
import { DataGolfLeaderboardPage } from './components/DataGolfLeaderboardPage'
import { PageNav } from './components/PageNav'
import { PoolLeaderboardPage } from './components/PoolLeaderboardPage'
import { PayoutGrid } from './components/PayoutGrid'

type AppPage = 'pool' | 'pga'

function getPageFromHash(hash: string): AppPage {
	return hash === '#pga' ? 'pga' : 'pool'
}

function App() {
	const [currentPage, setCurrentPage] = useState<AppPage>(() => getPageFromHash(window.location.hash))

	useEffect(() => {
		const syncPageFromHash = () => {
			setCurrentPage(getPageFromHash(window.location.hash))
		}

		syncPageFromHash()
		window.addEventListener('hashchange', syncPageFromHash)

		return () => window.removeEventListener('hashchange', syncPageFromHash)
	}, [])

	return (
		<div className="relative min-h-screen bg-[#183a24] font-[MastersSlab] text-[18px] text-[#15311f]">
			<BackgroundSlideshow />

			<main className="relative z-10 mx-auto w-[min(1180px,calc(100%-1rem))] px-0 pb-16 pt-5 sm:w-[min(1180px,calc(100%-2rem))]">
				<Masthead />
				{/* <PayoutGrid /> */}
				<PageNav currentPage={currentPage} />
				{currentPage === 'pga' ? <DataGolfLeaderboardPage /> : <PoolLeaderboardPage />}
			</main>
		</div>
	)
}

export default App
