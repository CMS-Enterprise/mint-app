describe('The Model Plan Participants and Providers Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
  });

  it('completes a Model Plan Participants and Providers', () => {
    cy.clickPlanTableByName('Empty Plan');

    // Clicks the Participants and Providers tasklist item
    cy.get('[data-testid="participants-and-providers"]').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/participants-and-providers/
      );
    });

    // Page - /participants-and-providers
    cy.get('[data-testid="model-plan-name"]').contains('for Empty Plan');

    cy.get('#participants-and-providers-participants').within(() => {
      cy.get("input[type='search']").click();
    });

    cy.get('#easi-multiselect__option-MEDICARE_PROVIDERS')
      .check({ force: true })
      .should('be.checked');

    cy.get('#easi-multiselect__option-STATES')
      .check({ force: true })
      .should('be.checked');

    cy.get('#easi-multiselect__option-OTHER')
      .check({ force: true })
      .should('be.checked');

    cy.get('[data-testid="tag"]').first().contains('Medicare providers');

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

    cy.get('#participants-and-providers-current-participants')
      .check({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-application-level')
      .type('c92.00 and c92.01')
      .should('have.value', 'c92.00 and c92.01');

    cy.contains('button', 'Next').click();

    // Page - /participants-and-providers/participant-options
    cy.get('#participants-and-providers-expected-participants')
      .invoke('val', 2345)
      .trigger('change')
      .should('have.value', 2345);

    cy.get('#participants-and-providers-confidence-FAIRLY')
      .check({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-recruitment-method-OTHER')
      .check({ force: true })
      .should('be.checked');

    cy.get('#participants-and-providers-recruitment-other')
      .type('By phone')
      .should('have.value', 'By phone');

    cy.get('#participants-and-providers-selection-method').within(() => {
      cy.get("input[type='search']").click();
    });

    cy.get('#easi-multiselect__option-OTHER')
      .check({ force: true })
      .should('be.checked');

    cy.get('[data-testid="tag"]').first().contains('Other');

    cy.get('#participants-and-providers-selection-other')
      .type('The other participants are cool')
      .should('have.value', 'The other participants are cool');
  });
});
