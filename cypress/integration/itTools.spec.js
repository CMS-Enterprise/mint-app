describe('The Model Plan IT Tools Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
  });

  it('completes a Model Plan IT Tools form', () => {
    cy.clickPlanTableByName('Empty Plan');

    // Clicks the IT Tools tasklist item
    cy.get('[data-testid="it-tools"]').click();

    // Page - /it-tools/page-one

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/it-tools\/page-one/
      );
    });

    cy.get('[data-testid="model-plan-name"]').contains('Empty Plan');

    cy.get('#it-tools-gc-partc-OTHER').should('be.disabled');

    cy.get(`[data-testid="it-tools-redirect-managePartCDEnrollment"]`).click();

    cy.get('#plan-characteristics-key-characteristics').within(() => {
      cy.get("input[type='search']").click();
    });

    cy.get('#easi-multiselect__option-PART_D')
      .check({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-manage-enrollment')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Save and return to task list').click();

    cy.get('[data-testid="it-tools"]').click();

    cy.get('#it-tools-gc-partc-MARX')
      .check({ force: true })
      .should('be.checked');

    cy.itToolsRedirect(
      '#it-tools-gc-collect-bids-HPMS',
      'it-tools-redirect-collectPlanBids',
      '#plan-characteristics-collect-bids'
    );

    cy.itToolsRedirect(
      '#it-tools-gc-update-contract-HPMS',
      'it-tools-redirect-planContactUpdated',
      '#plan-characteristics-contact-updated'
    );

    cy.contains('button', 'Next').click();

    // // Page - /it-tools/page-two

    cy.wait(1000);

    cy.itToolsRedirect(
      '#it-tools-pp-to-advertise-GRANT_SOLUTIONS',
      'it-tools-redirect-recruitmentMethod',
      '#participants-and-providers-recruitment-method-NOFO'
    );

    cy.itToolsRedirect(
      '#it-tools-pp-collect-score-review-ARS',
      'it-tools-redirect-selectionMethod',
      '#easi-multiselect__option-APPLICATION_REVIEW_AND_SCORING_TOOL',
      '#participants-and-providers-selection-method'
    );

    cy.itToolsRedirect(
      '#it-tools-pp-app-support-contractor-RMDA',
      'it-tools-redirect-selectionMethod',
      '#easi-multiselect__option-APPLICATION_SUPPORT_CONTRACTOR',
      '#participants-and-providers-selection-method'
    );

    cy.contains('button', 'Next').click();

    // Page - /it-tools/page-three

    cy.wait(1000);

    cy.itToolsRedirect(
      '#it-tools-pp-communicate-with-participant-GOV_DELIVERY',
      'it-tools-redirect-communicationMethod',
      '#participants-and-providers-communication-method-IT_TOOL'
    );

    cy.get('#it-tools-pp-provider-overlap-MDM')
      .check({ force: true })
      .should('be.checked');

    cy.get('#it-tools-b-beneficiary-overlap-MDM')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();

    // Page - /it-tools/page-four

    cy.wait(1000);

    cy.itToolsRedirect(
      '#it-tools-oel-help-desk-CBOSC',
      'it-tools-redirect-helpdeskUse',
      '#ops-eval-and-learning-help-desk-use-true'
    );

    cy.itToolsRedirect(
      '#it-tools-oel-manage-aco-ACO_OS',
      'it-tools-redirect-iddocSupport',
      '#ops-eval-and-learning-iddoc-support'
    );

    cy.itToolsRedirect(
      '#it-tools-oel-performance-benchmark-CCW',
      'it-tools-redirect-benchmarkForPerformance',
      '#ops-eval-and-learning-benchmark-performance-YES_NO_RECONCILE'
    );

    cy.contains('button', 'Next').click();

    // Page - /it-tools/page-five

    cy.wait(1000);

    cy.itToolsRedirect(
      '#it-tools-oel-process-appeals-MEDICARE_APPEAL_SYSTEM',
      'it-tools-redirect-appealPerformance',
      '#ops-eval-and-learning-appeal-performance-true'
    );

    cy.itToolsRedirect(
      '#it-tools-oel-evaluation-contractor-RMDA',
      'it-tools-redirect-evaluationApproaches',
      '#ops-eval-and-learning-evaluation-approach-COMPARISON_MATCH'
    );

    cy.itToolsRedirect(
      '#it-tools-oel-collect-data-CCW',
      'it-tools-redirect-dataNeededForMonitoring',
      '#easi-multiselect__option-SITE_VISITS',
      '#ops-eval-and-learning-data-needed'
    );

    cy.contains('button', 'Next').click();

    // Page - /it-tools/page-six

    cy.wait(1000);

    cy.itToolsRedirect(
      '#it-tools-oel-obtain-data-CCW',
      'it-tools-redirect-dataNeededForMonitoring',
      '#easi-multiselect__option-ENCOUNTER_DATA',
      '#ops-eval-and-learning-data-needed',
      true
    );

    cy.itToolsRedirect(
      '#it-tools-oel-claims-based-measure-CCW',
      'it-tools-redirect-dataNeededForMonitoring',
      '#easi-multiselect__option-QUALITY_CLAIMS_BASED_MEASURES',
      '#ops-eval-and-learning-data-needed'
    );

    cy.itToolsRedirect(
      '#it-tools-oel-quality-scores-EXISTING_DATA_AND_PROCESS',
      'it-tools-redirect-dataNeededForMonitoring',
      '#easi-multiselect__option-MEDICARE_CLAIMS',
      '#ops-eval-and-learning-data-needed'
    );

    cy.contains('button', 'Next').click();

    // Page - /it-tools/page-seven

    cy.wait(1000);

    cy.itToolsRedirect(
      '#it-tools-oel-send-reports-IDOS',
      'it-tools-redirect-dataToSendParticicipants',
      '#easi-multiselect__option-BASELINE_HISTORICAL_DATA',
      '#ops-eval-and-learning-data-to-send'
    );

    cy.itToolsRedirect(
      '#it-tools-oel-learning-contractor-CROSS_MODEL_CONTRACT',
      'it-tools-redirect-modelLearningSystems',
      '#ops-eval-and-learning-learning-systems-LEARNING_CONTRACTOR'
    );

    cy.itToolsRedirect(
      '#it-tools-oel-participant-collaboration-CONNECT',
      'it-tools-redirect-modelLearningSystems',
      '#ops-eval-and-learning-learning-systems-PARTICIPANT_COLLABORATION'
    );

    cy.contains('button', 'Next').click();

    // Page - /it-tools/page-eight

    cy.wait(1000);

    cy.itToolsRedirect(
      '#it-tools-oel-educate-beneficiaries-OC',
      'it-tools-redirect-modelLearningSystems',
      '#ops-eval-and-learning-learning-systems-EDUCATE_BENEFICIARIES'
    );

    cy.itToolsRedirect(
      '#it-tools-p-claims-payments-HIGLAS',
      'it-tools-redirect-payType',
      '#payment-pay-recipients-CLAIMS_BASED_PAYMENTS'
    );

    cy.itToolsRedirect(
      '#it-tools-p-inform-ffs-FFS_COMPETENCY_CENTER',
      'it-tools-redirect-shouldAnyProvidersExcludedFFSSystems',
      '#payment-provider-exclusion-ffs-system-true'
    );

    cy.contains('button', 'Next').click();

    // Page - /it-tools/page-nine

    cy.wait(1000);

    cy.itToolsRedirect(
      '#it-tools-p-non-claims-payments-APPS',
      'it-tools-redirect-payType',
      '#payment-pay-recipients-NON_CLAIMS_BASED_PAYMENTS'
    );

    cy.itToolsRedirect(
      '#it-tools-p-shared-savings-RMADA',
      'it-tools-redirect-nonClaimsPayments',
      '#easi-multiselect__option-SHARED_SAVINGS',
      true
    );

    cy.itToolsRedirect(
      '#it-tools-p-recover-payments-APPS',
      'it-tools-redirect-willRecoverPayments',
      '#payment-recover-payment-true'
    );

    cy.contains('button', 'Save and start next Model Plan section').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
    });

    cy.get('[data-testid="task-list-intake-form-itTools"]').contains(
      'In progress'
    );
  });
});
