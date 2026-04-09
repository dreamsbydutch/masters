import { LEADERBOARD_ENDPOINT } from '../config/dataSource';
import type { LeaderboardEntry, OpenSheetRow } from '../types/leaderboard';

const golferFields = [
  'golferOne',
  'golferTwo',
  'golferThree',
  'golferFour',
  'golferFive',
  'golferSix',
  'golferSeven',
  'golferEight',
  'golferNine',
  'golferTen',
  'golferEleven',
  'golferTwelve',
] as const;

function normalizeEntry(row: OpenSheetRow): LeaderboardEntry {
  const golfers = golferFields
    .map((field) => row[field]?.trim())
    .filter((golfer): golfer is string => Boolean(golfer));

  const earnings = Number.parseFloat(row.earnings);

  return {
    id: `${row.email}-${row.teamName}`.toLowerCase().replace(/\s+/g, '-'),
    email: row.email,
    teamName: row.teamName.trim(),
    rank: '0',
    earnings: Number.isFinite(earnings) ? earnings : 0,
    golfers,
    tiebreaker: row.Tiebreaker?.trim() ?? '',
  };
}

function compareEntriesByEarnings(a: LeaderboardEntry, b: LeaderboardEntry): number {
  if (b.earnings !== a.earnings) {
    return b.earnings - a.earnings;
  }

  return a.teamName.localeCompare(b.teamName, undefined, { sensitivity: 'base' });
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const response = await fetch(LEADERBOARD_ENDPOINT, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Leaderboard request failed with status ${response.status}.`);
  }

  const rows = (await response.json()) as OpenSheetRow[];

  if (!Array.isArray(rows)) {
    throw new Error('Leaderboard response did not return a valid list.');
  }

  return rows
    .map(normalizeEntry)
    .sort(compareEntriesByEarnings)
    .map((entry, index) => ({
      ...entry,
      rank: String(index + 1),
    }));
}
