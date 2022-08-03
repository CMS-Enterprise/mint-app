/**
Custom command specifically for testing IT Tools
Check if the targeted element should be disabled
Stored original location - used to revisit once Tools answer has been changed
Navigates to original tool question, changes answer, saves, and revisits page on IT Tools form
Finally checks the now enabled checkbox on the IT Tools form
 */

Cypress.Commands.add(
  'itToolsRedirect',
  (
    toolElement,
    redirectElement,
    elementToCheck,
    multiselect,
    shouldBeEnabled
  ) => {
    if (!shouldBeEnabled) cy.get(toolElement).should('be.disabled');

    cy.location().then(location => {
      cy.wrap(location.pathname).as('itToolPage');
    });

    cy.get(`[data-testid="${redirectElement}"]`).first().click();

    cy.wait(1000);

    if (multiselect) {
      cy.get(multiselect).within(() => {
        cy.get("input[type='search']").click();
      });
    }

    cy.get(elementToCheck).check({ force: true }).should('be.checked');

    cy.contains('button', 'Save and return to task list').click();

    cy.get('@itToolPage').then(itToolPage => {
      cy.visit(itToolPage);
    });

    cy.wait(1000);

    cy.get(toolElement).check({ force: true }).should('be.checked');
  }
);
