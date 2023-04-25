import { aliasQuery } from '../support/graphql-test-utils';

describe('The Model Plan Participants and Providers Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER_NONPROD' });

    cy.intercept('POST', '/api/graph/query', req => {
      aliasQuery(req, 'GetModelPlan');
      aliasQuery(req, 'GetParticipantsAndProviders');
      aliasQuery(req, 'GetParticipantOptions');
      aliasQuery(req, 'GetCommunication');
      aliasQuery(req, 'GetCoordination');
      aliasQuery(req, 'GetProviderOptions');
    });
  });

  it('completes a Model Plan Participants and Providers', () => {
    cy.clickPlanTableByName('Empty Plan');

    // Clicks the Participants and Providers tasklist item
    cy.get('[data-testid="participants-and-providers"]').clickEnabled();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/participants-and-providers/
      );
    });

    // Page - /participants-and-providers
    cy.get('[data-testid="model-plan-name"]').contains('for Empty Plan');

    cy.get('#participants-and-providers-participants').within(() => {
      cy.get("input[type='text']").clickEnabled();
    });

    cy.get('[data-testid="option-MEDICARE_PROVIDERS"]')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('[data-testid="option-STATES"]')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('[data-testid="option-OTHER"]')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.clickOutside();

    cy.get('[data-testid="multiselect-tag--Medicare providers"]')
      .first()
      .contains('Medicare providers');

    cy.get('#participants-and-providers-medicare-type')
      .typeEnabled('Oncology Providers')
      .should('have.value', 'Oncology Providers');

    cy.get('#participants-and-providers-states-engagement')
      .typeEnabled('States will determine administration specific to the state')
      .should(
        'have.value',
        'States will determine administration specific to the state'
      );

    cy.get('#participants-and-providers-participants-other')
      .typeEnabled('The candy people')
      .should('have.value', 'The candy people');

    cy.get('#participants-and-providers-current-participants')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-application-level')
      .typeEnabled('c92.00 and c92.01')
      .should('have.value', 'c92.00 and c92.01');

    cy.contains('button', 'Next').clickEnabled();

    // Page - /participants-and-providers/participant-options

    cy.get('#participants-and-providers-expected-participants')
      .invoke('val', 2345)
      .trigger('change')
      .should('have.value', 2345);

    cy.get('#participants-and-providers-confidence-FAIRLY')
      .checkEnabled({ force: true })
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-recruitment-method-OTHER')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-recruitment-other')
      .typeEnabled('By phone')
      .should('have.value', 'By phone');

    cy.get('#participants-and-providers-selection-method').within(() => {
      cy.get("input[type='text']").clickEnabled();
    });

    cy.get('[data-testid="option-OTHER"]')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.clickOutside();

    cy.get('[data-testid="multiselect-tag--Other"]').first().contains('Other');

    cy.get('#participants-and-providers-selection-other')
      .typeEnabled('The other participants are cool')
      .should('have.value', 'The other participants are cool');

    cy.contains('button', 'Next').clickEnabled();

    // Page - /participants-and-providers/communication

    cy.get('#participants-and-providers-communication-method-IT_TOOL')
      .as('communication')
      .checkEnabled({ force: true });
    cy.get('@communication').should('be.checked');

    cy.get('#participants-and-providers-risk')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-risk-type-OTHER')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-risk-type-other')
      .typeEnabled('Programmatic Risk')
      .should('have.value', 'Programmatic Risk');

    cy.get('#participants-and-providers-risk-change')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').clickEnabled();

    // Page - /participants-and-providers/coordination

    cy.get('#participants-and-providers-coordniate-work')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-gainshare-payment')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-gainshare-track')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-participant-id-OTHER')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-participant-id-other')
      .typeEnabled('Candy Kingdom Operations Number')
      .should('have.value', 'Candy Kingdom Operations Number');

    cy.contains('button', 'Next').clickEnabled();

    // Page - /participants-and-providers/provider-options

    cy.get('#participants-and-providers-additional-frequency-OTHER')
      .checkEnabled({ force: true })
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-additional-frequency-other')
      .typeEnabled('Every other leap year')
      .should('have.value', 'Every other leap year');

    cy.get('#participants-and-providers-provider-add-method').within(() => {
      cy.get("input[type='text']").clickEnabled();
    });

    cy.get('[data-testid="option-OTHER"]')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.clickOutside();

    cy.get('[data-testid="multiselect-tag--Other"]').first().contains('Other');

    cy.get('#participants-and-providers-provider-add-method-other')
      .typeEnabled('Competitive ball-room dancing, free for all')
      .should('have.value', 'Competitive ball-room dancing, free for all');

    cy.get(
      '#participants-and-providers-leave-method-VOLUNTARILY_WITHOUT_IMPLICATIONS'
    )
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-leave-method-OTHER')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-leave-method-other')
      .typeEnabled('When demanded by law')
      .should('have.value', 'When demanded by law');

    cy.get('#participants-and-providers-provider-overlap-YES_NEED_POLICIES')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-provider-overlap-hierarchy')
      .typeEnabled('When overlap occurs, this model will be a secondary model')
      .should(
        'have.value',
        'When overlap occurs, this model will be a secondary model'
      );

    cy.contains('button', 'Save and return to task list').clickEnabled();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
    });
  });
});
