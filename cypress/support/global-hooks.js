before(() => {
  cy.exec('scripts/dev db:restore', {
    timeout: 120000,
    failOnNonZeroExit: true
  });
});
