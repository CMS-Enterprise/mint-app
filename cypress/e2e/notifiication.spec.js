describe('Notification Center', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER_NONPROD' });
  });

  it('asks a question and answers a question', () => {
    cy.clickPlanTableByName('Empty Plan');

    cy.contains('button', 'Start a discussion').click();

    // Create two notifications
    // First notification
    cy.contains('h1', 'Start a discussion');

    cy.contains('button', 'Save discussion').should('be.disabled');

    cy.get('#user-role').should('not.be.disabled');

    cy.get('#user-role').select('None of the above');

    cy.get('#user-role-description')
      .type('Designer')
      .should('have.value', 'Designer');

    cy.get('#mention-editor').type('@ana');
    cy.get('#JTTC').contains('Anabelle Jerde (JTTC)').click();
    cy.get('#mention-editor').type('First Notification');
    cy.get('#mention-editor').should(
      'have.text',
      '@Anabelle Jerde (JTTC) First Notification'
    );

    cy.contains('button', 'Save discussion').click();

    // Second notification
    cy.contains('button', 'Start a discussion').click();

    cy.get('#user-role').should('not.be.disabled');

    cy.get('#user-role').select('None of the above');

    cy.get('#user-role-description').should('have.value', 'Designer');

    cy.get('#mention-editor').type('@ana');
    cy.get('#JTTC').contains('Anabelle Jerde (JTTC)').click();
    cy.get('#mention-editor').type('Second Notification');
    cy.get('#mention-editor').should(
      'have.text',
      '@Anabelle Jerde (JTTC) Second Notification'
    );

    cy.contains('button', 'Save discussion').click();

    // CLick outside
    // Sign out
    // Sign in as JTTC with assessment powers
    // cy.localLogin({ name: 'JTTC', role: 'MINT_ASSESSMENT_NONPROD' });
    // Check notificaitons
  });
});
