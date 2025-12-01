/**
 * Returns a random integer between `min` and `max`.
 *
 * @param min - The minimum value of the random integer.
 * @param max - The maximum value of the random integer.
 * @example getRandomInt(1, 10) -> 5
 */
export function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);

  let random: number = 0;
  for (let i = 0; i < Math.floor(Math.random() * 10); i++) {
    random = Math.random();
  }

  return Math.floor(random * (maxFloored - minCeiled + 1) + minCeiled);
}

/**
 * Returns a random item from a string.
 *
 * @param collection - The string to get a random item from.
 * @example getRandomItem("abcde") -> "c"
 */
export function getRandomItem(collection: string): string;
/**
 * Returns a random item from an array.
 *
 * @param collection - The array to get a random item from.
 * @example getRandomItem([1, 2, 3, 4, 5]) -> 3
 */
export function getRandomItem<T>(collection: T[]): T;
export function getRandomItem<T>(collection: T[] | string) {
  return collection[getRandomInt(0, collection.length - 1)];
}

export function calculateScore(wordLength: number) {
  if (wordLength <= 2) return 0;
  if (wordLength === 3) return 100;
  if (wordLength === 4) return 400;
  if (wordLength === 5) return 800;
  if (wordLength >= 8) return 1400 + (wordLength - 6) * 400; // 1400, 1800, 2200
  return 2400 + (wordLength - 9) * 200; // 2400, 2600, 2800
}

function getLetter(weights: Letter[]) {
  const letter = getRandomItem(letters) as Letter;
  if (!weights.includes(letter)) return letter;
  else if (Math.random() < 0.67) return letter;
  else return getLetter(weights);
}

/** Generates a 4x4 board of letters with optional weighting for certain letters
 * @param guaranteedPattern This string will appear somewhere on the board. Max length is 4
 * @param weights While drawing letters for board creation, letters in this array have a 33% chance to be replaced with a new random letter
 */
export function generateBoard(guaranteedPattern?: string, weights: Letter[] = ["q", "v", "w", "x", "y", "z"]): Letter[][] {
  const arr: Letter[][] = [];

  for (let i = 0; i < 4; i++) {
    const row: Letter[] = [];
    for (let j = 0; j < 4; j++) row.push(getLetter(weights));

    arr.push(row);
  }

  if (!guaranteedPattern || guaranteedPattern.length > 4) return arr;

  let i = getRandomInt(0, 3);
  let j = getRandomInt(0, 3);
  const previousPositions: [number, number][] = [[i, j]];
  for (let k = 0; k < guaranteedPattern.length; k++) {
    arr[i]![j] = guaranteedPattern[k] as Letter;

    const nextMoves = [
      [i + 1, j],
      [i - 1, j],
      [i, j + 1],
      [i, j - 1]
    ] as const satisfies [number, number][];
    const validNextMoves = nextMoves.filter(([x, y]) => previousPositions.every(([px, py]) => px !== x || py !== y) && x >= 0 && x < 4 && y >= 0 && y < 4);
    const nextPosition = getRandomItem(validNextMoves);

    previousPositions.push(nextPosition);
    i = nextPosition[0];
    j = nextPosition[1];
  }

  return arr;
}
