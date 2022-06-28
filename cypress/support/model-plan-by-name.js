Cypress.Commands.add('clickPlanTableByName', name => {
  cy.visit('/models');

  cy.get('[data-testid="table"] a').contains(name).click();
  cy.location().should(loc => {
    expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
  });
});
