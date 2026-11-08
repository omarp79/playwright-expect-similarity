import { expect, test } from "@playwright/test";
import {
  calculateTextSimilarity,
  expectTextSimilarityAtLeast,
} from "../utils/fuzzyTextAssertions";

test.describe("Fuzzy text assertions", () => {
  test("scores identical strings as a 100% match", () => {
    expect(
      calculateTextSimilarity("Provider not found", "Provider not found"),
    ).toBe(100);
  });

  test("ignores case and repeated whitespace", () => {
    expect(
      calculateTextSimilarity(" Provider   NOT found ", "provider not found"),
    ).toBe(100);
  });

  test("scores two empty strings as a 100% match", () => {
    expect(calculateTextSimilarity("", "  ")).toBe(100);
  });

  test("passes at the default 98% threshold", () => {
    const expected = `${"a".repeat(49)}b`;
    const actual = "a".repeat(50);

    expect(calculateTextSimilarity(actual, expected)).toBe(98);
    expect(() => expectTextSimilarityAtLeast(actual, expected)).not.toThrow();
  });

  test("fails below the minimum threshold and reports the score", () => {
    expect(() => expectTextSimilarityAtLeast("cat", "dog", 98)).toThrow(
      /actual similarity was 0\.00%/,
    );
  });

  test("rejects thresholds outside 0 through 100", () => {
    expect(() => expectTextSimilarityAtLeast("same", "same", 101)).toThrow(
      "Minimum similarity must be a finite percentage from 0 to 100",
    );
  });
});
