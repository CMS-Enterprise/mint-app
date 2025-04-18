describe('Notification Center', () => {
  it('navigates through the Notification page', () => {
    cy.localLogin({ name: 'JTTC', role: 'MINT_ASSESSMENT_NONPROD' });
    cy.visit('/');
    cy.enterModelPlanTaskList('Empty Plan');

    cy.contains('button', 'Start a discussion').click();

    // Preliminarily creating two notifications before testing notifications
    // First notification
    cy.contains('h1', 'Start a discussion');

    cy.contains('button', 'Save discussion').should('be.disabled');

    cy.get('#user-role').should('not.be.disabled').select('None of the above');

    cy.get('#user-role-description')
      .type('Designer')
      .should('have.value', 'Designer');

    cy.get('#mention-editor')
      .type('@ana')
      .contains('Anabelle Jerde (JTTC)')
      .click();
    cy.get('#mention-editor')
      .type('First Notification')
      .should('have.text', '@Anabelle Jerde (JTTC) First Notification');

    cy.contains('button', 'Save discussion').click();

    // Second notification
    cy.contains('button', 'Start a discussion').click();

    cy.get('#user-role').should('not.be.disabled').select('None of the above');

    cy.get('#user-role-description').should('have.value', 'Designer');

    cy.get('#mention-editor')
      .type('@ana')
      .contains('Anabelle Jerde (JTTC)')
      .click();
    cy.get('#mention-editor')
      .type('Second Notification')
      .should('have.text', '@Anabelle Jerde (JTTC) Second Notification');

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

    cy.get('[data-testid="individual-notification"]')
      .should('have.length', 2)
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
    cy.contains('button', 'Mark all').click();

    // No more red dots
    cy.get('[data-testid="navmenu__notifications--noNotification"').should(
      'exist'
    );
    cy.get('[data-testid="notification-red-dot"]').should('have.length', 0);
  });

  it('navigates to see Daily Digest notification', () => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/notifications');

    cy.get('[data-testid="individual-notification"]')
      .first()
      .find('[data-testid="notification-red-dot"]')
      .should('exist');
    cy.contains('button', 'View digest').click();

    cy.get('[data-testid="notification--daily-digest"').should('exist');

    cy.contains('h3', 'Empty Plan').siblings('a').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/models\/.{36}\/change-history/);
    });
  });

  it('navigates to see Notification Settings', () => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/notifications/settings');

    // Uncheck first checkbox and save
    cy.get('#notification-setting-email-dailyDigestComplete')
      .should('be.checked')
      .uncheck({
        force: true
      });

    cy.contains('button', 'Save').click();

    cy.get('[data-testid="success-alert"').should('exist');

    cy.contains('a', 'Notification settings').click();

    // Unchecked first box persists
    cy.get('#notification-setting-email-dailyDigestComplete').should(
      'not.be.checked'
    );
  });

  it('testing New Discussion Reply Notification', () => {
    cy.localLogin({ name: 'JTTC', role: 'MINT_ASSESSMENT_NONPROD' });
    cy.visit('/');
    cy.enterModelPlanTaskList('Empty Plan');

    // New Discussion Reply test
    cy.contains('button', 'View discussions').click();
    cy.contains('button', 'Reply').first().click();

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

    cy.get('[data-testid="individual-notification"]').should('have.length', 3);

    // Checking that marking as read works
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

  it('testing Adding Collaborator Notification', () => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
    cy.enterModelPlanCollaborationArea('Empty Plan');

    // Add SF13 as a collaborator
    cy.get('[data-testid="add-collaborator"]').click();

    cy.get('#react-select-model-team-cedar-contact-input')
      .click()
      .type('Jerry', { delay: 100 });

    cy.get('#react-select-model-team-cedar-contact-option-0')
      .contains('Jerry Seinfeld, SF13')
      .click();

    cy.get('#collaborator-role').within(() => {
      cy.get("input[type='text']").click().type('evalu{downArrow}{enter}');
    });

    cy.clickOutside();

    cy.get('[data-testid="multiselect-tag--Evaluation"]')
      .first()
      .contains('Evaluation');

    cy.contains('button', 'Add team member').click();

    cy.logout();

    // Login as SF13
    cy.localLogin({ name: 'SF13' });
    cy.visit('/');

    cy.get('[data-testid="navmenu__notification"]').first().click();

    cy.get('[data-testid="individual-notification"]').contains(
      'MINT Doe added you to the team for Empty Plan.'
    );

    cy.contains('button', 'Start collaborating').click();

    cy.url().should('include', '/collaboration-area');
  });

  it('testing New Model Plan Notification', () => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/notifications/settings');

    // Check the new model plan in-app checkbox
    cy.get('[data-testid="notification-setting-in-app-newModelPlan"]')
      .should('not.be.disabled')
      .should('be.not.checked')
      .check({
        force: true
      });

    cy.get('[data-testid="notification-setting-email-newModelPlan"]')
      .should('not.be.disabled')
      .should('be.not.checked')
      .check({
        force: true
      });

    cy.contains('button', 'Save').click();

    // Navigate back to home to start a new model plan
    cy.get('[aria-label="Home"]').click();
    cy.url().should('include', '/');

    cy.contains('a', 'Start a new Model Plan').click();
    cy.contains('h1', 'Start a new model plan');
    cy.get('[data-testid="continue-link"]').click();

    cy.get('#new-plan-model-name')
      .type('Cypress Model Plan')
      .should('have.value', 'Cypress Model Plan');

    cy.contains('button', 'Next').click();
    cy.url().should('include', '/collaboration-area/collaborators');

    // Navigate back to Notification Center
    cy.get('[data-testid="navmenu__notification"]').first().click();
    cy.url().should('include', '/notifications');

    cy.get('[data-testid="individual-notification"]').contains(
      'MINT Doe created a Model Plan: Cypress Model Plan.'
    );

    // Unsubscribe via email link
    cy.visit('/notifications/settings?unsubscribe_email=NEW_MODEL_PLAN');

    cy.get('[data-testid="notification-setting-email-newModelPlan"]').should(
      'be.not.checked'
    );

    cy.get('[data-testid="success-alert"]').contains(
      'You have successfully unsubscribed from email notifications when a new Model Plan is created.'
    );

    cy.visit('/notifications/settings?unsubscribe_email=NEW_MODEL_PLAN');

    cy.get('[data-testid="error-alert"]').contains(
      'You are already unsubscribed from email notifications when a new Model Plan is created.'
    );
  });

  it('testing Dates Changed Notification', () => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/notifications/settings');

    // Check the new model plan in-app checkbox
    cy.get('[data-testid="notification-setting-in-app-datesChanged"]')
      .should('not.be.disabled')
      .should('be.not.checked')
      .check({
        force: true
      });

    cy.get('[data-testid="notification-setting-email-datesChanged"]')
      .should('not.be.disabled')
      .should('be.not.checked')
      .check({
        force: true
      });

    cy.contains('button', 'Save').click();

    // Navigate back to home to click "Empty Plan" model plan
    cy.get('[aria-label="Home"]').click();
    cy.url().should('include', '/');

    cy.enterModelPlanTaskList('Empty Plan');
    cy.get('[data-testid="basics"]').click();
    cy.url().should('include', '/basics');

    cy.get(
      '[data-testid="plan-basics-model-category-DISEASE_SPECIFIC_AND_EPISODIC"]'
    )
      .should('not.be.disabled')
      .should('be.not.checked')
      .check({
        force: true
      });
    cy.get('#new-plan-cmsCenters-CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY')
      .should('not.be.disabled')
      .should('be.not.checked')
      .check({
        force: true
      });
    cy.contains('button', 'Next').click();

    cy.url().should('include', '/overview');
    cy.get('#ModelType-VOLUNTARY')
      .should('not.be.disabled')
      .should('be.not.checked')
      .check({
        force: true
      });
    cy.contains('button', 'Next').click();

    cy.url().should('include', '/milestones');
    cy.get('#Milestone-completeICIP')
      .type('2025-12-31')
      .should('have.value', '2025-12-31');

    cy.clickOutside();

    cy.contains('button', 'Save and return to task list').click();

    cy.get('[data-testid="page-loading"]').should('not.exist');

    cy.get('[data-testid="navmenu__notification"]').click();

    cy.url().should('include', '/notifications');

    cy.get('[data-testid="spinner"]').should('not.exist');

    cy.get('[data-testid="individual-notification"]').contains(
      'Dates have been updated for Empty Plan.'
    );

    cy.contains('button', 'View changes').click();

    cy.get('[data-testid="notification--dates-changed"]').should('exist');

    // Unsubscribe via email link
    cy.visit('/notifications/settings?unsubscribe_email=DATES_CHANGED');

    cy.get('[data-testid="notification-setting-email-datesChanged"]').should(
      'be.not.checked'
    );

    cy.get('[data-testid="success-alert"]').contains(
      'You have successfully unsubscribed from email notifications when model dates change.'
    );

    cy.visit('/notifications/settings?unsubscribe_email=DATES_CHANGED');

    cy.get('[data-testid="error-alert"]').contains(
      'You are already unsubscribed from email notifications when model dates change.'
    );
  });

  it('testing Data Exchange Approach is marked Complete Notification', () => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/notifications/settings');

    // Check the new model plan in-app checkbox
    cy.get(
      '[data-testid="notification-setting-in-app-dataExchangeApproachMarkedComplete"]'
    )
      .should('not.be.disabled')
      .should('be.not.checked')
      .check({
        force: true
      });

    cy.get(
      '[data-testid="notification-setting-email-dataExchangeApproachMarkedComplete"]'
    )
      .should('not.be.disabled')
      .should('be.not.checked')
      .check({
        force: true
      });

    cy.contains('button', 'Save').click();

    // Navigate back to home to start a new model plan
    cy.get('[aria-label="Home"]').click();
    cy.url().should('include', '/');

    cy.enterModelPlanCollaborationArea('Empty Plan');
    cy.contains('button', 'Start approach').click();
    cy.contains('button', 'Next').should('not.be.disabled').click();
    cy.contains('button', 'Next').should('not.be.disabled').click();
    cy.contains('button', 'Next').should('not.be.disabled').click();

    cy.get('#additional-data-exchange-considerations-description')
      .should('not.be.disabled')
      .type('2025-12-31')
      .should('have.value', '2025-12-31');

    cy.get('#isDataExchangeApproachComplete-true')
      .should('not.be.disabled')
      .should('be.not.checked')
      .check({
        force: true
      });

    cy.contains(
      'button',
      'Save and return to model collaboration area'
    ).click();

    cy.url().should('include', '/collaboration-area');
    cy.get('h1').contains('Model collaboration area');

    cy.get('[data-testid="navmenu__notification"]').click();
    cy.url().should('include', '/notifications');
    cy.get('[data-testid="spinner"]').should('not.exist');

    cy.get('[data-testid="individual-notification"]').contains(
      'MINT Doe marked the data exchange approach complete for Empty Plan.'
    );

    cy.contains('button', 'View data exchange approach').click();

    cy.url().should('include', '/read-view/data-exchange-approach');

    // Unsubscribe via email link
    cy.visit(
      '/notifications/settings?unsubscribe_email=DATA_EXCHANGE_APPROACH_MARKED_COMPLETE'
    );

    cy.get(
      '[data-testid="notification-setting-email-dataExchangeApproachMarkedComplete"]'
    ).should('be.not.checked');

    cy.get('[data-testid="success-alert"]').contains(
      'You have successfully unsubscribed from email notifications when a data exchange approach is completed.'
    );

    cy.visit(
      '/notifications/settings?unsubscribe_email=DATA_EXCHANGE_APPROACH_MARKED_COMPLETE'
    );

    cy.get('[data-testid="error-alert"]').contains(
      'You are already unsubscribed from email notifications when a data exchange approach is completed.'
    );
  });
});
