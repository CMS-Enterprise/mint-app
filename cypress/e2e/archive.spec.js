describe('The Model Plan Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER_NONPROD' });
  });

  it('archives a model plan', () => {
    cy.clickPlanTableByName('Empty Plan');

    cy.contains('button', 'Remove your Model Plan').clickEnabled();

    cy.contains('button', 'Remove Model Plan').clickEnabled();

    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/');
    });

    cy.get('table').within(() => {
      cy.get('tbody').within(() => {
        cy.contains('th', 'Empty Plan').should('not.exist');
      });
    });
  });
});
