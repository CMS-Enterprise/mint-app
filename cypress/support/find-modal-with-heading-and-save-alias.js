Cypress.Commands.add(
  'findModalWithThisHeadingAndSaveAlias',
  (heading, alias = 'modal') => {
    cy.contains(heading)
      .scrollIntoView()
      .should('be.visible')
      .closest('[role="dialog"]')
      .should('be.visible')
      .as(alias);
  }
);
