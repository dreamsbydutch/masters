import { POOL_PAYOUTS } from '../config/payouts'

export function PayoutGrid() {
	const [featured, ...standardPayouts] = POOL_PAYOUTS

	return (
		<section
			className="mt-5 rounded-[28px] border border-[rgba(16,56,31,0.14)] bg-[rgba(255,255,255,0.96)] px-4 py-4 shadow-[0_16px_38px_rgba(12,38,20,0.16)] sm:px-5"
			aria-labelledby="pool-payouts-title">
			<div className="flex flex-col gap-1">
				<h2
					id="pool-payouts-title"
					className="font-[MastersDisplay] text-[clamp(2rem,3vw,2.75rem)] leading-none tracking-[0.03em] text-[#0a4123] uppercase">
					2025 Pool Payouts
				</h2>
			</div>

			<div className="mt-4 grid gap-3 lg:items-stretch">
				<article className="grid gap-3 rounded-lg border border-[rgba(205,167,61,0.35)] bg-[linear-gradient(135deg,rgba(19,74,41,0.08),rgba(255,255,255,0.98))] px-4 py-4 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
					<p className="font-[MastersDisplay] text-12 tracking-widest text-[#0a4123] uppercase">{featured.place}</p>
					<div className="gap-1">
						<p className="font-[MastersDisplay] text-[clamp(2rem,3vw,2.8rem)] leading-none text-[#cda73d]">{featured.prize}</p>
						{featured.detail ? <p className="text-xl text-[#55655c]">{featured.detail}</p> : null}
					</div>
				</article>

				<div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5" aria-label="Additional prize payouts">
					{standardPayouts.map(payout => (
						<article
							className="text-center content-center gap-0.5 rounded-[18px] border border-[rgba(16,56,31,0.12)] bg-[rgba(255,255,255,0.96)] px-2 py-1"
							key={payout.place}>
							<span className="font-[MastersDisplay] text-[#0a4123] uppercase tracking-wider">{payout.place} -</span>
							<span className="text-[1.08rem] text-[#15311f] sm:text-[1.2rem]">{payout.prize}</span>
						</article>
					))}
				</div>
			</div>
		</section>
	)
}
