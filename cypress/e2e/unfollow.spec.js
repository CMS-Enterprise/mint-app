describe('Email Unfollow Link', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'ABCD' });
    cy.visit('/');
  });

  it('follows a model plan and then unfollow via email link', () => {
    cy.visit('/models');

    cy.get('[data-testid="table"] a')
      .contains('Empty Plan')
      .then($el => {
        cy.wrap($el.attr('href')).as('modelPlanURL');
      });

    cy.get('#favorite-table').should('not.exist');

    cy.get('[data-testid="table"] button > svg[data-cy="unfavorited"]')
      .first()
      .click();

    cy.get('#favorite-table').within(() => {
      cy.contains('Empty Plan').then($el => {
        const modelID = $el[0].pathname.replace(
          /.*models\/(.*)\/read.*/g,
          '$1'
        );

        cy.visit(`/unfollow/?modelID=${modelID}`);
      });
    });

    cy.url().should('include', '/models');

    cy.get('#favorite-table').should('not.exist');

    cy.get('[data-testid="mandatory-fields-alert"]').contains('Empty Plan');
  });
});
