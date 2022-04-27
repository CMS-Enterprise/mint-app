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

    cy.go('back');

    cy.contains('h1', 'Add model team members');
  });

  // TODO: Once database seeded with collaborators, can separate out of new plan test

  //   it('adds collaborator to model plan', () => {
  //     cy.visit(`/models/f11eb129-2c80-4080-9440-439cbe1a286f/collaborators`);

  //     cy.contains('h1', 'Add model team members');

  //     cy.get('table').within(() => {
  //       cy.get('thead').within(() => {
  //         cy.contains('th', 'Name');
  //         cy.contains('th', 'Role');
  //         cy.contains('th', 'Date added');
  //         cy.contains('th', 'Actions');
  //       });

  //       cy.get('tbody').within(() => {
  //         cy.contains('th', 'User TEST');
  //         cy.contains('td', 'Model Lead');
  //       });
  //     });

  //     cy.contains('button', 'Add team member').click();
  //   });
});
