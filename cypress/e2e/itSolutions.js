describe('The Model Plan IT solutions tracker', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER_NONPROD' });
  });

  it('completes a Model Plan IT solutions tracker', () => {
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
      .should('have.length', 1)
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

    cy.get('#add-solution-not-listed').click();

    cy.get('#it-solutions-key').select('Other');
    cy.get('#it-solutions-key').contains('Other');

    cy.get('#add-custom-solution-button').click();

    cy.get('#it-solution-custom-name-other')
      .type('My custom solution')
      .should('have.value', 'My custom solution');

    cy.get('#it-solution-custom-poc-name')
      .type('John Doe')
      .should('have.value', 'John Doe');

    cy.get('#it-solution-custom-poc-email')
      .type('j.doe@oddball.io')
      .should('have.value', 'j.doe@oddball.io');

    cy.get('#submit-custom-solution').click();

    cy.wait(500);

    cy.get('#add-solution-details-button').click();

    cy.wait(500);

    cy.get('#it-solutions-cbosc').check({ force: true }).should('be.checked');

    cy.get('#it-solutions-through_a_contractor')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Continue').click();

    cy.wait(500);

    cy.get('#solution-must-start-CBOSC')
      .type('12/10/2030')
      .should('have.value', '12/10/2030');

    cy.get('#solution-status-CBOSC-AT_RISK')
      .check({ force: true })
      .should('be.checked');

    cy.get('#solution-must-start-My-custom-solution')
      .type('12/10/2030')
      .should('have.value', '12/10/2030');

    cy.get('#solution-status-My-custom-solution-ONBOARDING')
      .check({ force: true })
      .should('be.checked');

    cy.get('#submit-solutions').click();

    cy.get('[data-testid="needs-table"] tbody tr')
      .should('have.length', 3)
      .first()
      .within(() => {
        cy.contains('Helpdesk support');
        cy.contains('My custom solution');
      });

    cy.get('[data-testid="needs-table"] tbody tr')
      .should('have.length', 3)
      .eq(2)
      .within(() => {
        cy.contains('Helpdesk support');
        cy.contains('Consolidated Business Operations Support Center (CBOSC)');
        cy.contains('View details').click();
      });

    cy.get('[data-testid="update-solutions-link"]').click();

    cy.get('[data-testid="alert"]').contains(
      'Adding additional solutions will create new solution pages, and removing a selected solution will delete the corresponding solution page. Tread carefully.'
    );

    cy.get('#it-solutions-through_a_contractor')
      .uncheck({ force: true })
      .should('not.be.checked');

    cy.contains('button', 'Continue').click();

    cy.wait(500);

    cy.get('[data-testid="alert"]').contains(
      'Saving these selections will delete the Through a contractor solution page/s that is associated with this operational need.'
    );

    cy.get('#submit-solutions').click();
  });
});
