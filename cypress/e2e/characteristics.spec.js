import { aliasQuery } from '../support/graphql-test-utils';

describe('The Model Plan General Characteristics Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER_NONPROD' });

    cy.intercept('POST', '/api/graph/query', req => {
      aliasQuery(req, 'GetGeneralCharacteristics');
      aliasQuery(req, 'GetKeyCharacteristics');
      aliasQuery(req, 'GetInvolvements');
      aliasQuery(req, 'GetTargetsAndOptions');
      aliasQuery(req, 'GetAuthority');
    });
  });

  it('completes a Model Plan Characteristics', () => {
    cy.clickPlanTableByName('Empty Plan');

    // Clicks the General Charactstics tasklist item
    cy.get('[data-testid="characteristics"]').clickEnabled();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/characteristics/
      );
    });

    // Page - /characteristics

    cy.get('[data-testid="model-plan-name"]').contains('for Empty Plan');

    cy.get('#plan-characteristics-is-new-model-no')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-existing-model')
      .should('be.visible')
      .clickEnabled()
      .typeEnabled('Plan with B{downArrow}{enter}')
      .should('have.value', 'Plan with Basics');

    cy.get('#plan-characteristics-resembles-existing-model')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-resembles-which-model').within(() => {
      cy.get("input[type='text']").typeEnabled(
        'advance payment{downArrow}{enter}'
      );
    });

    cy.get('[data-testid="multiselect-tag--Advance Payment ACO Model"]')
      .first()
      .contains('Advance Payment ACO Model');

    cy.clickOutside();

    cy.get('#plan-characteristics-resembles-how-model')
      .typeEnabled('In every way')
      .should('have.value', 'In every way');

    cy.get('#plan-characteristics-has-component-or-tracks')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-tracks-differ-how')
      .typeEnabled('In no way')
      .should('have.value', 'In no way');

    cy.contains('button', 'Next').clickEnabled();

    // Page - /characteristics/key-charactertics

    cy.get('#plan-characteristics-alternative-payment-MIPS')
      .checkEnabled({ force: true })
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('[data-testid="mandatory-fields-alert"]').contains(
      'In order to be considered by the Quality Payment Program (QPP), and to be MIPS or Advanced APM, you will need to collect TINs and NPIs for providers.'
    );

    cy.get('#plan-characteristics-key-characteristics').within(() => {
      cy.get("input[type='text']")
        .typeEnabled('payment')
        .should('have.value', 'payment');
    });

    cy.get('[data-testid="option-PAYMENT"]')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('[data-testid="multiselect-tag--Payment Model"]')
      .first()
      .contains('Payment Model');

    cy.clickOutside();

    cy.contains('button', 'Next').clickEnabled();

    // Page - /characteristics/involvements

    cy.get('#plan-characteristics-care-coordination-involved')
      .checkEnabled({ force: true })
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-care-coordination-description')
      .typeEnabled('Yes, care coordination is involved in every way')
      .should('have.value', 'Yes, care coordination is involved in every way');

    cy.get('#plan-characteristics-additional-services')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-additional-services-description')
      .typeEnabled('Yes, additional services are involved in every way')
      .should(
        'have.value',
        'Yes, additional services are involved in every way'
      );

    cy.get('#plan-characteristics-community-partners-involved')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-community-partners-description')
      .typeEnabled('Yes, community partners are involved in every way')
      .should(
        'have.value',
        'Yes, community partners are involved in every way'
      );

    cy.contains('button', 'Next').clickEnabled();

    // Page - /characteristics/targets-and-options

    cy.get('#plan-characteristics-geographies-targeted')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-geographies-type-STATE')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-geographies-applied-to-PARTICIPANTS')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-participation')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-agreement-type-PARTICIPATION')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-agreement-type-OTHER')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-agreement-type-other')
      .typeEnabled('Just a different agreement type')
      .should('have.value', 'Just a different agreement type');

    cy.get('#plan-characteristics-multiple-participation-needed')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').clickEnabled();

    // Page - /characteristics/authority

    cy.get('#plan-characteristics-rulemaking-required')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-rulemaking-required-description')
      .typeEnabled('Standard rule for next year')
      .should('have.value', 'Standard rule for next year');

    cy.get('#plan-characteristics-authority-allowance-CONGRESSIONALLY_MANDATED')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-waivers-required')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-waiver-types-FRAUD_ABUSE')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#plan-characteristics-waiver-types-PROGRAM_PAYMENT')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.contains(
      'button',
      'Save and start next Model Plan section'
    ).clickEnabled();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/participants-and-providers$/
      );
    });

    cy.get('h1.mint-h1').contains('Participants and Providers');
  });
});
