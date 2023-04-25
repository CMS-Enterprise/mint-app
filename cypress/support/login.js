Cypress.Commands.add('login', () => {
  cy.intercept('POST', '/oauth2/*').as('oauthPost');
  cy.intercept('GET', '/oauth2/*').as('oauthGet');

  cy.visit('/signin');

  cy.get('#okta-signin-username').typeEnabled(Cypress.env('username'), {
    log: false
  });
  cy.get('#okta-signin-password').typeEnabled(Cypress.env('password'), {
    log: false,
    parseSpecialCharSequences: false
  });
  cy.get('#okta-signin-submit').clickEnabled();

  cy.get('.beacon-loading').should('not.exist');
  cy.get('body').then($body => {
    if ($body.find('input[name="answer"]').length) {
      cy.get('input[name="answer"]').then(() => {
        cy.task('generateOTP', Cypress.env('otpSecret'), { log: false }).then(
          token => {
            cy.get('input[name="answer"]').typeEnabled(token, { log: false });
            cy.get('input[name="rememberDevice"]').checkEnabled({
              force: true
            });
            cy.get('input[value="Verify"').clickEnabled();
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
    cy.visit('/login');

    cy.get('[data-testid="LocalAuth-Visit"]').clickEnabled();
    cy.get('[data-testid="LocalAuth-EUA"]').typeEnabled(name);

    if (role) {
      cy.get(`input[value="${role}"]`).checkEnabled();
    }
    cy.get('[data-testid="LocalAuth-Submit"]').clickEnabled();

    if (!nda) {
      cy.get('#nda-check').checkEnabled({ force: true }).should('be.checked');

      cy.get('#nda-submit').clickEnabled();
    } else {
      cy.get('#nda-alert').should('contain.text', 'Accepted on');

      cy.get('[data-testid="nda-continue"]').clickEnabled();
    }

    cy.url().should('eq', 'http://localhost:3005/');
  }
);

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="signout-link"]').clickEnabled();
  cy.url().should('eq', 'http://localhost:3005/');
});
