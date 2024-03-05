describe('Notification Center', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER_NONPROD' });
  });

  it('navigates through the Notification page', () => {
    cy.clickPlanTableByName('Empty Plan');

    cy.contains('button', 'Start a discussion').click();

    // Preliminarily creating two notifications before testing notifications
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

    cy.get('[data-testid="close-discussions"]').click();
    cy.get('[data-testid="signout-link"]').click();

    cy.localLogin({ name: 'JTTC', role: 'MINT_ASSESSMENT_NONPROD' });

    cy.visit('/notifications');

    // Actual Notification Test
    cy.get('[data-testid="navmenu__notification"]')
      .should('have.attr', 'href')
      .and('equal', '/notifications');

    cy.get('[data-testid="navmenu__notifications--yesNotification"').should(
      'exist'
    );

    cy.get('[data-testid="individual-notification"]').should('have.length', 2);

    cy.get('[data-testid="individual-notification"]')
      .first()
      .find('button', 'View Discussion')
      .click();

    cy.visit('/notifications');

    // cy.get('[data-testid="individual-notification"]')
    //   .first()
    //   .find('[data-testid="notification-red-dot"]')
    //   .should('exist');
  });
});
