describe('Change History', () => {
  before(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('Displays changes correctly', () => {
    cy.clickPlanTableByName('Empty Plan');

    // Clicks the General Charactstics tasklist item
    cy.get('[data-testid="view-change-history"]').click();
  });

  //   it('Sorts changes correctly', () => {

  //   });

  //   it('Searches changes correctly', () => {

  //   });

  //   it('Displays changes by date', () => {

  //   });
});
