describe('Notification Center', () => {
  it('navigates through the Notification page', () => {
    cy.localLogin({ name: 'JTTC', role: 'MINT_ASSESSMENT_NONPROD' });
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
    cy.get('[data-testid="navmenu__notification"]').first().click();

    // Actual Notification Test
    cy.get('[data-testid="navmenu__notification"]')
      .should('have.attr', 'href')
      .and('equal', '/notifications');

    // Check to see if Notification Nav Button has the red dot
    cy.get('[data-testid="navmenu__notifications--yesNotification"').should(
      'exist'
    );

    cy.get('[data-testid="individual-notification"]').should('have.length', 2);

    cy.get('[data-testid="individual-notification"]')
      .first()
      .find('button', 'View Discussion')
      .click();

    // Navigate to Notification page (faster than cy.visit)
    cy.get('[data-testid="close-discussions"]').click();
    cy.get('[data-testid="navmenu__notification"]').first().click();

    // Check to see first entry should no longer have red dot
    cy.get('[data-testid="individual-notification"]')
      .first()
      .find('[data-testid="notification-red-dot"]')
      .should('not.exist');

    // Mark all as read
    cy.contains('button', 'Mark all as read').click();

    // No more red dots
    cy.get('[data-testid="navmenu__notifications--noNotification"').should(
      'exist'
    );
    cy.get('[data-testid="notification-red-dot"]').should('have.length', 0);
  });

  it('navigates to see Daily Digest notification', () => {
    cy.localLogin({ name: 'MINT', role: 'MINT_ASSESSMENT_NONPROD' });
    cy.visit('/notifications');

    cy.get('[data-testid="individual-notification"]')
      .first()
      .find('[data-testid="notification-red-dot"]')
      .should('exist');
    cy.contains('button', 'View digest').click();

    cy.get('[data-testid="notification--daily-digest"').should('exist');

    cy.contains('h3', 'Empty Plan').siblings('a').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/models\/.{36}\/read-only\/model-basics/);
    });
  });

  it('navigates to see Notification Settings', () => {
    cy.localLogin({ name: 'MINT', role: 'MINT_ASSESSMENT_NONPROD' });
    cy.visit('/notifications');

    // Notification Settings Test
    cy.contains('a', 'Notification settings').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/settings/);
    });

    // Uncheck first checkbox and save
    cy.get('form').within(() => {
      cy.get('#notification-setting-email-dailyDigestComplete').uncheck({
        force: true
      });
      cy.root().submit();
    });

    cy.contains('a', 'Notification settings').click();

    // Unchecked first box persists
    cy.get('#notification-setting-email-dailyDigestComplete').should(
      'not.be.checked'
    );
  });

  it('testing New Discussion Reply Notification', () => {
    cy.localLogin({ name: 'JTTC', role: 'MINT_ASSESSMENT_NONPROD' });
    cy.clickPlanTableByName('Empty Plan');

    // Create a discussion to start things off
    cy.contains('button', 'Start a discussion').click();

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

    // New Discussion Reply test
    cy.contains('button', 'Reply').click();

    cy.contains('label', 'Type your reply');

    cy.get('#mention-editor').type(
      'Triggering new discussion reply notification'
    );

    cy.contains('button', 'Save reply').click();

    cy.get('[data-testid="close-discussions"]').click();
    cy.get('[data-testid="navmenu__notification"]').first().click();

    cy.get('[data-testid="navmenu__notifications--yesNotification"').should(
      'exist'
    );

    cy.get('[data-testid="individual-notification"]').should('have.length', 2);

    cy.get('[data-testid="individual-notification"]')
      .first()
      .find('button', 'View Discussion')
      .click();

    cy.get('[data-testid="close-discussions"]').click();
    cy.get('[data-testid="navmenu__notification"]').first().click();

    cy.get('[data-testid="individual-notification"]')
      .first()
      .find('[data-testid="notification-red-dot"]')
      .should('not.exist');
  });
});
