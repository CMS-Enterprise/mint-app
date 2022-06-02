beforeEach(() => {
  cy.exec('scripts/dev db:clean');
  cy.exec('scripts/dev db:seed');
});
