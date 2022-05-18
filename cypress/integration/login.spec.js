describe('Logging in', () => {
  it('logs in with okta', () => {
    cy.login();
    cy.location('pathname', { timeout: 20000 }).should('equal', '/');
  });

  it('logs in with local auth', () => {
    cy.localLogin({ name: 'MINT', role: '' });

    cy.get('h1', { timeout: 20000 }).should('have.text', 'Welcome to MINT');
  });
});
