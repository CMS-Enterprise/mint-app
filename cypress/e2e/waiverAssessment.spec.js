describe('The waiver assessment survey Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('should go through the waiver assessment survey form', () => {
    cy.enterModelPlanCollaborationArea('Empty Plan');
    cy.contains('button', 'Go to questionnaires').click();

    // Enter into waiver assessment survey form
    cy.get('[data-testid="waiver-assessment-survey-button"]').within(() => {
      cy.contains('Start').click();
    });

    // Progress to the next page, just text on this page
    cy.url().should('include', '/waiver-assessment-survey/about');
    cy.contains('button', 'Next').click();

    // Page - /waiver-assessment-survey/model-plan-questions
    cy.url().should(
      'include',
      '/waiver-assessment-survey/model-plan-questions'
    );

    cy.get('[data-testid="question-body-primary-model-category"]')
      .should('contain', 'Primary model category')
      .and('contain', 'No answer entered');

    cy.get('[data-testid="question-body-primary-model-category"]')
      .parents('[data-testid="question-group"]')
      .within(() => {
        cy.get('[data-testid="button"]').click();
        cy.get('input[name="modelCategory"][value="ACCOUNTABLE_CARE"]').check({
          force: true
        });
      });

    cy.contains('button', 'Next').click();

    // Page - /waiver-assessment-survey/active-model-waivers
    cy.url().should(
      'include',
      '/waiver-assessment-survey/active-model-waivers'
    );

    cy.contains(
      'label',
      'Does your model modify Medicare shared savings programs?'
    )
      .closest('.usa-form-group')
      .within(() => {
        cy.get('[data-testid="modifies-medicare-savings-programs-true"]').check(
          { force: true }
        );

        cy.get('[data-testid="modifies-medicare-savings-programs-example"]')
          .should('be.visible')
          .type('Example details for Medicare Savings Programs');
      });

    cy.contains('label', 'Does your model bundle payments?')
      .closest('.usa-form-group')
      .within(() => {
        cy.get(`[data-testid="bundles-payments-false"]`).check({ force: true });

        cy.get(`[data-testid="bundles-payments-false"]`).should('be.checked');

        cy.get('#bundles-payments-why-not')
          .should('be.visible')
          .select('OTHER');
      });

    cy.contains('button', 'Next').click();

    // Page - /waiver-assessment-survey/waiver-selection-and-confirmation
    cy.url().should(
      'include',
      '/waiver-assessment-survey/waiver-selection-and-confirmation'
    );

    cy.get(
      '[data-testid="waiver-selection-00000002-0000-0000-0000-000000000001"]'
    )
      .should('contain', '3-Day Skilled Nursing Facility (SNF)')
      .and('contain', 'Do you plan to use this waiver with your model?')
      .within(() => {
        cy.contains('button', 'Learn more about this waiver').click();
      });

    cy.location('search').should(
      'include',
      'waiverId=00000002-0000-0000-0000-000000000001'
    );

    cy.get('[data-testid="close-discussions"]').click();

    cy.get('[data-testid="waiver-info-panel"]').should('not.exist');

    cy.get(
      '[data-testid="waiver-selection-00000002-0000-0000-0000-000000000001"]'
    ).within(() => {
      cy.get('input[id^="willUseWaiver-yes-"]').check({ force: true });

      cy.contains('You said your model will use this waiver');

      cy.contains('button', 'Change response').should('be.visible');

      cy.get('textarea[id^="notUsingReason-"]').should('not.exist');
    });

    cy.get(
      '[data-testid="waiver-selection-00000002-0000-0000-0000-000000000002"]'
    )
      .should(
        'contain',
        'All-Inclusive Population-Based Payments (AIPBP) Payment Arrangement Waiver'
      )
      .and('contain', 'Do you plan to use this waiver with your model?')
      .within(() => {
        cy.get('input[id^="willUseWaiver-no-"]').check({ force: true });

        cy.contains('You said your model will not use this waiver');

        cy.contains('button', 'Change response').should('be.visible');

        cy.get('textarea[id^="notUsingReason-"]')
          .should('be.visible')
          .type('Not needed for our specific model plan structure.');
      });

    cy.contains('button', 'Next').click();

    // Page - /waiver-assessment-survey/confirm-your-waiver-selections
    cy.url().should(
      'include',
      '/waiver-assessment-survey/confirm-your-waiver-selections'
    );

    cy.contains('h3', 'Selected waivers')
      .parent()
      .within(() => {
        cy.contains('3-Day Skilled Nursing Facility (SNF)').should(
          'be.visible'
        );
      });

    cy.contains('h3', 'Declined waivers')
      .parent()
      .within(() => {
        cy.contains(
          'All-Inclusive Population-Based Payments (AIPBP) Payment Arrangement Waiver'
        ).should('be.visible');
      });

    cy.get('[data-testid="edit-model-plan-questions-section"]')
      .parent()
      .within(() => {
        cy.contains('.read-only-section', 'Primary model category').should(
          'contain',
          'Accountable Care'
        );
        cy.contains('.read-only-section', 'Additional model categories').should(
          'contain',
          'Not answered yet'
        );
      });

    cy.get('[data-testid="edit-active-model-waivers-section"]')
      .parent()
      .within(() => {
        cy.contains(
          '.read-only-section',
          'Does your model modify Medicare shared savings programs?'
        ).should(
          'contain',
          'Yes, Example details for Medicare Savings Programs'
        );

        cy.contains(
          '.read-only-section',
          'Does your model bundle payments?'
        ).should('contain', 'No, Other');
      });

    // The checkbox is disabled since survey is incomplete
    cy.get('[data-testid="is-complete"]').should('be.disabled');

    cy.get('#waiver-assessment-survey-confirm-and-submit-form')
      .find('button[type="submit"]')
      .click();

    // 5. Verify redirect and final status tag
    cy.url().should('include', '/collaboration-area/additional-questionnaires');

    cy.get('[data-testid="questionnaireList-tag"]').contains('In progress');
  });
});
