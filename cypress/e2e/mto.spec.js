describe('Model-to-Operations Matrix', () => {
  before(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('Fills out an empty MTO Matrix with milestones and solutions', () => {
    cy.enterModelPlanCollaborationArea('Empty Plan');

    cy.get('[data-testid="Card"]')
      .filter(':has(h3:contains("Model-to-operations matrix"))')
      .within(() => {
        cy.contains('button', 'Go to matrix').click();
      });

    cy.url().should(
      'include',
      '/collaboration-area/model-to-operations/matrix'
    );

    cy.contains('h2', 'Your model-to-operations matrix is a bit empty!');

    cy.contains('a', 'Browse common solutions');
    cy.contains('button', 'Use this template');
    cy.contains('a', 'Browse common milestones').click();

    cy.url().should('include', '/milestone-library');

    cy.get('[data-testid="alert"]').contains(
      'h4',
      'There are no suggested milestones that match your search.'
    );

    cy.contains('button', /All common milestones/).click();
    cy.get('[data-testid="alert"]').should('not.exist');

    cy.get('[data-testid="Card"]')
      .first()
      .as('firstCard')
      .within(() => {
        cy.get('h3')
          .invoke('text')
          .then(text => {
            // Save the milestone name
            cy.wrap(text.trim()).as('milestoneHeading');
          });
        cy.contains('Add to matrix').should('exist');
        // Open up Milestone Sidepanel
        cy.contains('About this milestone').should('exist').click();
      });

    cy.get('[data-testid="milestone-sidepanel"')
      .should('exist')
      .as('milestoneSidepanel')
      .within(() => {
        // Open Add Solution to Milestone Modal
        cy.contains('Add to matrix').click();
      });

    cy.contains('h3', 'Add a solution for this milestone?')
      .closest('[role="dialog"]')
      .as('addSolutionToMilestoneModal');

    cy.get('@addSolutionToMilestoneModal').should('be.visible');

    cy.get('@addSolutionToMilestoneModal')
      .contains('button', 'Add without solutions')
      .click();

    cy.get('@milestoneSidepanel').within(() => {
      cy.contains('button', 'Added').should('be.disabled');
      cy.get('button[aria-label="Close Modal"]').click();
    });

    cy.get('@firstCard').within(() => {
      cy.contains('Add to matrix').should('not.exist');
      cy.contains('button', 'Added').should('be.disabled');
    });

    cy.contains('a', 'Return to model-to-operations matrix').click();
    cy.url().should(
      'include',
      '/collaboration-area/model-to-operations/matrix'
    );

    cy.contains('h2', 'Your model-to-operations matrix is a bit empty!').should(
      'not.exist'
    );
    cy.get('[data-testid="tasklist-tag"').contains('In progress');

    // Check to see saved milestone is inside the table
    cy.get('@milestoneHeading').then(headingText => {
      cy.get('table').within(() => {
        cy.get('td').contains(headingText).should('exist');
      });
    });
  });
});
