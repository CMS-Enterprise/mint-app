describe('The Model Plan Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('archives a model plan', () => {
    cy.visit('/');

    cy.get(`[data-testid="table"] a`).contains('Empty Plan').click();
    cy.url().should('include', '/collaboration-area');

    cy.contains('button', '...').click();

    cy.contains('button', 'Remove this model from MINT').click();

    cy.contains('button', 'Remove Model Plan').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/');
    });

    cy.get('table')
      .first()
      .within(() => {
        cy.get('tbody').within(() => {
          cy.contains('th', 'Empty Plan').should('not.exist');
        });
      });
  });
});
