import type { LeaderboardEntry } from '../types/leaderboard';

export function filterEntries(
  entries: LeaderboardEntry[],
  searchTerm: string,
): LeaderboardEntry[] {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  if (!normalizedSearch) {
    return entries;
  }

  return entries.filter((entry) =>
    entry.teamName.toLowerCase().includes(normalizedSearch),
  );
}
