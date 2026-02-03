const { I } = inject();
import { expect } from '@playwright/test';

class OfferSearchFragment {
  // locators
  searchInput = "//input[@data-qa='search-input']";
  searchResults = "//sports-events-event-card";

  noResultIcon = '//div[@class="errorPage_headerImg"]';
  noResultTextTitle =
    '//div[@class="errorPage_content"]//div[contains(@class,"contentTitle")]';
  noResultTextDescription =
    '//div[@class="errorPage_content"]//div[contains(@class,"contentDescription")]';

  // methods

  public async typeInTheSearch(input: string): Promise<void> {
    await I.fillField(this.searchInput, input);
    await I.waitForResponse(
      (response) =>
        response.status() === 200 &&
        response
          .url()
          .includes("https://offering.begmedia.com/web"),
      10
    );
  }

  public async validateNoContent(dataTable: any): Promise<void> {
    const currentTextTitle = await I.grabTextFrom(this.noResultTextTitle);
    const expectedTitle = dataTable.parse().hashes()[0].expectedTitle;
    const currentTextDescription = await I.grabTextFrom(
      this.noResultTextDescription
    );
    const expectedDescription = dataTable
      .parse()
      .hashes()[0].expectedDescription;

    I.assertContain(currentTextTitle, expectedTitle);
    I.assertContain(currentTextDescription, expectedDescription);
  }

  public async validateAtLeastOneResult(): Promise<void> {
    const results = await I.grabNumberOfVisibleElements(this.searchResults);
    expect(results).toBeGreaterThanOrEqual(1);
  }
}

export = new OfferSearchFragment();
