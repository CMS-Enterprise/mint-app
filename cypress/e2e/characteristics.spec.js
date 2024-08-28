describe('The Model Plan General Characteristics Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('completes a Model Plan Characteristics', () => {
    cy.clickPlanTableByName('Empty Plan');

    // Clicks the General Charactstics tasklist item
    cy.get('[data-testid="characteristics"]').click();

    // Page - /characteristics

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/collaboration-area\/task-list\/characteristics/
      );
    });

    cy.get('[data-testid="model-plan-name"]').contains('for Empty Plan');

    cy.get('#plan-characteristics-is-new-model-false')
      .check({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-existing-model')
      .should('be.visible')
      .click()
      .type('Plan with B{downArrow}{enter}')
      .should('have.value', 'Plan with Basics');

    // Resembles Questions
    cy.get('#plan-characteristics-resembles-existing-model-YES')
      .check({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-resembles-existing-model-why-how')
      .type('This is the how and the why')
      .should('have.value', 'This is the how and the why');

    cy.get('#plan-characteristics-resembles-which-model').within(() => {
      cy.get("input[type='text']")
        .click()
        .type('advance payment{downArrow}{enter}');
    });

    cy.get('[data-testid="multiselect-tag--Advance Payment ACO Model"]')
      .first()
      .contains('Advance Payment ACO Model');

    cy.clickOutside();

    cy.get('#plan-characteristics-resembles-which-model').within(() => {
      cy.get("input[type='text']")
        .click()
        .type('other{downArrow}{downArrow}{enter}');
    });

    cy.get('[data-testid="multiselect-tag--Other"]').first().contains('Other');

    cy.clickOutside();

    cy.get('#plan-characteristics-resembles-existing-model-other-option')
      .type('Other model')
      .should('have.value', 'Other model');

    cy.get('#plan-characteristics-resembles-how-model')
      .type('In every way')
      .should('have.value', 'In every way');

    // Participation precondition questions
    cy.get('#plan-characteristics-participation-model-precondition-YES')
      .check({ force: true })
      .should('be.checked');

    cy.get(
      '#plan-characteristics-participation-model-precondition-which'
    ).within(() => {
      cy.get("input[type='text']")
        .click()
        .type('advance payment{downArrow}{enter}');
    });

    cy.get('[data-testid="multiselect-tag--Advance Payment ACO Model"]')
      .first()
      .contains('Advance Payment ACO Model');

    cy.clickOutside();

    cy.get(
      '#plan-characteristics-participation-model-precondition-which'
    ).within(() => {
      cy.get("input[type='text']")
        .click()
        .type('other{downArrow}{downArrow}{enter}');
    });

    cy.get('[data-testid="multiselect-tag--Other"]').first().contains('Other');

    cy.clickOutside();

    cy.get(
      '#plan-characteristics-participation-model-precondition-other-option'
    )
      .type('Other model')
      .should('have.value', 'Other model');

    cy.get('#plan-characteristics-participation-model-precondition-why-how')
      .type('This is the how and the why')
      .should('have.value', 'This is the how and the why');

    cy.get('#plan-characteristics-has-component-or-tracks-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-tracks-differ-how')
      .type('In no way')
      .should('have.value', 'In no way');

    cy.contains('button', 'Next').click();

    // Page - /characteristics/key-charactertics

    cy.get('#plan-characteristics-agency-or-state-help-YES_AGENCY_IAA').should(
      'not.be.disabled'
    );

    cy.get('#plan-characteristics-agency-or-state-help-YES_AGENCY_IAA')
      .check({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-agency-or-state-help-OTHER')
      .check({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-agency-or-state-help-other')
      .type('Department of Motor Vehicles')
      .should('have.value', 'Department of Motor Vehicles');

    cy.get('#plan-characteristics-alternative-payment-MIPS')
      .should('not.be.disabled')
      .check({ force: true })
      .should('be.checked');

    cy.get('[data-testid="mandatory-fields-alert"]').contains(
      'In order to be considered by the Quality Payment Program (QPP), and to be MIPS or Advanced APM, you will need to collect TINs and NPIs for providers.'
    );

    cy.get('#plan-characteristics-key-characteristics').within(() => {
      cy.get("input[type='text']")
        .should('not.be.disabled')
        .type('payment')
        .should('have.value', 'payment');
    });

    cy.get('[data-testid="option-PAYMENT"]')
      .check({ force: true })
      .should('be.checked');

    cy.get('[data-testid="multiselect-tag--Payment Model"]')
      .first()
      .contains('Payment Model');

    cy.clickOutside();

    cy.contains('button', 'Next').click();

    // Page - /characteristics/involvements

    cy.get('#plan-characteristics-care-coordination-involved-true')
      .should('not.be.disabled')
      .check({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-care-coordination-description')
      .type('Yes, care coordination is involved in every way')
      .should('have.value', 'Yes, care coordination is involved in every way');

    cy.get('#plan-characteristics-additional-services-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-additional-services-description')
      .type('Yes, additional services are involved in every way')
      .should(
        'have.value',
        'Yes, additional services are involved in every way'
      );

    cy.get('#plan-characteristics-community-partners-involved-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-community-partners-description')
      .type('Yes, community partners are involved in every way')
      .should(
        'have.value',
        'Yes, community partners are involved in every way'
      );

    cy.contains('button', 'Next').click();

    // Page - /characteristics/targets-and-options

    cy.get('#plan-characteristics-geographies-targeted-true')
      .should('not.be.disabled')
      .check({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-geographies-type-STATE')
      .check({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-geographies-applied-to-PARTICIPANTS')
      .check({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-participation-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-agreement-type-PARTICIPATION')
      .check({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-agreement-type-OTHER')
      .check({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-agreement-type-other')
      .type('Just a different agreement type')
      .should('have.value', 'Just a different agreement type');

    cy.get('#plan-characteristics-multiple-participation-needed-true')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();

    // Page - /characteristics/authority

    cy.get('#plan-characteristics-rulemaking-required-true')
      .should('not.be.disabled')
      .check({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-rulemaking-required-description')
      .type('Standard rule for next year')
      .should('have.value', 'Standard rule for next year');

    cy.get('#plan-characteristics-authority-allowance-CONGRESSIONALLY_MANDATED')
      .check({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-waivers-required-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-waiver-types-FRAUD_ABUSE')
      .check({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-waiver-types-PROGRAM_PAYMENT')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Save and start next Model Plan section').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/collaboration-area\/task-list\/participants-and-providers$/
      );
    });

    cy.get('h1.mint-h1').contains('Participants and providers');
  });
});
