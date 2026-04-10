import { POOL_PAYOUTS } from '../config/payouts'

export function PayoutGrid() {
	const [featured, ...standardPayouts] = POOL_PAYOUTS

	return (
		<section className="my-2 max-w-4xl mx-auto rounded-xl bg-white px-4 py-4 shadow-lg shadow-[#f3db99] sm:px-5" aria-labelledby="pool-payouts-title">
			<div className="flex flex-col gap-1">
				<h2 id="pool-payouts-title" className="font-[MastersDisplay] text-base sm:text-xl md:text-2xl tracking-wide text-[#21483c] uppercase">
					2026 Pool Payouts
				</h2>
			</div>

			<div className="mt-2 flex gap-3 w-full flex-col sm:flex-row md:gap-5">
				<article className="flex flex-row sm:flex-col gap-3 sm:gap-0 rounded-2xl px-2 md:px-4 md:py-2 py-1 items-center border border-[#996515] shadow-md shadow-[#21483c]">
					<p className="font-[MastersDisplay] text-base sm:text-lg md:text-xl tracking-wider text-[#21483c] uppercase">{featured.place}</p>
					<div className="gap-1">
						<p className="font-[MastersDisplay] text-2xl sm:text-3xl md:text-4xl text-[#d4af37]">{featured.prize}</p>
						{featured.detail ? <p className="text-sm sm:text-base md:text-lg text-[#55655c] text-nowrap">{featured.detail}</p> : null}
					</div>
				</article>

				<div className="flex flex-wrap gap-1 justify-around items-center" aria-label="Additional prize payouts">
					{standardPayouts.map(payout => (
						<article
							className=" flex flex-row items-center text-center justify-center gap-0.5 rounded-2xl border border-[#346c50] bg-white w-28 md:w-32 md:h-10 h-8"
							key={payout.place}>
							<span className="font-[MastersDisplay] text-[#21483c] text-xs sm:text-sm uppercase tracking-wider">{payout.place} -</span>
							<span className="text-base sm:text-lg text-[#21483c] md:text-xl">{payout.prize}</span>
						</article>
					))}
				</div>
			</div>
		</section>
	)
}
