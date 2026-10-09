// Hosted Okta/ELP redirect login (requires VITE_OKTA_REDIRECT_LOGIN_ENABLED=true).
// CMS ELP chooser → EUA/IDM form → optional MFA → back to localhost.
function loginWithEnv({ oktaDomain, username, password, otpSecret }) {
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
        username,
        password,
        otpSecret
      }
    },
    ({
      username: originUsername,
      password: originPassword,
      otpSecret: originOtpSecret
    }) => {
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
        .type(originUsername, { log: false });

      cy.get('input[name="credentials.passcode"]')
        .should('be.visible')
        .clear()
        .type(originPassword, {
          log: false,
          parseSpecialCharSequences: false
        });

      cy.get('#okta-sign-in input[type="submit"][data-type="save"]')
        .filter(':visible')
        .first()
        .click();

      // MFA is optional (Okta may skip it for a remembered device). Wait until
      // the username form is actually gone. Treating "MFA text OR left the form"
      // as success continued during the blank transition and typed the code into
      // the password field, which uses the same credentials.passcode name.
      const otpSelector =
        'input[name="credentials.passcode"], input[name="answer"]';

      cy.get('body', { timeout: 30000 })
        .should($body => {
          const passwordFormVisible =
            $body.find('input[name="identifier"]:visible').length > 0;
          const otpFieldVisible = $body
            .find(otpSelector)
            .filter(':visible').length;
          const mfaVisible =
            /Multi-Factor Authentication|Google Authenticator|Enter code/i.test(
              $body.text()
            );
          const stillOnLogin = $body.find('#okta-sign-in').length > 0;

          expect(
            passwordFormVisible,
            'expected to leave the username/password form'
          ).to.eq(false);
          expect(
            !stillOnLogin || otpFieldVisible > 0 || mfaVisible,
            'expected an MFA challenge or to leave the hosted login page'
          ).to.eq(true);
        })
        .then($body => {
          const text = $body.text();
          const mfaVisible =
            /Multi-Factor Authentication|Google Authenticator|Enter code/i.test(
              text
            );
          const otpFieldVisible =
            $body.find(otpSelector).filter(':visible').length > 0;

          if (!mfaVisible && !otpFieldVisible) {
            // Password alone was enough; redirect back to the app will end this origin.
            return;
          }

          // Queued only after the authenticator choice (when one is required), so
          // the code is generated once the passcode field is actually on screen.
          const enterOtp = () => {
            cy.get(otpSelector, { timeout: 20000 })
              .filter(':visible')
              .first()
              .should('not.be.disabled');

            // Check this before typing. Toggling it re-renders the form and clears
            // a code that was already entered.
            cy.get('body').then($mfaBody => {
              const $remember = $mfaBody.find(
                'input[name="rememberDevice"]:visible'
              );
              if ($remember.length && !$remember.is(':checked')) {
                cy.get('input[name="rememberDevice"]').check({ force: true });
              }
            });

            // generateOTP also waits out the end of the 30s window. Don't submit
            // until the value stuck — Okta drops fast keystrokes, and a partial
            // code fails verification.
            cy.task('generateOTP', originOtpSecret, { log: false }).then(
              token => {
                const typeToken = attemptsLeft => {
                  cy.get(otpSelector, { timeout: 20000 })
                    .filter(':visible')
                    .first()
                    .focus()
                    .clear({ force: true })
                    .type(token, { log: false, delay: 50 });

                  cy.get(otpSelector)
                    .filter(':visible')
                    .first()
                    .invoke('val')
                    .then(value => {
                      if (value !== token && attemptsLeft > 0) {
                        typeToken(attemptsLeft - 1);
                        return;
                      }
                      expect(value, 'OTP field').to.eq(token);

                      cy.get(
                        '#okta-sign-in input[type="submit"][data-type="save"], input[type="submit"][value="Verify"], input[value="Verify"]'
                      )
                        .filter(':visible')
                        .first()
                        .click({ force: true });
                    });
                };

                typeToken(2);
              }
            );
          };

          // Prefer Google Authenticator — OKTA_TEST_SECRET is that factor's OTP seed.
          // The factor list's parent contains every Select button, so choose the one
          // closest to this label instead of the first Select on the page.
          if (text.includes('Google Authenticator') && !otpFieldVisible) {
            cy.contains('Google Authenticator')
              .should('be.visible')
              .then($label => {
                const labelTop = $label[0].getBoundingClientRect().top;
                const $selects = Cypress.$('#okta-sign-in')
                  .find('a, button, input[type="submit"], [role="button"]')
                  .filter((_, el) => {
                    const label = (
                      el.getAttribute('value') ||
                      el.textContent ||
                      ''
                    ).trim();
                    return /^Select$/i.test(label);
                  });

                if (!$selects.length) {
                  throw new Error(
                    'Could not find a Select control for Google Authenticator on the MFA options page'
                  );
                }

                let best = $selects.get(0);
                let bestDistance = Number.POSITIVE_INFINITY;
                $selects.each((_, el) => {
                  const distance = Math.abs(
                    el.getBoundingClientRect().top - labelTop
                  );
                  if (distance < bestDistance) {
                    bestDistance = distance;
                    best = el;
                  }
                });

                cy.wrap(best).click({ force: true });
                enterOtp();
              });
            return;
          }

          enterOtp();
        });
    }
  );

  // TODO: Once EUA roles are added to Okta test account, accept the NDA and verify home page location
  cy.location('pathname', { timeout: 30000 }).should(
    'eq',
    '/pre-decisional-notice'
  );
}

Cypress.Commands.add('login', () => {
  cy.env(['oktaDomain', 'username', 'password', 'otpSecret']).then(
    loginWithEnv
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
