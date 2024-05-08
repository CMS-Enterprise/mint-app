before(() => {
  cy.exec('scripts/dev db:clean', {
    timeout: 120000,
    failOnNonZeroExit: false
  }).then(cleanResult => {
    cy.log('db:clean code', cleanResult.code);
    cy.log('db:clean stdout', cleanResult.stdout);
    cy.log('db:clean stderr', cleanResult.stderr);

    cy.exec('scripts/dev db:seed', {
      timeout: 120000,
      failOnNonZeroExit: false
    }).then(seedResult => {
      cy.log('db:seed code', seedResult.code);
      cy.log('db:seed stdout', seedResult.stdout);
      cy.log('db:seed stderr', seedResult.stderr);
    });
  });
});
