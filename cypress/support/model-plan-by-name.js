Cypress.Commands.add('enterModelPlanCollaborationArea', (planName, table) => {
  cy.visit('/');

  cy.get(`[data-testid="${table || 'table'}"] a`)
    .contains(planName)
    .click();
  cy.url().should('include', '/collaboration-area');

  cy.get('[data-testid="page-loading"]').should('not.exist');
});

Cypress.Commands.add('enterModelPlanTaskList', (planName, table) => {
  cy.visit('/');

  cy.get(`[data-testid="${table || 'table'}"] a`)
    .contains(planName)
    .click();
  cy.url().should('include', '/collaboration-area');

  cy.get('[data-testid="page-loading"]').should('not.exist');

  cy.get(`[data-testid="to-task-list"]`).click();
  cy.url().should('include', '/collaboration-area/task-list');

  cy.get('[data-testid="page-loading"]').should('not.exist');
});
