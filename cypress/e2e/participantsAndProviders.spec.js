describe('The Model Plan Participants and providers Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('completes a Model Plan Participants and providers', () => {
    cy.clickPlanTableByName('Empty Plan');

    // Clicks the Participants and providers tasklist item
    cy.get('[data-testid="participants-and-providers"]').click();

    // Page - /participants-and-providers

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/participants-and-providers/
      );
    });
    cy.get('[data-testid="model-plan-name"]').contains('for Empty Plan');

    cy.get('#participants-and-providers-participants')
      .should('not.be.disabled')
      .within(() => {
        cy.get("input[type='text']").click();
      });

    cy.get('[data-testid="option-MEDICARE_PROVIDERS"]')
      .check({ force: true })
      .should('be.checked');

    cy.get('[data-testid="option-STATES"]')
      .check({ force: true })
      .should('be.checked');

    cy.get('[data-testid="option-OTHER"]')
      .check({ force: true })
      .should('be.checked');

    cy.clickOutside();

    cy.get('[data-testid="multiselect-tag--Medicare providers/suppliers"]')
      .first()
      .contains('Medicare providers/suppliers');

    cy.get('#participants-and-providers-medicare-type')
      .type('Oncology Providers')
      .should('have.value', 'Oncology Providers');

    cy.get('#participants-and-providers-states-engagement')
      .type('States will determine administration specific to the state')
      .should(
        'have.value',
        'States will determine administration specific to the state'
      );

    cy.get('#participants-and-providers-participants-other')
      .type('The candy people')
      .should('have.value', 'The candy people');

    cy.get('#participants-and-providers-current-participants-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-application-level')
      .type('c92.00 and c92.01')
      .should('have.value', 'c92.00 and c92.01');

    cy.contains('button', 'Next').click();

    // Page - /participants-and-providers/participant-options

    cy.get('#participants-and-providers-expected-participants')
      .should('not.be.disabled')
      .invoke('val', 2345)
      .trigger('change')
      .should('have.value', 2345);

    cy.get('#participants-and-providers-confidence-FAIRLY')
      .check({ force: true })
      .check({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-recruitment-method-OTHER')
      .check({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-recruitment-other')
      .type('By phone')
      .should('have.value', 'By phone');

    cy.get('#participants-and-providers-selection-method').within(() => {
      cy.get("input[type='text']").click();
    });

    cy.get('[data-testid="option-OTHER"]')
      .check({ force: true })
      .should('be.checked');

    cy.clickOutside();

    cy.get('[data-testid="multiselect-tag--Other"]').first().contains('Other');

    cy.get('#participants-and-providers-selection-other')
      .type('The other participants are cool')
      .should('have.value', 'The other participants are cool');

    cy.contains('button', 'Next').click();

    // Page - /participants-and-providers/communication

    cy.get('#participant-added-frequency-other')
      .should('not.be.disabled')
      .check({ force: true })
      .should('be.checked');

    cy.get('#participant-added-frequency-other-text')
      .type('Sometimes')
      .should('have.value', 'Sometimes');

    cy.get('#participant-added-frequency-continually')
      .should('not.be.disabled')
      .check({ force: true })
      .should('be.checked');

    cy.get('#participant-added-frequency-continually-text')
      .type('Every month')
      .should('have.value', 'Every month');

    cy.get('#participant-removed-frequency-other')
      .should('not.be.disabled')
      .check({ force: true })
      .should('be.checked');

    cy.get('#participant-removed-frequency-other-text')
      .type('Sometimes')
      .should('have.value', 'Sometimes');

    cy.get('#participant-removed-frequency-continually')
      .should('not.be.disabled')
      .check({ force: true })
      .should('be.checked');

    cy.get('#participant-removed-frequency-continually-text')
      .type('Every month')
      .should('have.value', 'Every month');

    cy.get('#participants-and-providers-communication-method-IT_TOOL')
      .should('not.be.disabled')
      .as('communication')
      .check({ force: true });
    cy.get('@communication').should('be.checked');

    cy.get('#participants-and-providers-risk-type-OTHER')
      .check({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-risk-type-other')
      .type('Programmatic Risk')
      .should('have.value', 'Programmatic Risk');

    cy.get('#participants-and-providers-risk-change-true')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();

    // Page - /participants-and-providers/coordination

    cy.get(
      '#participants-and-providers-participant-require-financial-guarantee-true'
    )
      .should('not.be.disabled')
      .check({ force: true })
      .should('be.checked');

    cy.get(
      '#participants-and-providers-participant-require-financial-guarantee-type-SURETY_BOND'
    )
      .should('not.be.disabled')
      .check({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-coordniate-work-true')
      .should('not.be.disabled')
      .check({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-gainshare-payment-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-gainshare-track-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-participant-eligibility-OTHER')
      .check({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-participant-eligibility-other')
      .type('Providers are eligible in certain cases')
      .should('have.value', 'Providers are eligible in certain cases');

    cy.get('#participants-and-providers-participant-id-OTHER')
      .check({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-participant-id-other')
      .type('Candy Kingdom Operations Number')
      .should('have.value', 'Candy Kingdom Operations Number');

    cy.contains('button', 'Next').click();

    // Page - /participants-and-providers/provider-options

    cy.get('#participants-and-providers-additional-frequency-other')
      .should('not.be.disabled')
      .check({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-additional-frequency-other-text')
      .type('Every other leap year')
      .should('have.value', 'Every other leap year');

    cy.get('#participants-and-providers-provider-add-method').within(() => {
      cy.get("input[type='text']").click();
    });

    cy.get('[data-testid="option-OTHER"]')
      .check({ force: true })
      .should('be.checked');

    cy.clickOutside();

    cy.get('[data-testid="multiselect-tag--Other"]').first().contains('Other');

    cy.get('#participants-and-providers-provider-add-method-other')
      .type('Competitive ball-room dancing, free for all')
      .should('have.value', 'Competitive ball-room dancing, free for all');

    cy.get(
      '#participants-and-providers-leave-method-VOLUNTARILY_WITHOUT_IMPLICATIONS'
    )
      .check({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-leave-method-OTHER')
      .check({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-leave-method-other')
      .type('When demanded by law')
      .should('have.value', 'When demanded by law');

    cy.get('#participants-and-providers-provider-overlap-YES_NEED_POLICIES')
      .check({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-provider-overlap-hierarchy')
      .type('When overlap occurs, this model will be a secondary model')
      .should(
        'have.value',
        'When overlap occurs, this model will be a secondary model'
      );

    cy.contains('button', 'Save and return to task list').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
    });
  });
});
