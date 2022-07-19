describe('The Model Plan IT Tools Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
  });

  it('completes a Model Plan IT Tools form', () => {
    cy.clickPlanTableByName('PM Butler');

    // Clicks the IT Tools tasklist item
    cy.get('[data-testid="it-tools"]').click();

    // Page - /it-tools/page-one

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/it-tools\/page-one/
      );
    });

    cy.get('[data-testid="model-plan-name"]').contains('PM Butler');

    cy.get('#it-tools-gc-partc-OTHER')
      .check({ force: true })
      .should('be.checked');

    // cy.contains('button', 'Next').click();

    // Page - /it-tools/page-two

    // cy.wait(500);

    // cy.contains('button', 'Save and start next Model Plan section').click();

    // cy.location().should(loc => {
    //   expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
    // });

    // cy.get(
    //   '[data-testid="task-list-intake-form-ops-eval-and-learning"]'
    // ).contains('In progress');
  });
});
