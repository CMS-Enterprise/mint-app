describe('Homepage Settings', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/homepage-settings');
  });

  it('Updates settings for customizable homepage', () => {
    // Default checked
    cy.get('#MY_MODEL_PLANS').should('be.visible').should('be.checked');

    // Default unchecked
    cy.get('#ALL_MODEL_PLANS').should('be.visible').should('not.be.checked');
    cy.get('#FOLLOWED_MODELS').should('be.visible').should('not.be.checked');
    cy.get('#MODELS_WITH_CR_TDL').should('be.visible').should('not.be.checked');
    cy.get('#MODELS_BY_OPERATIONAL_SOLUTION')
      .should('be.visible')
      .should('not.be.checked');

    // Add solutions
    cy.get('[data-testid="add-solutions-settings"]').click();

    cy.get('#possible-operational-solutions').within(() => {
      cy.get("input[type='text']").click();
    });

    cy.get('[data-testid="option-CCW"]')
      .check({ force: true })
      .should('be.checked');

    cy.clickOutside();

    // Check tag is added
    cy.get(
      '[data-testid="multiselect-tag--Chronic Conditions Warehouse (CCW)"]'
    )
      .first()
      .contains('Chronic Conditions Warehouse (CCW)');

    // Save solution and go back to homepage settings
    cy.get('[data-testid="save-solution-settings"]').click();

    cy.get('[data-testid="selected-solutions"]').contains('CCW');

    cy.get('#MODELS_BY_OPERATIONAL_SOLUTION')
      .should('be.visible')
      .should('not.be.checked')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ALL_MODEL_PLANS')
      .should('be.visible')
      .should('not.be.checked')
      .check({ force: true })
      .should('be.checked');

    // Go to next page to select order
    cy.get('[data-testid="next-settings"]').click();

    cy.get('[data-testid="MY_MODEL_PLANS-0"]').contains('My Model Plans');

    // Up button disabled on first card
    cy.get('[data-testid="move-0-up"]').should(
      'have.class',
      'settings__icon__disabled'
    );

    // Down button disabled on last card
    cy.get('[data-testid="move-2-down"]').should(
      'have.class',
      'settings__icon__disabled'
    );

    cy.get('[data-testid="move-0-down"]').click();

    // Check to see if the index of MY_MODEL_PLANS was changed from 0 to 1
    cy.get('[data-testid="MY_MODEL_PLANS-1"]').contains('My Model Plans');

    // Save settings
    cy.get('[data-testid="save-settings-order"]').click();

    cy.get('[data-testid="alert"]').contains(
      ' Success! Your homepage has been updated.'
    );
  });
});
