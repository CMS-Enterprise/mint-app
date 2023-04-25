Cypress.Commands.add(
  'clickEnabled',
  {
    prevSubject: ['element']
  },
  (subject, options) => {
    cy.waitForNetworkIdle(100);
    return cy.get(subject).should('not.be.disabled').click(options);
  }
);

Cypress.Commands.add(
  'checkEnabled',
  {
    prevSubject: ['element']
  },
  (subject, options) => {
    cy.waitForNetworkIdle(100);
    return cy.get(subject).should('not.be.disabled').check(options);
  }
);

Cypress.Commands.add(
  'typeEnabled',
  {
    prevSubject: ['element']
  },
  (subject, text, options = {}) => {
    cy.waitForNetworkIdle(100);
    return cy.get(subject).should('not.be.disabled').type(text, options);
  }
);
