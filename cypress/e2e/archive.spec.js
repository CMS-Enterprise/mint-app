describe('The Model Plan Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('archives a model plan', () => {
    cy.clickPlanTableByName('Empty Plan');

    cy.contains('button', 'Remove your Model Plan').click();

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
