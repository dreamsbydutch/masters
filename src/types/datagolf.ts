export type DataGolfLeaderboardEntry = {
	id: string
	playerName: string
	position: string
	score: string
	roundScore: string
	thru: string
	totalSg: number | null
	makeCutProbability: number | null
	winProbability: number | null
}

export type DataGolfLeaderboard = {
	eventName: string | null
	entries: DataGolfLeaderboardEntry[]
}
