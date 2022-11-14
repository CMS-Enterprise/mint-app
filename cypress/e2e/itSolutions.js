describe('The Model Plan Ops Eval and Learning Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER' });
  });

  it('completes a Model Plan Ops Eval and Learning form', () => {
    cy.clickPlanTableByName('Empty Plan');

    cy.get('[data-testid="ops-eval-and-learning"]').click();

    cy.wait(500);

    cy.get('#ops-eval-and-learning-help-desk-use-true')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Save and return to task list').click();

    cy.get('[data-testid="ops-eval-and-learning"]').click();

    cy.get('#ops-eval-and-learning-help-desk-use-warning').click();

    cy.wait(500);

    cy.get('[data-testid="needs-table"] tbody tr')
      .should('have.length', 3)
      .first()
      .within(() => {
        cy.contains('Helpdesk support');
        cy.contains('Not started');
        cy.contains('Select a solution').click();
      });

    cy.get('[data-testid="toggle-need-answer"]').click();

    cy.get('[data-testid="need-question"]').contains(
      'Do you plan to use a helpdesk?'
    );

    cy.get('[data-testid="true"]').contains('Yes');

    cy.get('#it-solutions-cbosc').check({ force: true }).should('be.checked');

    cy.contains('button', 'Continue').click();

    cy.get('[data-testid="needs-table"] tbody tr')
      .should('have.length', 3)
      .first()
      .within(() => {
        cy.contains('Helpdesk support');
        cy.contains('Consolidated Business Operations Support Center (CBOSC)');
      });
  });
});
