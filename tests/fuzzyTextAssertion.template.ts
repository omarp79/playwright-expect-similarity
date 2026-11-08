import { expect, test } from "@playwright/test";
import { expectTextSimilarityAtLeast } from "../utils/fuzzyTextAssertions";

test("returned message is at least 98% similar to the expected text", async ({
  page,
}) => {
  // Replace this URL with the page or route under test.
  await page.goto("https://replace-with-your-test-page");

  // Replace this locator with a precise locator for the text you want to verify.
  const message = page.getByRole("alert");
  await expect(message).toBeVisible();

  const actualText = await message.innerText();
  const expectedText = "Replace with the expected message";

  // The default threshold is 98%. Pass a third argument to use another threshold.
  expectTextSimilarityAtLeast(actualText, expectedText);
});
