describe('Logging in', () => {
  it('logs in with okta', () => {
    cy.login();
    cy.location('pathname', { timeout: 20000 }).should(
      'equal',
      '/pre-decisional-notice'
    );
  });

  it('logs in with local auth an verifies NDA', () => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER' });

    cy.get('h1', { timeout: 20000 }).should('have.text', 'Welcome to MINT');

    cy.logout();

    cy.localLogin({ name: 'MINT', role: 'MINT_USER', nda: true });

    cy.get('h1', { timeout: 20000 }).should('have.text', 'Welcome to MINT');
  });
});
