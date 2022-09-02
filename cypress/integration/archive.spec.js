describe('The Model Plan Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER' });
  });

  it('archives a model plan', () => {
    cy.clickPlanTableByName('Empty Plan');

    cy.contains('button', 'Remove your Model Plan').click();

    cy.contains('button', 'Remove request').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/models');
    });

    cy.get('table').within(() => {
      cy.get('tbody').within(() => {
        cy.contains('th', 'Empty Plan').should('not.exist');
      });
    });
  });
});
