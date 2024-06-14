describe('Change History', () => {
  before(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('Displays changes correctly', () => {
    cy.clickPlanTableByName('Plan with Documents');

    cy.exec('go run ./cmd/dbseed/*go translate', {
      timeout: 120000,
      failOnNonZeroExit: false
    }).then(seedResult => {
      cy.log('db:seed code', seedResult.code);
      cy.log('db:seed stdout', seedResult.stdout);
      cy.log('db:seed stderr', seedResult.stderr);
    });

    // Clicks the General Charactstics tasklist item
    cy.get('[data-testid="view-change-history"]').click();

    cy.get('[data-testid="batch-record-0"]').click();
  });

  //   it('Sorts changes correctly', () => {

  //   });

  //   it('Searches changes correctly', () => {

  //   });

  //   it('Displays changes by date', () => {

  //   });
});
