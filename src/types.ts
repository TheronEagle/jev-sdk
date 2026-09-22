export interface JevChoice {
  team: string;
  probability: number;
}

export interface JevScore {
  blastRadius: number;
  confidence: number;
}

export interface JevNoul {
  unique: boolean;
  description: string;
}

export type JevResponse =
  | { type: "Choice"; result: JevChoice }
  | { type: "Score"; result: JevScore }
  | { type: "Noul"; result: JevNoul };
