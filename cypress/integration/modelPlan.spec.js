describe('The Model Plan Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'TEST' });
  });

  it('fills out model plan name and creates plan', () => {
    cy.visit('/');

    cy.wait(1000);

    cy.contains('a', 'Start a draft model plan').click();

    cy.contains('h1', 'Start a new model plan');

    cy.get('[data-testid="continue-link"]').click();

    // General Model Plan Information

    cy.get('#new-plan-model-name')
      .type('My New Model Plan')
      .should('have.value', 'My New Model Plan');

    cy.contains('button', 'Next').click();

    cy.wait(1000);

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/new-plan\/.{36}\/collaborators/);
    });

    cy.get('[data-testid="continue-to-tasklist"]').click();

    cy.wait(1000);

    cy.contains('h1', 'Model Plan task list');
  });

  it.only('updates model plan status', () => {
    cy.visit('/');

    cy.contains('a', 'Start a draft model plan').click();
    cy.contains('h1', 'Start a new model plan');
    cy.get('[data-testid="continue-link"]').click();

    // Creates a new plan
    cy.get('#new-plan-model-name')
      .type('Updating Status')
      .should('have.value', 'Updating Status');
    cy.contains('button', 'Next').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/new-plan\/.{36}\/collaborators/);
    });
    cy.get('[data-testid="continue-to-tasklist"]').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
    });
    cy.contains('h1', 'Model Plan task list');
    cy.get('.mint-tag').contains('Draft model plan');
    cy.contains('a', 'Update').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/status/);
    });
    cy.contains('h1', 'Update status');
    cy.get('[data-testid="button"]')
      .contains('Update status')
      .should('be.disabled');
    cy.get('#Status-Dropdown')
      .select('Cleared')
      .should('have.value', 'CLEARED');
    cy.get('[data-testid="button"]')
      .contains('Update status')
      .should('be.not.disabled')
      .click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
    });
    cy.get('.mint-tag').contains('Cleared');
  });

  it('archives a model plan', () => {
    cy.visit('/models/f11eb129-2c80-4080-9440-439cbe1a286f/task-list');

    cy.wait(1000);

    cy.contains('button', 'Remove your Model Plan').click();

    cy.contains('button', 'Remove request').click();

    cy.wait(1000);

    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/');
    });

    cy.wait(1000);

    cy.get('table').within(() => {
      cy.get('tbody').within(() => {
        cy.contains('th', 'My excellent plan that I just initiated').should(
          'not.exist'
        );
      });
    });
  });
});
