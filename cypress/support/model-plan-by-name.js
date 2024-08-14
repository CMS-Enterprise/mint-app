Cypress.Commands.add('clickPlanTableByName', (planName, table) => {
  cy.visit('/');

  cy.get(`[data-testid="${table || 'table'}"] a`)
    .contains(planName)
    .click();
  cy.url().should('include', '/collaboration-area/task-list');
  cy.get('[data-testid="page-loading"]').should('not.exist');
});
