import { expect, test } from "@playwright/test";

import { ChangePCP } from "../pages/changePCP";
import testData from "../testdata/testdata.json";
import { sharedAssertions } from "../pages/assertions";
import { assertionTexts } from "../utils/assertionTexts";
import { SignatureHandler } from "../utils/signatureHandler";
import { SharedFormActions } from "../utils/sharedFormActions";
import { expectTextSimilarityAtLeast } from "../utils/fuzzyTextAssertions";
import { SelfHealingLocator } from "../utils/selfHealingLocator";

test.describe.configure({ mode: "serial" });

test.describe("Change PCP Regression testsuite", () => {
  const envTarget = "qa";
  const providerNotFoundtxt =
    assertionTexts.global.validationErrors.providerNotFound;
  const memberNotFoundtxt =
    assertionTexts.global.validationErrors.memberNotFound;

  let pcpChange: ChangePCP;
  let signatureHandler: SignatureHandler;
  let formAssert: sharedAssertions<ChangePCP["sharedFormActions"]>;

  test.beforeEach(async ({ page }, info) => {
    pcpChange = new ChangePCP(page);
    signatureHandler = new SignatureHandler(page);
    formAssert = new sharedAssertions(page, pcpChange.sharedFormActions);
    await pcpChange.navigateToChangePCP(envTarget);

    console.log(`\nRunning test: ${info.title}`);
  });

  test.afterEach(async ({ page }, info) => {
    console.log(`Finished test: ${info.title}\n`);
  });

  test("Validate Provider Not Found message is => 98% match .", async ({ page }) => {
    await formAssert.ui.toHaveHeader(assertionTexts.pages.pcpChange.header);

    await pcpChange.fillProviderSection(testData.Data.ProviderDataInvalidNPI);

    const providerNotFoundMessage = await new SelfHealingLocator(
      pcpChange.formRoot,
    ).require(
      pcpChange.sharedFormActions.providerNotFound,
      "Error Message",
      "textbox",
      { description: "Provider not found message" },
    );
    await expect(providerNotFoundMessage).toHaveValue(/.+/);
    expectTextSimilarityAtLeast(
      await providerNotFoundMessage.inputValue(),
      providerNotFoundtxt,
    );
    console.log("Validation Message Confirmed:", providerNotFoundtxt);
  });

    test("Fail if message Provider Not Found is < 98% match .", async ({ page }) => {
    await formAssert.ui.toHaveHeader(assertionTexts.pages.pcpChange.header);

    await pcpChange.fillProviderSection(testData.Data.ProviderDataInvalidNPI);

    const providerNotFoundMessage = await new SelfHealingLocator(
      pcpChange.formRoot,
    ).require(
      pcpChange.sharedFormActions.providerNotFound,
      "Error Message",
      "textbox",
      { description: "Provider not found message" },
    );
    await expect(providerNotFoundMessage).toHaveValue(/.+/);
    expectTextSimilarityAtLeast(
      await providerNotFoundMessage.inputValue(),
      memberNotFoundtxt,
    );
    console.log("Validation Message Confirmed:", providerNotFoundtxt);
  });

});
