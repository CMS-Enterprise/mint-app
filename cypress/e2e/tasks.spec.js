describe('Tasks page', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('shows current tasks for Empty Plan', () => {
    cy.enterModelPlanCollaborationArea('Empty Plan');

    cy.contains('button', /See all \(5\)/).should('be.visible');

    cy.contains('button', /See all \(\d+\)/).click();

    cy.url().should('include', '/collaboration-area/tasks');
    cy.get('[data-testid="tasks-page"]').should('be.visible');
    cy.get('[data-testid="model-plan-name"]').contains('Empty Plan');

    cy.contains('h3', 'Start your Model Plan').should('be.visible');
    cy.contains('h3', 'Start your data exchange approach').should('be.visible');
    cy.contains('h3', 'Complete your waiver assessment survey').should(
      'be.visible'
    );
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

    cy.location('pathname').should(
      'match',
      /\/models\/[^/]+\/collaboration-area\/model-plan$/
    );

    cy.go('back');

    cy.contains('h3', 'Start your model-to-operations matrix (MTO)')
      .closest('.collaboration-area__card')
      .contains('button', 'Start')
      .click();

    // Base path navigates to /matrix; MTOHome adds view (and page) to search — not part of pathname.
    cy.location('pathname').should(
      'match',
      /\/models\/[^/]+\/collaboration-area\/model-to-operations\/matrix$/
    );
    cy.location('search').should('include', 'view=milestones');
  });

  it('Plan with Data Exchange shows a completed task on the Completed tab', () => {
    cy.enterModelPlanCollaborationArea('Plan with Data Exchange');

    cy.contains('button', /See all \(\d+\)/).click();

    cy.location('pathname').should(
      'match',
      /\/models\/[^/]+\/collaboration-area\/tasks$/
    );

    cy.get('[data-testid="completed-tab"]').click();

    cy.url().should('include', 'tab=completed');

    cy.contains('h3', 'Finalize your data exchange approach').should(
      'be.visible'
    );
  });

  it('adds an approved ICIP from the task card, then marks the task complete and to-do', () => {
    cy.enterModelPlanCollaborationArea('Plan with Data Exchange');

    cy.contains('button', /See all \(\d+\)/).click();

    // Approved ICIP is UPCOMING until clearance starts, so it lives on the Upcoming tab.
    // Marking it to-do (the cleanup below) persists TO_DO rather than UPCOMING, so on a
    // retry without a DB reset the card sits on the Current tab instead.
    cy.get('[data-testid="upcoming-tab"]').click();
    cy.url().should('include', 'tab=upcoming');

    cy.get('body').then($body => {
      if ($body.find('h3:contains("Add approved ICIP")').length === 0) {
        cy.get('[data-testid="current-tab"]').click();
      }
    });

    cy.contains('h3', 'Add approved ICIP')
      .closest('.collaboration-area__card')
      .as('icipCard');

    cy.get('@icipCard')
      .contains('button', /Upload to ICIP repository on SharePoint/i)
      .should('be.visible');

    // Primary action opens Add document with Final ICIP preselected
    cy.get('@icipCard').contains('button', 'Add ICIP').click();

    cy.location('pathname').should(
      'match',
      /\/models\/[^/]+\/collaboration-area\/documents\/add-document$/
    );
    cy.contains('h1', 'Add a document');
    cy.contains('.usa-radio', 'Final ICIP').find('input').should('be.checked');

    cy.go('back');

    // Mark complete: success toast, then the task moves to the Completed tab
    cy.contains('h3', 'Add approved ICIP')
      .closest('.collaboration-area__card')
      .contains('label', 'Mark this task complete')
      .click();

    cy.get('[data-testid="toast-success"]').contains(
      'Add approved ICIP is now complete.'
    );

    cy.get('[data-testid="completed-tab"]').click();
    cy.url().should('include', 'tab=completed');
    cy.contains('h3', 'Add approved ICIP').should('be.visible');

    // Revert to to-do (not back to UPCOMING; that state is derived from clearance)
    cy.contains('h3', 'Add approved ICIP')
      .closest('.collaboration-area__card')
      .contains('button', 'Mark this task to do')
      .click();

    cy.get('[data-testid="toast-success"]').contains(
      'Add approved ICIP is now to-do.'
    );

    cy.contains('h3', 'Add approved ICIP').should('not.exist');
  });
});
