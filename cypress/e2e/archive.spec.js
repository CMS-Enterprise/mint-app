describe('The Model Plan Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER_NONPROD' });
  });

  it('archives a model plan', () => {
    cy.clickPlanTableByName('Enhancing Oncology Model');

    cy.contains('button', 'Remove your Model Plan').click();

    cy.contains('button', 'Remove Model Plan').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/');
    });

    cy.get('table').within(() => {
      cy.get('tbody').within(() => {
        cy.contains('th', 'Enhancing Oncology Model').should('not.exist');
      });
    });
  });
});
