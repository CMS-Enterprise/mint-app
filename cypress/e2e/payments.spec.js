describe('The Model Plan Payment Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('completes a Model Plan Payment form', () => {
    cy.clickPlanTableByName('Empty Plan');

    // Clicks the Payment tasklist item
    cy.get('[data-testid="payment"]').click();

    // Page - /payment

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list\/payment/);
    });

    cy.get(
      '#payment-funding-source-fundingSource-PATIENT_PROTECTION_AFFORDABLE_CARE_ACT'
    )
      .should('not.be.disabled')
      .check({ force: true })
      .should('be.checked');

    cy.get(
      '#payment-funding-source-fundingSource-MEDICARE_PART_A_HI_TRUST_FUND'
    )
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-fundingSource-medicare-a-info')
      .type('Part A Type')
      .should('have.value', 'Part A Type');

    cy.get('#payment-funding-source-fundingSource-OTHER')
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-fundingSource-other')
      .type('Department of Motor Vehicles')
      .should('have.value', 'Department of Motor Vehicles');

    cy.get(
      '#payment-funding-source-fundingSourceR-PATIENT_PROTECTION_AFFORDABLE_CARE_ACT'
    )
      .check({ force: true })
      .should('be.checked');

    cy.get(
      '#payment-funding-source-fundingSourceR-MEDICARE_PART_A_HI_TRUST_FUND'
    )
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-fundingSourceR-medicare-a-info')
      .type('Part A Type R')
      .should('have.value', 'Part A Type R');

    cy.get('#payment-pay-recipients-BENEFICIARIES')
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-pay-recipients-CLAIMS_BASED_PAYMENTS')
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-pay-recipients-NON_CLAIMS_BASED_PAYMENTS')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();

    // Page - /payment/claims-based-payment

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/payment\/claims-based-payment/
      );
    });

    cy.get('[data-testid="fieldset"').first().should('not.be.disabled');

    cy.get('#payment-pay-claims').within(() => {
      cy.get("input[type='text']").click();
    });

    cy.get('[data-testid="option-REDUCTIONS_TO_BENEFICIARY_COST_SHARING"]')
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-provider-exclusion-ffs-system-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-change-medicare-phyisican-fee-schedule-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-affects-medicare-secondary-payer-claims-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-affects-medicare-secondary-payer-claims-how')
      .type('Bill in accounting')
      .should('have.value', 'Bill in accounting');

    cy.get('#payment-affect-current-policy')
      .type('Bill in accounting')
      .should('have.value', 'Bill in accounting');

    cy.contains('button', 'Next').click();

    // Page - /payment/anticipating-dependencies

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/payment\/anticipating-dependencies/
      );
    });

    cy.get('#payment-creating-dependencies-between-services-true')
      .should('not.be.disabled')
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-needs-claims-data-collection-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-providing-third-party-file-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-contractor-aware-test-data-requirements-true')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();

    // Page - /payment/beneficiary-cost-sharing

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/payment\/beneficiary-cost-sharing/
      );
    });

    cy.get('#payment-beneficiary-cost-sharing')
      .should('not.be.disabled')
      .type('Bill in accounting')
      .should('have.value', 'Bill in accounting');

    cy.get('#payment-waive-any-service-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-waive-any-service-specification')
      .type('Users to make sure this works correctly')
      .should('have.value', 'Users to make sure this works correctly');

    cy.get('#payment-waive-part-of-payment-true')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();

    // Page - /payment/non-claims-based-payment

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/payment\/non-claims-based-payment/
      );
    });

    cy.get('[data-testid="fieldset"').first().should('not.be.disabled');

    cy.get('#payment-nonclaims-payments').within(() => {
      cy.get("input[type='text']").click();
    });

    cy.get('[data-testid="option-ADVANCED_PAYMENT"]')
      .check({ force: true })
      .should('be.checked');

    cy.clickOutside();

    cy.get('#payment-nonclaims-payments-owner')
      .type('I am the owner')
      .should('have.value', 'I am the owner');

    cy.get('#payment-nonclaims-payments-paycycle')
      .type('Yes')
      .should('have.value', 'Yes');

    cy.get('#payment-nonclaims-shared-involvement-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-use-innovation-payment-contractor-true')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();

    // Page - /payment/complexity

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/payment\/complexity/
      );
    });

    cy.get('#payment-complexity-LOW')
      .should('not.be.disabled')
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-claims-processing-precendece-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-claims-processing-precendece-other')
      .type('One business requirement')
      .should('have.value', 'One business requirement');

    cy.get('#payment-multiple-payments-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-multiple-payments-how')
      .type('Payment Funding Structure')
      .should('have.value', 'Payment Funding Structure');

    cy.get('#anticipated-payment-frequency-quarterly')
      .check({ force: true })
      .should('be.checked');

    cy.get('#anticipated-payment-frequency-other')
      .check({ force: true })
      .should('be.checked');

    cy.get('#anticipated-payment-frequency-other-text')
      .type('Payment Frequency Payments Other')
      .should('have.value', 'Payment Frequency Payments Other');

    cy.contains('button', 'Next').click();

    // Page - /payment/recover-payment

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/payment\/recover-payment/
      );
    });

    cy.get('#payment-recover-payment-true')
      .should('not.be.disabled')
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-anticipate-reconciling-payment-retro-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-reconciliation-frequency-quarterly')
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-reconciliation-frequency-other')
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-reconciliation-frequency-other-text')
      .type('Payment Frequency Payments Other')
      .should('have.value', 'Payment Frequency Payments Other');

    cy.get('#payment-demand-recoupment-frequency-quarterly')
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-demand-recoupment-frequency-other')
      .check({ force: true })
      .should('be.checked');

    cy.get('#payment-demand-recoupment-frequency-other-text')
      .type('Payment Demand Recoupment Frequency Other')
      .should('have.value', 'Payment Demand Recoupment Frequency Other');

    cy.get('#payment-payment-start-date')
      .type('10/26/2028')
      .should('have.value', '10/26/2028');

    cy.contains('button', 'Continue to operational solutions tracker').click();
    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/it-solutions$/
      );
    });
  });
});
