Cypress.Commands.add('clickPlanTableByName', name => {
  cy.visit('/');

  cy.get('[data-testid="table"] a').contains(name).clickEnabled();
  cy.location().should(loc => {
    expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
  });
});
