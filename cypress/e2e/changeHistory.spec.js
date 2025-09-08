describe('Change History', () => {
  before(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('Displays changes correctly', () => {
    cy.enterModelPlanTaskList(
      'Plan with Documents',
      'all-model-plans-table-wrapper'
    );

    cy.exec('go run ./cmd/dbseed/*go translate', {
      timeout: 120000,
      failOnNonZeroExit: false
    }).then(seedResult => {
      cy.log('db:seed code', seedResult.code);
      cy.log('db:seed stdout', seedResult.stdout);
      cy.log('db:seed stderr', seedResult.stderr);
    });

    // Clicks the Change history tasklist item
    cy.get('[data-testid="view-change-history"]').click();

    // Check that audit is collapsed
    cy.get('[data-testid="shown-value"]').should('not.exist');

    // Open collapsed audit
    cy.get('[data-testid="batch-record-0"]').click();

    // Check that audit is expanded and value is visible
    cy.get('[data-testid="shown-value"]').should('be.visible');

    // Close expanded audit
    cy.get('[data-testid="batch-record-0"]').eq(1).click();

    // Check that audit is collapsed again
    cy.get('[data-testid="shown-value"]').should('not.exist');

    // Sorts changes correctly
    cy.get('[data-testid="Select"]').select('Oldest changes');

    cy.get('li.change-record')
      .first()
      .find('[data-testid="new-plan"]')
      .should('contain.text', 'this Model Plan');

    // Searches changes correctly
    cy.get('#table-id-search')
      .type('Plan with Documents', { delay: 100 })
      .should('have.value', 'Plan with Documents');

    cy.get('li.change-record').should('have.length', 1);

    // Should show no results
    cy.get('#table-id-search')
      .type('wegdsfdfaa', { delay: 100 })
      .should('have.value', 'Plan with Documentswegdsfdfaa');

    cy.get('li.change-record').should('have.length', 0);
    cy.get('[data-testid="alert"]').should(
      'contain.text',
      'There are no results that match your search.Please double-check your search and try again.'
    );
  });
});
