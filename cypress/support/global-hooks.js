beforeEach(() => {
  cy.exec('scripts/dev db:clean', { timeout: 20000 })
    .its('code')
    .should('eq', 0)
    .then(cleanResult => {
      cy.log('db:clean code', cleanResult.code);
      cy.log('db:clean stdout', cleanResult.stdout);
      cy.log('db:clean stderr', cleanResult.stderr);

      cy.exec('scripts/dev db:seed', { timeout: 20000 })
        .its('code')
        .should('eq', 0)
        .then(seedResult => {
          cy.log('db:seed code', seedResult.code);
          cy.log('db:seed stdout', seedResult.stdout);
          cy.log('db:seed stderr', seedResult.stderr);
        });
    });
});
