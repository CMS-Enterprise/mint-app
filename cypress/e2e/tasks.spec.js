describe('Tasks page', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('navigates to an empty state', () => {
    cy.enterModelPlanCollaborationArea('Empty Plan');

    cy.get('[data-testid="alert"]').within(() => {
      cy.contains('h4', 'Nothing to do here!').should('be.visible');
      cy.contains("You've completed all of the current tasks.").should(
        'be.visible'
      );
      cy.contains('Click here to view completed tasks.').should('be.visible');
    });
  });

  it('opens Tasks page from collaboration area and Model Plan primary action goes to model-plan', () => {
    cy.enterModelPlanCollaborationArea('Enhancing Oncology Model');

    cy.contains('button', /See all \(\d+\)/).click();

    cy.url().should('include', '/collaboration-area/tasks');

    cy.get('[data-testid="tasks-page"]').should('be.visible');
    cy.contains('h1', 'Tasks');
    cy.get('[data-testid="model-plan-name"]').contains(
      'Enhancing Oncology Model'
    );

    cy.get('[data-testid="current-tab"]')
      .should('be.visible')
      .invoke('text')
      .should('match', /Current tasks \(\d+\)/);

    cy.contains('h3', 'Start your Model Plan').should('be.visible');
    cy.contains(
      'h3',
      'Keep your model-to-operations matrix (MTO) up-to-date'
    ).should('be.visible');

    cy.get('[data-testid="completed-tab"]')
      .should('be.visible')
      .invoke('text')
      .should('match', /Completed tasks \(\d+\)/);
    cy.get('[data-testid="completed-tab"]').click();

    cy.contains('h3', 'Finalize your data exchange approach').should(
      'be.visible'
    );

    cy.get('[data-testid="current-tab"]').click();

    cy.contains('h3', /Model Plan/)
      .closest('.collaboration-area__card')
      .find('button')
      .first()
      .click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/collaboration-area\/model-plan$/
      );
    });

    cy.go('back');
    cy.contains('View sample Model Plan').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/help-and-knowledge\/sample-model-plan$/);
    });

    cy.go('back');

    cy.contains('Continue').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/collaboration-area\/model-to-operations\/matrix\?view=milestones$/
      );
    });

    cy.go('back');

    cy.contains('View help article').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/help-and-knowledge\/creating-mto-matrix$/
      );
    });
  });
});
