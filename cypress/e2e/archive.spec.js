const maxAttempts = 3;

describe('The Model Plan Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER_NONPROD' });
  });

  it(
    'archives a model plan',
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
        cy.log(`[Attempt ${currentRetry + 1}/${maxAttempts}]`);
      }
      cy.clickPlanTableByName('Empty Plan');

      cy.contains('button', 'Remove your Model Plan').click();

      cy.contains('button', 'Remove Model Plan').click();

      cy.location().should(loc => {
        expect(loc.pathname).to.eq('/');
      });

      cy.get('table').within(() => {
        cy.get('tbody').within(() => {
          cy.contains('th', 'Empty Plan').should('not.exist');
        });
      });
    }
  );
});
