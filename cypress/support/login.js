Cypress.Commands.add('login', () => {
  cy.intercept('POST', '/oauth2/*').as('oauthPost');
  cy.intercept('GET', '/oauth2/*').as('oauthGet');

  cy.visit('/signin');

  cy.get('#okta-signin-username').type(Cypress.env('username'), { log: false });
  cy.get('#okta-signin-password').type(Cypress.env('password'), {
    log: false,
    parseSpecialCharSequences: false
  });
  cy.get('#okta-signin-submit').click({ force: true });

  cy.get('.beacon-loading').should('not.exist');
  cy.get('body').then($body => {
    if ($body.find('input[name="answer"]').length) {
      cy.get('input[name="answer"]').then(() => {
        cy.task('generateOTP', Cypress.env('otpSecret'), { log: false }).then(
          token => {
            cy.get('input[name="answer"]').type(token, { log: false });
            cy.get('input[name="rememberDevice"]').check({ force: true });
            cy.get('input[value="Verify"]').click({ force: true });
          }
        );
      });
    }
  });

  // TODO: Once EUA roles are added to Okta test account, accept the NDA and verify home page location

  cy.url().should('eq', 'http://localhost:3005/pre-decisional-notice');
});

Cypress.Commands.add(
  'localLogin',
  ({ name, role = 'MINT_USER_NONPROD', nda }) => {
    cy.session([name, role, nda], () => {
      // Adding an extended timeout here to give Vite enough time to compile sass on it's first run
      cy.visit('/login', { timeout: 120000 });

      cy.get('[data-testid="LocalAuth-Visit"]')
        .should('be.not.disabled')
        .click({ force: true });
      cy.get('[data-testid="LocalAuth-EUA"]')
        .should('be.not.disabled')
        .type(name);

      if (role) {
        cy.get(`input[value="${role}"]`).should('be.not.disabled').check();
      }
      cy.get('[data-testid="LocalAuth-Submit"]')
        .should('be.not.disabled')
        .click({ force: true });

      if (!nda) {
        cy.get('#nda-check').check({ force: true }).should('be.checked');

        cy.get('#nda-submit').should('be.not.disabled').click({ force: true });
      } else {
        cy.get('#nda-alert').should('contain.text', 'Accepted on');

        cy.get('[data-testid="nda-continue"]')
          .should('be.not.disabled')
          .click({ force: true });
      }

      cy.url().should('eq', 'http://localhost:3005/');
    });
  }
);

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="signout-link"]').click({ force: true });
  cy.url().should('eq', 'http://localhost:3005/');
});
