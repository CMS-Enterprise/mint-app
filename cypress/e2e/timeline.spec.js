describe('The model timeline form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('completes a the timeline form', () => {
    cy.visit('/');

    cy.contains('a', 'Start a new Model Plan').click();
    cy.contains('h1', 'Start a new model plan');
    cy.get('[data-testid="continue-link"]').click();

    // General Model Plan Information

    cy.get('#new-plan-model-name')
      .type('My New Timeline Model Plan')
      .should('have.value', 'My New Timeline Model Plan');

    cy.contains('button', 'Next').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/collaboration-area\/collaborators/
      );
    });

    cy.get('[data-testid="page-loading"]').should('not.exist');

    cy.get('[data-testid="continue-to-collaboration-area"]').click();

    // renames a model plan
    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/collaboration-area/);
    });

    cy.get('[data-testid="page-loading"]').should('not.exist');

    // Enter into DEA form
    cy.get('[data-testid="to-timeline"]').click();

    cy.get('[data-testid="fieldset"]').should('not.be.disabled');

    cy.get('#timeline-completeICIP')
      .type('05/23/2065')
      .should('have.value', '05/23/2065');

    cy.get('#timeline-clearanceStarts')
      .type('05/23/2065')
      .should('have.value', '05/23/2065');

    cy.get('#timeline-clearanceEnds')
      .type('05/23/2021')
      .should('have.value', '05/23/2021');

    cy.get('#timeline-announced')
      .type('05/23/2065')
      .should('have.value', '05/23/2065');

    cy.get('#timeline-applicationsStart')
      .type('05/23/2065')
      .should('have.value', '05/23/2065');

    cy.get('#timeline-applicationsEnd')
      .type('05/23/2065')
      .should('have.value', '05/23/2065');

    cy.get('#timeline-performancePeriodStarts')
      .type('05/23/2065')
      .should('have.value', '05/23/2065');

    cy.get('#timeline-performancePeriodEnds')
      .type('05/23/2065')
      .should('have.value', '05/23/2065');

    cy.get('#timeline-wrapUpEnds')
      .type('05/23/2065')
      .should('have.value', '05/23/2065');

    cy.contains('button', 'Save').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/collaboration-area/);
    });

    cy.get('[data-testid="update-status-modal"]').should('exist');

    cy.get('button').contains('Yes, update status').click();

    cy.get('[data-testid="alert"]').contains(
      'You have successfully updated the status to Cleared.'
    );
  });
});
