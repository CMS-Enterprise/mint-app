beforeEach(() => {
  cy.exec('scripts/dev db:clean').then(result => {
    cy.log('db:clean code', result.code);
    cy.log('db:clean stdout', result.stdout);
    cy.log('db:clean stderr', result.stderr);
  });
  cy.exec('scripts/dev db:seed').then(result => {
    cy.log('db:seed code', result.code);
    cy.log('db:seed stdout', result.stdout);
    cy.log('db:seed stderr', result.stderr);
  });
});
