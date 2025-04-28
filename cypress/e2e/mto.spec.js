describe('Model-to-Operations Matrix', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');

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
  });

  it('Fills out an empty MTO Matrix with milestones and solutions', () => {
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

    cy.findModalWithThisHeadingAndSaveAlias(
      'Add a solution for this milestone?',
      'addSolutionToMilestoneModal'
    );

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
        cy.contains('Select a solution').click();
      });
    });

    cy.findModalWithThisHeadingAndSaveAlias(
      'Add a solution for this milestone?',
      'addSolutionModal'
    );
    cy.get('@addSolutionModal').within(() => {
      cy.get('#multi-source-data-to-collect').click().type('4i{enter}');
      cy.get('#clear-selection')
        .parent()
        .find('[class$="indicatorContainer"]')
        .eq(1)
        .click();
      cy.get('#multi-source-data-to-collect-tags li').should(
        'have.length.greaterThan',
        0
      );
      cy.contains('Add 1 solution').click();
    });

    cy.get('table').within(() => {
      cy.get('td').contains('4i').should('exist');
    });
  });
  it('Adding a Solution from the Solution Library', () => {
    cy.contains('Browse solution library').click();
    cy.url().should('include', '/solution-library');

    // Add the second solution
    cy.get('[data-testid="Card"]')
      .eq(1)
      .as('secondCard')
      .within(() => {
        cy.get('h3')
          .invoke('text')
          .then(text => {
            // Save the milestone name
            cy.wrap(text.trim()).as('solutionHeading');
          });
        cy.contains('Add to matrix').should('exist');
        // Open up Solutions Sidepanel
        cy.contains('About this solution').should('exist').click();
      });

    cy.get('@solutionHeading').then(solutionHeading => {
      cy.get('[role="dialog"]')
        .scrollIntoView()
        .within(() => {
          cy.contains(solutionHeading).should('be.visible');
        })
        .as('sidePanel');
      cy.get('[aria-label="Close Modal"]').click();
    });

    cy.get('@sidePanel').should('not.exist');

    cy.get('@secondCard').within(() => {
      cy.contains('Add to matrix').click();
    });
  });
});
