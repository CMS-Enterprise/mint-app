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
    shouldBeEnabled,
    alias,
    warningRedirect,
    backOrNext
  ) => {
    if (!shouldBeEnabled) cy.get(toolElement).should('be.disabled');

    cy.get(`[data-testid="${redirectElement}"]`).first().clickEnabled();

    cy.wait(1000);

    if (multiselect) {
      cy.get(multiselect).within(() => {
        cy.get("input[type='text']").clickEnabled({ force: true });
      });
    }

    cy.get(elementToCheck).checkEnabled({ force: true }).should('be.checked');

    if (multiselect) {
      cy.clickOutside();
    }

    cy.get(warningRedirect).first().clickEnabled();

    if (backOrNext) {
      cy.wait(1000);
      cy.contains('button', backOrNext).clickEnabled();
    }

    cy.wait(alias).its('response.statusCode').should('eq', 200);

    cy.wait(1000);

    cy.get(toolElement).checkEnabled({ force: true }).should('be.checked');
  }
);
