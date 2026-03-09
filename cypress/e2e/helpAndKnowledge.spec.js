describe('Help and Knowledge Center', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');

    cy.enterModelPlanCollaborationArea('Empty Plan');

    cy.get('[data-testid="Card"]')
      .filter(':has(h3:contains("Model-to-operations matrix"))')
      .within(() => {
        cy.contains('button', 'Go to matrix').click({ force: true });
      });

    cy.url().should(
      'include',
      '/collaboration-area/model-to-operations/matrix'
    );
  });

  it('Filters milestone library by category in Help and Knowledge Center', () => {
    cy.visit('/help-and-knowledge/milestone-library');

    cy.get('[data-testid="Card"]', { timeout: 10000 }).should(
      'have.length.greaterThan',
      0
    );
    cy.get('[data-testid="Card"]').its('length').as('cardCountBefore');

    cy.contains('button', 'Filter').click({ force: true });

    cy.get('.mint-filter-modal').within(() => {
      // Find #Learning input, then click its label sibling so the checkbox toggles.
      cy.get('.mint-filter-group')
        .first()
        .find('#Learning')
        .siblings('label')
        .scrollIntoView()
        .click({ force: true });
      cy.contains('button', 'Apply filter').click({ force: true });
    });

    cy.get('.mint-filter-modal').should('not.exist');

    cy.get('@cardCountBefore').then(cardCountBefore => {
      cy.get('[data-testid="Card"]').should(
        'have.length.at.most',
        cardCountBefore
      );
    });
    cy.get('[data-testid="Card"]').should('have.length.greaterThan', 0);
  });
});
