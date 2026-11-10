import { expect } from "@playwright/test";

function normalizeText(text: string): string[] {
  return Array.from(text.trim().replace(/\s+/g, " ").toLowerCase());
}

export function calculateTextSimilarity(
  actual: string,
  expected: string,
): number {
  const actualCharacters = normalizeText(actual);
  const expectedCharacters = normalizeText(expected);
  const longestLength = Math.max(
    actualCharacters.length,
    expectedCharacters.length,
  );

  if (longestLength === 0) {
    return 100;
  }

  let previousRow = Array.from(
    { length: expectedCharacters.length + 1 },
    (_, index) => index,
  );

  for (
    let actualIndex = 1;
    actualIndex <= actualCharacters.length;
    actualIndex += 1
  ) {
    const currentRow = [actualIndex];

    for (
      let expectedIndex = 1;
      expectedIndex <= expectedCharacters.length;
      expectedIndex += 1
    ) {
      const substitutionCost =
        actualCharacters[actualIndex - 1] ===
        expectedCharacters[expectedIndex - 1]
          ? 0
          : 1;

      currentRow[expectedIndex] = Math.min(
        currentRow[expectedIndex - 1] + 1,
        previousRow[expectedIndex] + 1,
        previousRow[expectedIndex - 1] + substitutionCost,
      );
    }

    previousRow = currentRow;
  }

  return (
    ((longestLength - previousRow[expectedCharacters.length]) / longestLength) *
    100
  );
}

export function expectTextSimilarityAtLeast98(
  actual: string,
  expected: string,
  minimumPercent = 98,
): void {
  if (
    !Number.isFinite(minimumPercent) ||
    minimumPercent < 0 ||
    minimumPercent > 100
  ) {
    throw new RangeError(
      `Minimum similarity must be a finite percentage from 0 to 100; received ${minimumPercent}.`,
    );
  }

  const similarity = calculateTextSimilarity(actual, expected);

  expect(
    similarity,
    `Expected text to be at least ${minimumPercent}% similar; ` +
      `actual similarity was ${similarity.toFixed(2)}%.`,
  ).toBeGreaterThanOrEqual(minimumPercent);
}
export function expectTextSimilarityAtLeast95(
  actual: string,
  expected: string,
  minimumPercent = 95,
): void {
  if (
    !Number.isFinite(minimumPercent) ||
    minimumPercent < 0 ||
    minimumPercent > 100
  ) {
    throw new RangeError(
      `Minimum similarity must be a finite percentage from 0 to 100; received ${minimumPercent}.`,
    );
  }

  const similarity = calculateTextSimilarity(actual, expected);

  expect(
    similarity,
    `Expected text to be at least ${minimumPercent}% similar; ` +
      `actual similarity was ${similarity.toFixed(2)}%.`,
  ).toBeGreaterThanOrEqual(minimumPercent);
}
