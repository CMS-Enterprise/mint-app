describe('Tasks page', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('shows current tasks for Empty Plan (seed keeps three incomplete tasks)', () => {
    cy.enterModelPlanCollaborationArea('Empty Plan');

    cy.contains('button', /See all \(3\)/).should('be.visible');

    cy.contains('button', /See all \(\d+\)/).click();

    cy.url().should('include', '/collaboration-area/tasks');
    cy.get('[data-testid="tasks-page"]').should('be.visible');
    cy.get('[data-testid="model-plan-name"]').contains('Empty Plan');

    cy.contains('h3', 'Start your Model Plan').should('be.visible');
    cy.contains('h3', 'Start your data exchange approach').should('be.visible');
    cy.contains('h3', 'Start your model-to-operations matrix (MTO)').should(
      'be.visible'
    );
  });

  it('opens Tasks page from collaboration area; Enhancing Oncology matches seeded task statuses', () => {
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

    cy.contains('h3', 'Iterate on your Model Plan').should('be.visible');
    cy.contains('h3', 'Start your model-to-operations matrix (MTO)').should(
      'be.visible'
    );

    cy.get('[data-testid="completed-tab"]')
      .should('be.visible')
      .invoke('text')
      .should('match', /Completed tasks \(0\)/);

    cy.get('[data-testid="completed-tab"]').click();

    cy.contains('h4', 'There are no completed tasks yet.').should('be.visible');
    cy.contains('Once you complete a task, it will appear here.').should(
      'be.visible'
    );

    cy.get('[data-testid="current-tab"]').click();

    cy.contains('h3', 'Iterate on your Model Plan')
      .closest('.collaboration-area__card')
      .contains('button', 'Continue')
      .click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/collaboration-area\/model-plan$/
      );
    });

    cy.go('back');

    cy.contains('h3', 'Iterate on your Model Plan')
      .closest('.collaboration-area__card')
      .contains('button', 'View sample Model Plan')
      .click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/help-and-knowledge\/sample-model-plan$/);
    });

    cy.go('back');

    cy.contains('h3', 'Start your model-to-operations matrix (MTO)')
      .closest('.collaboration-area__card')
      .contains('button', 'Start')
      .click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/collaboration-area\/model-to-operations\/matrix\?view=milestones$/
      );
    });

    cy.go('back');

    cy.contains('h3', 'Start your model-to-operations matrix (MTO)')
      .closest('.collaboration-area__card')
      .contains('button', 'View help article')
      .click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/help-and-knowledge\/creating-mto-matrix$/
      );
    });
  });

  it('Plan with Data Exchange shows a completed task on the Completed tab', () => {
    cy.enterModelPlanCollaborationArea('Plan with Data Exchange');

    cy.contains('button', /See all \(\d+\)/).click();

    cy.url().should('include', '/collaboration-area/tasks');

    cy.get('[data-testid="completed-tab"]').click();

    cy.contains('h3', 'Finalize your data exchange approach').should(
      'be.visible'
    );
  });
});
