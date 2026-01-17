type StringToUnion<S extends string> = S extends `${infer First}${infer Rest}` ? First | StringToUnion<Rest> : never;
export const letters = "abcdefghijklmnopqrstuvwxyz" as const;
export type Letter = StringToUnion<typeof letters>;

export type Board = Letter[][];

export type Position = [index: number, jndex: number, elementX: number, elementY: number];
export type HistoryEntry = {
  positions: Position[];
  word: string;
  isValid: boolean;
};

export type UUID = string;
