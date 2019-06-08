export interface ContestInfo {
  title: string;
  url: string;
  startTime: string;
  endTime: string;
  penalty?: number;
}

export type ContestSummary = { [key: string] : number }