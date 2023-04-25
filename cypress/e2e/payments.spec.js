import { aliasQuery } from '../support/graphql-test-utils';

describe('The Model Plan Payment Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER_NONPROD' });

    cy.intercept('POST', '/api/graph/query', req => {
      aliasQuery(req, 'GetModelPlan');
      aliasQuery(req, 'GetFunding');
      aliasQuery(req, 'GetClaimsBasedPayment');
      aliasQuery(req, 'GetAnticipateDependencies');
      aliasQuery(req, 'GetBeneficiaryCostSharing');
      aliasQuery(req, 'GetNonClaimsBasedPayment');
      aliasQuery(req, 'GetComplexity');
      aliasQuery(req, 'GetRecover');
    });
  });

  it('completes a Model Plan Ops Eval and Learning form', () => {
    cy.clickPlanTableByName('Empty Plan');

    // Clicks the Payment tasklist item
    cy.get('[data-testid="payment"]').clickEnabled();

    // Page - /payment

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list\/payment/);
    });

    cy.get('#payment-funding-source-PATIENT_PROTECTION_AFFORDABLE_CARE_ACT')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#payment-funding-source-OTHER')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#payment-funding-source-other')
      .typeEnabled('Department of Motor Vehicles')
      .should('have.value', 'Department of Motor Vehicles');

    cy.get(
      '#payment-funding-source-reconciliation-PATIENT_PROTECTION_AFFORDABLE_CARE_ACT'
    )
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#payment-pay-recipients-BENEFICIARIES')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#payment-pay-recipients-CLAIMS_BASED_PAYMENTS')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#payment-pay-recipients-NON_CLAIMS_BASED_PAYMENTS')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').clickEnabled();

    // Page - /payment/claims-based-payment

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/payment\/claims-based-payment/
      );
    });

    cy.get('#payment-pay-claims').within(() => {
      cy.get("input[type='text']").clickEnabled();
    });

    cy.get('[data-testid="option-REDUCTIONS_TO_BENEFICIARY_COST_SHARING"]')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#payment-provider-exclusion-ffs-system-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#payment-change-medicare-phyisican-fee-schedule-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#payment-affects-medicare-secondary-payer-claims-Yes')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#payment-affects-medicare-secondary-payer-claims-how')
      .typeEnabled('Bill in accounting')
      .should('have.value', 'Bill in accounting');

    cy.get('#payment-affect-current-policy')
      .typeEnabled('Bill in accounting')
      .should('have.value', 'Bill in accounting');

    cy.contains('button', 'Next').clickEnabled();

    // Page - /payment/anticipating-dependencies

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/payment\/anticipating-dependencies/
      );
    });

    cy.get('#payment-creating-dependencies-between-services-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#payment-needs-claims-data-collection-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#payment-providing-third-party-file-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#payment-contractor-aware-test-data-requirements-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').clickEnabled();

    // Page - /payment/beneficiary-cost-sharing

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/payment\/beneficiary-cost-sharing/
      );
    });

    cy.get('#payment-beneficiary-cost-sharing')
      .typeEnabled('Bill in accounting')
      .should('have.value', 'Bill in accounting');

    cy.get('#payment-waive-any-service-Yes')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#payment-waive-any-service-specification')
      .typeEnabled('Users to make sure this works correctly')
      .should('have.value', 'Users to make sure this works correctly');

    cy.get('#payment-waive-part-of-payment-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').clickEnabled();

    // Page - /payment/non-claims-based-payment

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/payment\/non-claims-based-payment/
      );
    });

    cy.get('#payment-nonclaims-payments').within(() => {
      cy.get("input[type='text']").clickEnabled();
    });

    cy.get('[data-testid="option-ADVANCED_PAYMENT"]')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.clickOutside();

    cy.get('#payment-nonclaims-payments-owner')
      .typeEnabled('I am the owner')
      .should('have.value', 'I am the owner');

    cy.get('#payment-nonclaims-payments-paycycle')
      .typeEnabled('Yes')
      .should('have.value', 'Yes');

    cy.get('#payment-nonclaims-shared-involvement-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#payment-use-innovation-payment-contractor-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#payment-funding-structure')
      .typeEnabled('Payment Funding Structure')
      .should('have.value', 'Payment Funding Structure');

    cy.contains('button', 'Next').clickEnabled();

    // Page - /payment/complexity

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/payment\/complexity/
      );
    });

    cy.get('#payment-complexity-LOW')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#payment-multiple-payments-Yes')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#payment-multiple-payments-how')
      .typeEnabled('Payment Funding Structure')
      .should('have.value', 'Payment Funding Structure');

    cy.get('#payment-frequency-payments').within(() => {
      cy.get("input[type='text']").clickEnabled();
    });

    cy.get('[data-testid="option-OTHER"]')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.clickOutside();

    cy.get('#payment-frequency-payments-other')
      .typeEnabled('Payment Frequency Payments Other')
      .should('have.value', 'Payment Frequency Payments Other');

    cy.contains('button', 'Next').clickEnabled();

    // Page - /payment/recover-payment
    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/payment\/recover-payment/
      );
    });

    cy.get('#payment-recover-payment-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#payment-anticipate-reconciling-payment-retro-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#payment-payment-start-date')
      .typeEnabled('10/26/2028')
      .should('have.value', '10/26/2028');

    cy.contains('button', 'Save and start next Model Plan section').should(
      'not.exist'
    );

    // Uncomment the code below once IT Lead Experience is PROD
    // cy.contains('button', 'Continue to IT solutions and implementation status').clickEnabled();
    // cy.location().should(loc => {
    //   expect(loc.pathname).to.match(/\/models\/.{36}\/task-list\/it-solutions$/);
    // });
  });
});
