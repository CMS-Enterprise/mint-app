// Hosted Okta/ELP redirect login (requires VITE_OKTA_REDIRECT_LOGIN_ENABLED=true).
// CMS ELP chooser → EUA/IDM form → optional MFA → back to localhost.
Cypress.Commands.add('login', () => {
  const oktaDomain = Cypress.env('oktaDomain');

  // Hosted IDM pages throw opaque cross-origin errors ("Script error." / "null")
  // that Cypress surfaces on the primary origin during redirect. Suppress only
  // those opaque cases so real app exceptions still fail the test.
  const isOpaqueCrossOriginError = err => {
    const msg = `${err?.message || ''}`;
    return (
      /Script error/i.test(msg) ||
      /cross origin page/i.test(msg) ||
      /cross-origin script/i.test(msg) ||
      /^null$/i.test(msg.trim())
    );
  };
  cy.on('uncaught:exception', err => {
    if (isOpaqueCrossOriginError(err)) {
      return false;
    }
    return undefined;
  });

  cy.visit('/signin');

  // Fail fast if this build still serves the embedded widget (flag off). The
  // redirect path renders data-testid="okta-redirect-login" before leaving for IDM.
  cy.get('body', { timeout: 20000 }).should($body => {
    const widgetPresent = $body.find('#okta-signin-username').length > 0;
    const redirectPending =
      $body.find('[data-testid="okta-redirect-login"]').length > 0;

    expect(
      widgetPresent,
      'cy.login() requires VITE_OKTA_REDIRECT_LOGIN_ENABLED=true (hosted Okta/ELP redirect). Found the embedded Sign-In Widget on /signin instead.'
    ).to.eq(false);

    expect(
      redirectPending,
      'cy.login() expected the Okta redirect spinner on /signin before navigating to the hosted login page'
    ).to.eq(true);
  });

  cy.origin(
    oktaDomain,
    {
      args: {
        username: Cypress.env('username'),
        password: Cypress.env('password'),
        otpSecret: Cypress.env('otpSecret')
      }
    },
    ({ username, password, otpSecret }) => {
      // Same opaque cross-origin script errors, scoped to the IDM origin.
      Cypress.on('uncaught:exception', err => {
        const msg = `${err?.message || ''}`;
        if (
          /Script error/i.test(msg) ||
          /cross origin page/i.test(msg) ||
          /cross-origin script/i.test(msg) ||
          /^null$/i.test(msg.trim())
        ) {
          return false;
        }
        return undefined;
      });

      cy.document({ timeout: 30000 }).should(
        'have.property',
        'readyState',
        'complete'
      );
      cy.get('#okta-sign-in', { timeout: 30000 }).should('exist');

      // CMS Enterprise Login chooser: open EUA / IDM username form
      cy.get('#userFormCspCard button.otherOptionsButton', { timeout: 30000 })
        .should('be.visible')
        .click();

      cy.get('input[name="identifier"]', { timeout: 15000 })
        .should('be.visible')
        .clear()
        .type(username, { log: false });

      cy.get('input[name="credentials.passcode"]')
        .should('be.visible')
        .clear()
        .type(password, {
          log: false,
          parseSpecialCharSequences: false
        });

      cy.get('#okta-sign-in input[type="submit"][data-type="save"]')
        .filter(':visible')
        .first()
        .click();

      // MFA is optional (Okta may skip it for a remembered device). Wait until
      // we leave the password form, then complete MFA only if it appears.
      cy.get('body', { timeout: 20000 }).should($body => {
        const leftPasswordForm =
          $body.find('input[name="identifier"]:visible').length === 0;
        const mfaVisible =
          /Multi-Factor Authentication|Google Authenticator|Enter code/i.test(
            $body.text()
          );
        expect(
          leftPasswordForm || mfaVisible,
          'expected MFA challenge or post-password transition'
        ).to.eq(true);
      });

      cy.get('body').then($body => {
        const text = $body.text();
        const mfaVisible =
          /Multi-Factor Authentication|Google Authenticator|Enter code/i.test(
            text
          );
        const otpFieldVisible =
          $body.find(
            'input[name="credentials.passcode"]:visible, input[name="answer"]:visible'
          ).length > 0 &&
          $body.find('input[name="identifier"]:visible').length === 0;

        if (!mfaVisible && !otpFieldVisible) {
          // Password alone was enough; redirect back to the app will end this origin.
          return;
        }

        // Prefer Google Authenticator — OKTA_TEST_SECRET is that factor's OTP seed.
        // CMS ELP customizes Okta's MFA list markup, so walk up from the label to
        // the nearest ancestor that contains a Select control.
        if (text.includes('Google Authenticator') && !otpFieldVisible) {
          cy.contains('Google Authenticator')
            .should('be.visible')
            .then($label => {
              let $node = $label;
              for (let i = 0; i < 8; i += 1) {
                const $select = $node
                  .find('a, button')
                  .filter((_, el) =>
                    /^Select$/i.test((el.textContent || '').trim())
                  );
                if ($select.length) {
                  cy.wrap($select.first()).click({ force: true });
                  return;
                }
                $node = $node.parent();
              }
              throw new Error(
                'Could not find a Select control for Google Authenticator on the MFA options page'
              );
            });
        }

        cy.task('generateOTP', otpSecret, { log: false }).then(token => {
          cy.get('input[name="credentials.passcode"], input[name="answer"]', {
            timeout: 15000
          })
            .filter(':visible')
            .first()
            .clear()
            .type(token, { log: false });

          cy.get('body').then($mfaBody => {
            if ($mfaBody.find('input[name="rememberDevice"]').length) {
              cy.get('input[name="rememberDevice"]').check({ force: true });
            }
          });

          cy.get(
            '#okta-sign-in input[type="submit"][data-type="save"], input[type="submit"][value="Verify"], input[value="Verify"]'
          )
            .filter(':visible')
            .first()
            .click({ force: true });
        });
      });
    }
  );

  // TODO: Once EUA roles are added to Okta test account, accept the NDA and verify home page location
  cy.location('pathname', { timeout: 30000 }).should(
    'eq',
    '/pre-decisional-notice'
  );
});

Cypress.Commands.add(
  'localLogin',
  ({ name, role = 'MINT_USER_NONPROD', nda }) => {
    cy.session([name, role, nda], () => {
      // Adding an extended timeout here to give Vite enough time to compile sass on it's first run.
      // ?local=true opens DevLogin directly (needed when redirect Okta login is enabled).
      cy.visit('/signin?local=true', { timeout: 120000 });

      cy.wait(500);

      cy.get('[data-testid="LocalAuth-EUA"]')
        .should('be.not.disabled')
        .type(name);
      if (role) {
        cy.get(`input[value="${role}"]`).should('be.not.disabled').check({
          force: true
        });
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
