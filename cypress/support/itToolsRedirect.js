Cypress.Commands.add(
  'itToolsRedirect',
  (
    toolElement,
    redirectElement,
    elementToCheck,
    pageNumber,
    multiselect,
    shouldBeEnabled
  ) => {
    if (!shouldBeEnabled) cy.get(toolElement).should('be.disabled');

    cy.get(`[data-testid="${redirectElement}"]`).first().click();

    cy.wait(1000);

    if (multiselect) {
      cy.get(multiselect).within(() => {
        cy.get("input[type='search']").click();
      });
    }

    cy.get(elementToCheck).check({ force: true }).should('be.checked');

    cy.contains('button', 'Save and return to task list').click();

    cy.get('[data-testid="it-tools"]').click();

    // cy.wait(500);

    [...Array(pageNumber - 1)].forEach(() => {
      cy.contains('button', 'Next').click();
      //   cy.wait(500);
    });

    cy.wait(1000);

    cy.get(toolElement).check({ force: true }).should('be.checked');
  }
);
