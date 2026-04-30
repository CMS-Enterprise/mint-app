Cypress.Commands.add('ensureChecked', (inputSelector, labelSelector) => {
  cy.get(inputSelector).then($el => {
    if (!$el.is(':checked')) {
      cy.get(labelSelector).click({ force: true });
      cy.wait(200);
      cy.ensureChecked(inputSelector, labelSelector);
    }
  });
});
