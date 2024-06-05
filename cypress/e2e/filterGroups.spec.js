describe('Filter Group in Read Only Sections', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
  });

  it('Viewing the CCW filtered group view', () => {
    cy.visit('/models');

    cy.get('[data-testid="table"] a')
      .contains('Enhancing Oncology Model')
      .click();

    cy.get('[data-testid="group-filter-banner"]')
      .should('exist')
      .contains('You are viewing all information about this model.');

    cy.get('[data-testid="group-filter-banner"]').within(() => {
      cy.get('button').should('exist').contains('Filter').click();
    });

    cy.get('[data-testid="filter-view-modal"').should('exist');

    cy.get('[data-testid="filter-view-submit"]')
      .contains('View filtered content')
      .should('be.disabled');

    cy.get('[data-testid="combo-box-input"')
      .type('Chron{downArrow}{enter}')
      .should('have.value', 'Chronic Conditions Warehouse (CCW)');

    cy.get('[data-testid="filter-view-submit"]')
      .contains('View filtered content')
      .should('not.be.disabled')
      .click();

    cy.url().should('include', '?filter-view=ccw');

    cy.get('[data-testid="group-filter-banner"]')
      .should('exist')
      .contains('You are viewing CCW information.');

    cy.get('#read-only-side-nav__wrapper').should('not.exist');
    cy.get('.filtered-view-section--model-team').should('exist');

    // Clear filter after viewing the CCW filtered group view

    cy.get('[data-testid="group-filter-banner"]').within(() => {
      cy.get('button').contains('Clear filter').click();
    });

    cy.get('[data-testid="group-filter-banner"]').contains(
      'You are viewing all information about this model.'
    );
  });
});
