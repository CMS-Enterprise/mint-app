describe('The data exchange approach Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('completes a the data exchange approach form', () => {
    cy.enterModelPlanCollaborationArea('Empty Plan');

    // Enter into DEA form
    cy.get('[data-testid="to-data-exchange-approach"]').click();

    // Progress to the next page, just text on this page
    cy.contains('button', 'Next').click();

    cy.get('[data-testid="option-REPORTS_FROM_PARTICIPANTS"]')
      .check({ force: true })
      .should('be.checked');

    cy.get('[data-testid="option-OTHER"]')
      .check({ force: true })
      .should('be.checked');

    cy.clickOutside();

    cy.get('[data-testid="multiselect-tag--Other (please specify)"]')
      .first()
      .contains('Other');

    cy.get(
      '[data-testid="multiselect-tag--Reports from participants (please specify)"]'
    )
      .first()
      .contains('Reports from participants');
  });
});
