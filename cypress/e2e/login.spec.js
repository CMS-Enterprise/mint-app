const maxAttempts = 3;

describe('Logging in', () => {
  // The Okta test runs the hosted Okta/ELP redirect login, so it needs, locally and in CI:
  //   - VITE_OKTA_REDIRECT_LOGIN_ENABLED=true when the frontend is built/started. This is a
  //     build-time flag (CI sets it in run_tests.yml). Locally it defaults to false in .envrc, so
  //     set it in .envrc.local and restart the frontend; otherwise cy.login() fails after retrying.
  //   - OKTA_TEST_USERNAME, OKTA_TEST_PASSWORD and OKTA_TEST_SECRET (the OTP seed). CI reads these
  //     from GitHub secrets; locally they are empty in .envrc, so set them in .envrc.local.
  //   - Network access to the Okta test IdP (OKTA_DOMAIN).
  // The other login tests below use local auth and need none of this.
  it(
    'logs in with okta',
    {
      retries: {
        runMode: maxAttempts - 1, // 2 retries when running from `cypress run` (3 total attempts)
        openMode: 0 // 0 retries when running from `cypress open` (1 total attempt)
      }
    },
    () => {
      // Get the current number of retries and sleep before running the test to make sure the One-Time-Password is new
      const currentRetry = cy.state('runnable')._currentRetry; // eslint-disable-line no-underscore-dangle
      if (currentRetry > 0) {
        cy.log(
          `[Attempt ${currentRetry + 1}/${maxAttempts}] Sleeping 30s for OTP`
        );
        cy.wait(30000);
      }
      cy.login();
      cy.location('pathname', { timeout: 20000 }).should(
        'equal',
        '/pre-decisional-notice'
      );
    }
  );

  it('logs in with local auth and verifies NDA', () => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');

    cy.get('h1', { timeout: 20000 }).should('have.text', 'Welcome to MINT');

    cy.logout();

    cy.localLogin({ name: 'MINT', role: 'MINT_USER_NONPROD', nda: true });
    cy.visit('/');

    cy.get('h1', { timeout: 20000 }).should('have.text', 'Welcome to MINT');
  });

  it('logs in with local MAC', () => {
    cy.localLogin({ name: 'MACU', role: 'MINT MAC Users' });
    cy.visit('/');

    cy.get('[data-testid="page-loading"]').should('not.exist');

    cy.get('h1', { timeout: 20000 }).should('have.text', 'Welcome to MINT');
  });
});
