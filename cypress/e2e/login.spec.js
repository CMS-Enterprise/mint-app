describe('Logging in', () => {
  xit('logs in with okta', () => {
    cy.login();
    cy.location('pathname', { timeout: 20000 }).should(
      'equal',
      '/pre-decisonal-notice'
    );
  });

  it('logs in with local auth', () => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER' });

    cy.get('h1', { timeout: 20000 }).should('have.text', 'Welcome to MINT');
  });
});
