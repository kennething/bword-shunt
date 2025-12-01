type StringToUnion<S extends string> = S extends `${infer First}${infer Rest}` ? First | StringToUnion<Rest> : never;
export const letters = "abcdefghijklmnopqrstuvwxyz" as const;
export type Letter = StringToUnion<typeof letters>;

export type Board = Letter[][];

export type Position = [index: number, jndex: number];
export type HistoryEntry = {
  positions: Position[];
  word: string;
  isValid: boolean;
};

export function calculateScore(wordLength: number) {
  if (wordLength <= 2) return 0;
  if (wordLength === 3) return 100;
  if (wordLength === 4) return 400;
  if (wordLength === 5) return 800;
  if (wordLength >= 8) return 1400 + (wordLength - 6) * 400; // 1400, 1800, 2200
  return 2400 + (wordLength - 9) * 200; // 2400, 2600, 2800
}
