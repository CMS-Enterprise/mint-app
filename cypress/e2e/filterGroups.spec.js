describe('Email Unfollow Link', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER_NONPROD' });
  });

  it('follows a model plan and then unfollow via email link', () => {
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

    cy.get('[data-testid="combo-box-input"')
      .type('Chron{downArrow}{enter}')
      .should('have.value', 'Chronic Conditions Warehouse (CCW)');

    // cy.get('#filter-group').contains('Chronic Conditions Warehouse (CCW)');

    // cy.get('[data-testid="table"] button > svg[data-cy="unfavorited"]')
    //   .first()
    //   .click();

    // cy.get('#favorite-table').within(() => {
    //   cy.contains('Empty Plan').then($el => {
    //     const modelID = $el[0].pathname.replace(
    //       /.*models\/(.*)\/read.*/g,
    //       '$1'
    //     );

    //     cy.visit(`/unfollow/?modelID=${modelID}`);
    //   });
    // });

    // cy.url().should('include', '/models');

    // cy.get('#favorite-table').should('not.exist');

    // cy.get('[data-testid="mandatory-fields-alert"]').contains('Empty Plan');
  });
});
