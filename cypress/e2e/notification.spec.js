import { aliasMutation, aliasQuery } from '../support/graphql-test-utils';

// Full page load. The notifications page and the nav bar share an Apollo cache,
// so a client-side visit can render a list fetched before the event was written.
const openNotifications = () => {
  cy.visit('/notifications');
  cy.get('[data-testid="notification-index"]').should('be.visible');
  cy.get('[data-testid="spinner"]').should('not.exist');
};

// Saving redirects to /notifications only after the mutation succeeds.
// Navigating away before that races the redirect and can drop the new preference.
const saveNotificationSettings = () => {
  cy.contains('button', 'Save').should('not.be.disabled').click();
  cy.location('pathname').should('eq', '/notifications');
  cy.get('[data-testid="toast-success"]').should('be.visible');
  cy.get('[data-testid="spinner"]').should('not.exist');
};

// Check both channels once the settings form has loaded. ensureChecked retries
// because a click during hydration does not stick.
const enableNotification = name => {
  cy.get('#notification-settings-form fieldset')
    .first()
    .should('not.be.disabled');

  cy.ensureChecked(
    `#notification-setting-email-${name}`,
    `label[for="notification-setting-email-${name}"]`
  );
  cy.ensureChecked(
    `#notification-setting-in-app-${name}`,
    `label[for="notification-setting-in-app-${name}"]`
  );
};

describe('Notification Center', () => {
  describe('MINT Assessment User Tests', () => {
    beforeEach(() => {
      cy.localLogin({ name: 'JTTC', role: 'MINT_ASSESSMENT_NONPROD' });
      cy.visit('/');
    });

    it('navigates through the Notification page', () => {
      // Preliminarily creating two notifications before testing notifications:
      // two discussions that @mention JTTC. The discussion form itself is covered in discussions.spec.js
      ['First Notification', 'Second Notification'].forEach(text => {
        cy.task('createDiscussion', {
          euaId: 'JTTC',
          jobCodes: ['MINT_ASSESSMENT_NONPROD'],
          modelPlanName: 'Empty Plan',
          userRole: 'NONE_OF_THE_ABOVE',
          userRoleDescription: 'Designer',
          content: `<p><span class="mention" data-type="mention" data-id="JTTC" data-label="Anabelle Jerde (JTTC)" data-mention-suggestion-char="@" data-id-db="" tag-type="USER_ACCOUNT">@Anabelle Jerde (JTTC)</span> ${text}</p>`
        });
      });

      openNotifications();

      // Actual Notification Test
      cy.get('[data-testid="navmenu__notification"]')
        .should('have.attr', 'href')
        .and('equal', '/notifications');

      // Check to see if Notification Nav Button has the red dot
      cy.get('[data-testid="navmenu__notifications--yesNotification"]').should(
        'exist'
      );

      cy.get('[data-testid="individual-notification"]')
        .should('have.length', 2)
        .first()
        .contains('button', /view discussion/i)
        .click();

      cy.get('[data-testid="close-discussions"]').click({ force: true });
      openNotifications();

      // Check to see first entry should no longer have red dot
      cy.get('[data-testid="individual-notification"]')
        .first()
        .find('[data-testid="notification-red-dot"]')
        .should('not.exist');

      cy.intercept('POST', '/api/graph/query', req => {
        aliasMutation(req, 'UpdateAllNotificationsAsRead');
      });

      cy.contains('button', 'Mark all').click();
      cy.wait('@UpdateAllNotificationsAsRead')
        .its('response.statusCode')
        .should('eq', 200);

      // Reload so the nav icon is not waiting on its 5s poll
      openNotifications();

      cy.get('[data-testid="navmenu__notifications--noNotification"]').should(
        'exist'
      );
      cy.get('[data-testid="notification-red-dot"]').should('have.length', 0);
    });

    it('testing New Discussion Reply Notification', () => {
      cy.enterModelPlanTaskList('Empty Plan');

      // New Discussion Reply test
      cy.contains('button', 'View discussions').click();
      cy.contains('button', 'Reply').first().click();

      cy.contains('label', 'Type your reply');

      cy.intercept('POST', '/api/graph/query', req => {
        aliasMutation(req, 'CreateModelPlanReply');
      });

      cy.get('#mention-editor').type(
        'Triggering new discussion reply notification'
      );

      cy.contains('button', 'Save reply').click();
      cy.wait('@CreateModelPlanReply')
        .its('response.statusCode')
        .should('eq', 200);

      cy.get('[data-testid="close-discussions"]').click({ force: true });
      openNotifications();

      cy.get('[data-testid="navmenu__notifications--yesNotification"]').should(
        'exist'
      );

      cy.get('[data-testid="individual-notification"]').should(
        'have.length',
        3
      );

      // Checking that marking as read works
      cy.get('[data-testid="individual-notification"]')
        .first()
        .contains('button', /view discussion/i)
        .click();

      cy.get('[data-testid="close-discussions"]').click({ force: true });
      openNotifications();

      cy.get('[data-testid="individual-notification"]')
        .first()
        .find('[data-testid="notification-red-dot"]')
        .should('not.exist');
    });
  });

  describe('MINT User With No Role Tests', () => {
    beforeEach(() => {
      cy.localLogin({ name: 'MINT' });
      cy.visit('/notifications/settings');
    });

    it('navigates to see Daily Digest notification', () => {
      openNotifications();

      cy.contains('[data-testid="individual-notification"]', 'View digest')
        .find('[data-testid="notification-red-dot"]')
        .should('exist');
      cy.contains('button', 'View digest').click();

      cy.get('[data-testid="notification--daily-digest"]').should('exist');

      cy.contains('h3', 'Empty Plan').siblings('a').click();

      cy.location().should(loc => {
        expect(loc.pathname).to.match(/models\/.{36}\/change-history/);
      });
    });

    it('navigates to see Notification Settings', () => {
      // Uncheck first checkbox and save
      cy.get('#notification-settings-form fieldset')
        .first()
        .should('not.be.disabled');

      cy.get('#notification-setting-email-dailyDigestComplete')
        .should('be.checked')
        .uncheck({
          force: true
        });
      cy.get('#notification-setting-email-dailyDigestComplete').should(
        'not.be.checked'
      );

      saveNotificationSettings();

      cy.contains('a', 'Notification settings').click();

      // Unchecked first box persists
      cy.get('#notification-setting-email-dailyDigestComplete').should(
        'not.be.checked'
      );
    });

    it('testing Adding Collaborator Notification', () => {
      // Add SF13 as a collaborator (the add-collaborator form is covered in collaborator.spec.js)
      cy.task('addCollaborator', {
        euaId: 'MINT',
        modelPlanName: 'Empty Plan',
        userName: 'SF13',
        teamRoles: ['EVALUATION']
      });

      cy.logout();

      // Login as SF13
      cy.localLogin({ name: 'SF13' });
      openNotifications();

      cy.get('[data-testid="individual-notification"]').contains(
        'MINT Doe added you to the team for Empty Plan.'
      );

      cy.contains('button', 'Start collaborating').click();

      cy.url().should('include', '/collaboration-area');
    });

    it('testing Incorrect Model Status Notification', () => {
      enableNotification('incorrectModelStatus');
      saveNotificationSettings();

      cy.visit('/');
      cy.get('[data-testid="homepage"]').should('be.visible');

      cy.contains('a', 'Plan with Timeline').click();
      cy.url().should('include', '/collaboration-area');
      cy.contains('button', 'Edit timeline').click();

      cy.get('#timeline-completeICIP')
        .clear()
        .type('05/23/2015')
        .should('have.value', '05/23/2015');

      cy.get('#timeline-wrapUpEnds')
        .clear()
        .type('05/23/2025')
        .should('have.value', '05/23/2025');

      cy.clickOutside();

      cy.intercept('POST', '/api/graph/query', req => {
        aliasMutation(req, 'UpdateTimeline');
      });
      cy.contains('button', 'Save').click();
      cy.wait('@UpdateTimeline').its('response.statusCode').should('eq', 200);

      // Comment out since currently need to wait for too long for below notification to show
      // Navigate back to Notification Center
      // cy.get('[data-testid="navmenu__notification"]').click();
      // cy.url().should('include', '/notifications');

      // cy.wait(30000);

      // cy.get('[data-testid="individual-notification"]').contains(
      //   'MINT suggests that you update the model status for Plan with Timeline.'
      // );

      // Unsubscribe via email link
      cy.visit(
        '/notifications/settings?unsubscribe_email=INCORRECT_MODEL_STATUS'
      );

      cy.get(
        '[data-testid="notification-setting-email-incorrectModelStatus"]'
      ).should('be.not.checked');

      cy.get('[data-testid="toast-success"]').contains(
        'You have successfully unsubscribed from email notifications when MINT detects an incorrect model status.'
      );

      cy.visit(
        '/notifications/settings?unsubscribe_email=INCORRECT_MODEL_STATUS'
      );

      cy.get('[data-testid="alert"]').contains(
        'You are already unsubscribed from email notifications when MINT detects an incorrect model status.'
      );
    });

    it('testing New Model Plan Notification', () => {
      enableNotification('newModelPlan');
      saveNotificationSettings();

      cy.visit('/');
      cy.get('[data-testid="homepage"]').should('be.visible');

      cy.contains('a', 'Add a new model to MINT').click();
      cy.contains('h1', 'Add a new model to MINT');
      cy.get('[data-testid="continue-link"]').click();

      cy.get('#new-plan-model-name')
        .type('Cypress Model Plan')
        .should('have.value', 'Cypress Model Plan');

      cy.contains('button', 'Next').click();
      cy.url().should('include', '/collaboration-area/collaborators');

      openNotifications();

      cy.get('[data-testid="individual-notification"]').contains(
        'MINT Doe created a Model Plan: Cypress Model Plan.'
      );

      // Unsubscribe via email link
      cy.visit('/notifications/settings?unsubscribe_email=NEW_MODEL_PLAN');

      cy.get('[data-testid="notification-setting-email-newModelPlan"]').should(
        'be.not.checked'
      );

      cy.get('[data-testid="toast-success"]').contains(
        'You have successfully unsubscribed from email notifications when a new Model Plan is created.'
      );

      cy.visit('/notifications/settings?unsubscribe_email=NEW_MODEL_PLAN');

      cy.get('[data-testid="alert"]').contains(
        'You are already unsubscribed from email notifications when a new Model Plan is created.'
      );
    });

    it('testing Dates Changed Notification', () => {
      enableNotification('datesChanged');
      saveNotificationSettings();

      cy.visit('/');

      cy.enterModelPlanCollaborationArea('Empty Plan');

      // Enter into timeline form
      cy.get('[data-testid="to-timeline"]').click();

      cy.url().should('include', '/model-timeline');
      cy.get('#timeline-completeICIP')
        .type('12/31/2025')
        .should('have.value', '12/31/2025');

      cy.clickOutside();

      cy.intercept('POST', '/api/graph/query', req => {
        aliasMutation(req, 'UpdateTimeline');
      });
      cy.contains('button', 'Save').click();
      cy.wait('@UpdateTimeline').its('response.statusCode').should('eq', 200);

      openNotifications();

      cy.get('[data-testid="individual-notification"]').contains(
        'updated the dates for Empty Plan.'
      );

      cy.contains('button', 'View changes')
        .should('be.not.disabled')
        .click({ force: true });

      cy.get('[data-testid="notification--dates-changed"]').should('exist');

      // Unsubscribe via email link
      cy.visit('/notifications/settings?unsubscribe_email=DATES_CHANGED');

      cy.get('[data-testid="notification-setting-email-datesChanged"]').should(
        'be.not.checked'
      );

      cy.get('[data-testid="toast-success"]').contains(
        'You have successfully unsubscribed from email notifications when model dates change.'
      );

      cy.visit('/notifications/settings?unsubscribe_email=DATES_CHANGED');

      cy.get('[data-testid="alert"]').contains(
        'You are already unsubscribed from email notifications when model dates change.'
      );
    });

    it('testing New Discussion Added Notification', () => {
      enableNotification('newDiscussionAdded');
      saveNotificationSettings();

      // Start a discussion (the discussion form is covered in discussions.spec.js)
      cy.task('createDiscussion', {
        euaId: 'MINT',
        modelPlanName: 'Empty Plan',
        userRole: 'MINT_TEAM',
        content: '<p>How to I get to model characteristics?</p>'
      });

      openNotifications();

      cy.get('[data-testid="individual-notification"]').contains(
        'added a discussion for Empty Plan.'
      );

      cy.contains('button', 'View discussion')
        .should('be.not.disabled')
        .click({ force: true });

      // Unsubscribe via email link
      cy.visit(
        '/notifications/settings?unsubscribe_email=NEW_DISCUSSION_ADDED'
      );

      cy.get(
        '[data-testid="notification-setting-email-newDiscussionAdded"]'
      ).should('be.not.checked');

      cy.get('[data-testid="toast-success"]').contains(
        'You have successfully unsubscribed from email notifications when a new discussion is added.'
      );

      cy.visit(
        '/notifications/settings?unsubscribe_email=NEW_DISCUSSION_ADDED'
      );

      cy.get('[data-testid="alert"]').contains(
        'You are already unsubscribed from email notifications when a new discussion is added.'
      );
    });

    it('testing Data Exchange Approach is marked Complete Notification', () => {
      enableNotification('dataExchangeApproachMarkedComplete');
      saveNotificationSettings();

      cy.visit('/');

      cy.enterModelPlanCollaborationArea('Empty Plan');
      cy.contains('button', 'Go to questionnaires').click();

      cy.url().should('include', '/additional-questionnaires');
      cy.get('[data-testid="data-exchange-approach-button"]').within(() => {
        cy.contains('Start').click();
      });

      cy.contains('button', 'Next')
        .should('not.be.disabled')
        .click({ force: true });
      cy.get('#collect-and-send-data-form-next-button')
        .should('not.be.disabled')
        .click({ force: true });
      cy.get('#collection-and-aggregation-form-next-button')
        .should('not.be.disabled')
        .click({ force: true });

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

      cy.contains('button', 'Save and return to questionnaires').click();

      cy.url().should('include', '/additional-questionnaires');
      cy.get('h1').contains('Additional questionnaires');

      openNotifications();

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

      cy.get('[data-testid="toast-success"]').contains(
        'You have successfully unsubscribed from email notifications when a data exchange approach is completed.'
      );

      cy.visit(
        '/notifications/settings?unsubscribe_email=DATA_EXCHANGE_APPROACH_MARKED_COMPLETE'
      );

      cy.get('[data-testid="alert"]').contains(
        'You are already unsubscribed from email notifications when a data exchange approach is completed.'
      );
    });

    it('testing IDDOC Questionnaire is marked Complete Notification', () => {
      cy.intercept('POST', '/api/graph/query', req => {
        aliasQuery(req, 'GetIDDOCQuestionnaireMonitoring');
      });

      // Check the IDDOC questionnaire in-app checkbox
      enableNotification('iddocQuestionnaireComplete');
      saveNotificationSettings();

      cy.visit('/');

      cy.enterModelPlanTaskList('Empty Plan');
      cy.get('[data-testid="ops-eval-and-learning"]').click();

      cy.get('#ops-eval-and-learning-help-desk-use-true').should(
        'not.be.disabled'
      );

      cy.get('#ops-eval-and-learning-iddoc-support-true')
        .check({ force: true })
        .should('be.checked');
      cy.contains('button', 'Save and return to Model Plan').click();

      cy.get('[data-testid="return-to-collaboration"]').click();

      cy.contains('button', 'Go to questionnaires').click();

      cy.url().should('include', '/additional-questionnaires');
      cy.get('[data-testid="iddoc-questionnaire-button"]').within(() => {
        cy.contains('Start').click();
      });

      cy.get('#iddoc-questionnaire-operations-form-next-button')
        .should('not.be.disabled')
        .click({ force: true });
      cy.get('#iddoc-questionnaire-testing-form-next-button')
        .should('not.be.disabled')
        .click({ force: true });

      cy.wait('@GetIDDOCQuestionnaireMonitoring')
        .its('response.statusCode')
        .should('eq', 200);

      cy.get('#is-complete').should('not.be.disabled');
      cy.ensureChecked(
        '#is-complete',
        '.usa-checkbox__label[for="is-complete"]'
      );
      cy.get('#is-complete').should('be.checked');

      cy.contains('button', 'Save and return to questionnaires').click();

      cy.url().should('include', '/additional-questionnaires');
      cy.get('h1').contains('Additional questionnaires');

      openNotifications();

      cy.get('[data-testid="individual-notification"]').contains(
        'MINT Doe marked the 4i/ACO-OS questionnaire complete for Empty Plan.'
      );

      cy.contains('button', 'View questionnaire').click();

      cy.url().should('include', '/read-view/iddoc-questionnaire');

      // Unsubscribe via email link
      cy.visit(
        '/notifications/settings?unsubscribe_email=IDDOC_QUESTIONNAIRE_COMPLETED'
      );

      cy.get(
        '[data-testid="notification-setting-email-iddocQuestionnaireComplete"]'
      ).should('be.not.checked');

      cy.get('[data-testid="toast-success"]').contains(
        'You have successfully unsubscribed from email notifications when a 4i/ACO-OS questionnaire is completed.'
      );

      cy.visit(
        '/notifications/settings?unsubscribe_email=IDDOC_QUESTIONNAIRE_COMPLETED'
      );

      cy.get('[data-testid="alert"]').contains(
        'You are already unsubscribed from email notifications when a 4i/ACO-OS questionnaire is completed.'
      );
    });

    it('testing MTO is marked Ready for Review Notification', () => {
      cy.intercept('POST', '/api/graph/query', req => {
        aliasMutation(req, 'UpdateMTOReadyForReview');
      });

      enableNotification('mtoReadyForReview');
      saveNotificationSettings();

      cy.visit('/');

      cy.enterModelPlanCollaborationArea('Model Plan for MTO testing');

      cy.get('[data-testid="Card"]')
        .filter(':has(h3:contains("Model-to-operations matrix"))')
        .within(() => {
          cy.contains('button', 'Go to matrix').click();
        });
      cy.url().should(
        'include',
        '/collaboration-area/model-to-operations/matrix'
      );
      cy.get('[data-testid="tasklist-tag"]').contains('In progress');
      cy.get('[data-testid="tasklist-tag"]')
        .contains('Ready for review')
        .should('not.exist');
      cy.contains('button', 'Is this MTO ready for review?').click();

      cy.get('[data-testid="mto-ready-for-review-modal"]').within(() => {
        cy.contains('button', 'Mark as ready for review').click();
      });
      cy.wait('@UpdateMTOReadyForReview')
        .its('response.statusCode')
        .should('eq', 200);
      cy.get('[data-testid="mto-ready-for-review-modal"]').should('not.exist');
      cy.get('[data-testid="tasklist-tag"]').contains('Ready for review');
      cy.get('[data-testid="tasklist-tag"]')
        .contains('In progress')
        .should('not.exist');

      openNotifications();

      cy.get('[data-testid="individual-notification"]').contains(
        'MINT Doe marked the model-to-operations matrix (MTO) for Model Plan for MTO testing as ready for review.'
      );

      cy.contains('button', 'View MTO').click();

      cy.url().should('include', '/read-view/milestones');

      // Unsubscribe via email link
      cy.visit(
        '/notifications/settings?unsubscribe_email=MTO_READY_FOR_REVIEW'
      );

      cy.get(
        '[data-testid="notification-setting-email-mtoReadyForReview"]'
      ).should('be.not.checked');

      cy.get('[data-testid="toast-success"]').contains(
        'You have successfully unsubscribed from email notifications when an MTO is marked ready for review.'
      );

      cy.visit(
        '/notifications/settings?unsubscribe_email=MTO_READY_FOR_REVIEW'
      );

      cy.get('[data-testid="alert"]').contains(
        'You are already unsubscribed from email notifications when an MTO is marked ready for review.'
      );
    });
  });
});
