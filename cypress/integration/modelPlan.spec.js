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
      expect(loc.pathname).to.contain('/collaborators');
    });

    cy.get('[data-testid="continue-to-tasklist"]').click();

    cy.contains('h1', 'Model Plan task list');
  });

  it('adds collaborator to model plan', () => {
    cy.seedModelPlan({
      modelName: 'My Model Plan'
      //   status: 'PLAN_DRAFT'
    }).then(data => {
      cy.visit(`/models/${data.id}/collaborators`);
    });

    cy.contains('h1', 'Add model team members');
  });
});
