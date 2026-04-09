export type OpenSheetRow = {
  email: string;
  teamName: string;
  rank: string;
  earnings: string;
  golferOne: string;
  golferTwo: string;
  golferThree: string;
  golferFour: string;
  golferFive: string;
  golferSix: string;
  golferSeven: string;
  golferEight: string;
  golferNine: string;
  golferTen: string;
  golferEleven: string;
  golferTwelve: string;
  Tiebreaker: string;
};

export type LeaderboardEntry = {
  id: string;
  email: string;
  teamName: string;
  rank: string;
  earnings: number;
  golfers: string[];
  tiebreaker: string;
};

export type Payout = {
  place: string;
  prize: string;
  detail?: string;
};
