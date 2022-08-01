import { renderCurrentPage, renderTotalPages } from '.';

describe('Payment Page', () => {
  it('computes correct number of total pages', () => {
    const sevenPages = renderTotalPages(true, true, true);
    expect(sevenPages).toEqual(7);

    const basicThreePages = renderTotalPages(false, false, false);
    expect(basicThreePages).toEqual(3);

    const doesNotHaveClaims = renderTotalPages(false, true, false);
    expect(doesNotHaveClaims).toEqual(4);
  });

  it('computes current pages', () => {
    const currentPage = renderCurrentPage(1, true, true, true);
    expect(currentPage).toEqual(1);

    /*
      Ensure Complexity Page is rendering the correct page number with the following parameters:
      1. Has Claims Based Payment
      2. Has Non Claims Based Payment
      3. Does not have Reduction to Beneficiary Cost Sharing
    */
    const complexityPage = renderCurrentPage(6, true, true, false);
    expect(complexityPage).toEqual(5);
  });
});
