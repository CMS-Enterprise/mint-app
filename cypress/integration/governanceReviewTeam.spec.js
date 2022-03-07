describe('Governance Review Team', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/system_intakes?status=open').as(
      'getOpenIntakes'
    );

    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'GetSystemIntake') {
        req.alias = 'getSystemIntake';
      }
    });

    cy.localLogin({ name: 'GRTB', role: 'EASI_D_GOVTEAM' });
    cy.wait('@getOpenIntakes').its('response.statusCode').should('eq', 200);
  });

  it('can assign Admin Lead', () => {
    cy.visit(
      '/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/intake-request'
    );
    cy.get('[data-testid="admin-lead"]').contains('Not Assigned');
    cy.contains('button', 'Change').click();
    cy.get('input[value="Ann Rudolph"]').check({ force: true });

    cy.get('[data-testid="button"]').contains('Save').click();
    cy.wait('@getSystemIntake').its('response.statusCode').should('eq', 200);
    cy.get('dd[data-testid="admin-lead"]').contains('Ann Rudolph');
  });

  it('can add GRT/GRB dates', () => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'UpdateSystemIntakeReviewDates') {
        req.alias = 'updateDates';
      }
    });

    // Selecting name based on pre-seeded data
    // A Completed Intake Form - af7a3924-3ff7-48ec-8a54-b8b4bc95610b
    cy.contains('a', 'A Completed Intake Form').should('be.visible').click();
    cy.get(
      'a[href="/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/dates"]'
    ).click();

    cy.get('#Dates-GrtDateMonth').clear().type('11').should('have.value', '11');
    cy.get('#Dates-GrtDateDay').clear().type('24').should('have.value', '24');
    cy.get('#Dates-GrtDateYear')
      .clear()
      .type('2020')
      .should('have.value', '2020');

    cy.get('#Dates-GrbDateMonth').clear().type('12').should('have.value', '12');
    cy.get('#Dates-GrbDateDay').clear().type('25').should('have.value', '25');
    cy.get('#Dates-GrbDateYear')
      .clear()
      .type('2020')
      .should('have.value', '2020');

    cy.get('button[type="submit"]').click();
    cy.wait('@updateDates').its('response.statusCode').should('eq', 200);

    cy.location().should(loc => {
      expect(loc.pathname).to.eq(
        '/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/intake-request'
      );
    });

    cy.wait('@getSystemIntake').its('response.statusCode').should('eq', 200);

    cy.get(
      'a[href="/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/dates"]'
    ).click();

    cy.get('#Dates-GrtDateMonth').should('have.value', '11');
    cy.get('#Dates-GrtDateDay').should('have.value', '24');
    cy.get('#Dates-GrtDateYear').should('have.value', '2020');

    cy.get('#Dates-GrbDateMonth').should('have.value', '12');
    cy.get('#Dates-GrbDateDay').should('have.value', '25');
    cy.get('#Dates-GrbDateYear').should('have.value', '2020');

    cy.visit('/');
    cy.wait('@getOpenIntakes').its('response.statusCode').should('eq', 200);

    cy.get('[data-testid="af7a3924-3ff7-48ec-8a54-b8b4bc95610b-row"]').contains(
      'td',
      'November 24 2020'
    );
    cy.get('[data-testid="af7a3924-3ff7-48ec-8a54-b8b4bc95610b-row"]').contains(
      'td',
      'December 25 2020'
    );
  });

  it('can add a note', () => {
    // Selecting name based on pre-seeded data
    // A Completed Intake Form - af7a3924-3ff7-48ec-8a54-b8b4bc95610b
    cy.contains('a', 'A Completed Intake Form').should('be.visible').click();
    cy.get(
      'a[href="/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/notes"]'
    ).click();

    cy.get('[data-testid="user-note"]').then(notes => {
      const numOfNotes = notes.length;

      const noteFixture = 'Test note';

      cy.get('#GovernanceReviewTeam-Note')
        .type(noteFixture)
        .should('have.value', noteFixture);

      cy.get('button[type="submit"]').click();

      cy.get('[data-testid="user-note"]').should('have.length', numOfNotes + 1);

      // .first() is the most recent note we just created
      cy.get('[data-testid="user-note"]').first().contains(noteFixture);
      cy.get('[data-testid="user-note"]').first().contains('User GRTB');
    });
  });

  it('can issue a Lifecycle ID', () => {
    // Selecting name based on pre-seeded data
    // A Completed Intake Form - af7a3924-3ff7-48ec-8a54-b8b4bc95610b
    cy.contains('a', 'A Completed Intake Form').should('be.visible').click();
    cy.get('[data-testid="grt-nav-actions-link"]').click();

    cy.get('button[data-testid="collapsable-link"]').click();
    cy.get('#issue-lcid').check({ force: true }).should('be.checked');
    cy.get('button[type="submit"]').click();

    cy.get('#IssueLifecycleIdForm-NewLifecycleIdYes')
      .check({ force: true })
      .should('be.checked');
    cy.get('#IssueLifecycleIdForm-ExpirationDateMonth')
      .clear()
      .type('12')
      .should('have.value', '12');
    cy.get('#IssueLifecycleIdForm-ExpirationDateDay')
      .clear()
      .type('25')
      .should('have.value', '25');
    cy.get('#IssueLifecycleIdForm-ExpirationDateYear')
      .clear()
      .type('2020')
      .should('have.value', '2020');
    cy.get('#IssueLifecycleIdForm-Scope')
      .type('Scope')
      .should('have.value', 'Scope');
    cy.get('#IssueLifecycleIdForm-NextSteps')
      .type('Next steps')
      .should('have.value', 'Next steps');
    cy.get('#IssueLifecycleIdForm-Feedback')
      .type('Feedback')
      .should('have.value', 'Feedback');
    cy.get('button[type="submit"]').click();

    cy.get('[data-testid="action-note"]')
      .first()
      .contains('Issued Lifecycle ID with no further governance');

    cy.get(
      'a[href="/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/decision"]'
    ).click();

    cy.contains('h1', 'Decision - Approved');
    cy.get('[data-testid="grt-current-status"]')
      .invoke('text')
      .then(text => {
        expect(text.length).to.equal(27);
      });
    cy.contains('dt', 'Lifecycle ID issued');

    cy.get(
      'a[href="/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/lcid"]'
    ).click();
    cy.contains('dt', 'Lifecycle ID Expiration')
      .siblings('dd')
      .contains('December 25 2020');
    cy.contains('dt', 'Lifecycle ID Scope').siblings('dd').contains('Scope');
    cy.contains('dt', 'Next Steps').siblings('dd').contains('Next steps');
  });

  it('can close a request', () => {
    // Selecting name based on pre-seeded data
    // Closable Request - 20cbcfbf-6459-4c96-943b-e76b83122dbf
    cy.contains('a', 'Closable Request').should('be.visible').click();
    cy.get('[data-testid="grt-nav-actions-link"]').click();

    cy.get('button[data-testid="collapsable-link"]').click();
    cy.get('#no-governance').check({ force: true }).should('be.checked');

    cy.get('button[type="submit"]').click();

    cy.get('#SubmitActionForm-Feedback')
      .type('Feedback')
      .should('have.value', 'Feedback');

    cy.get('button[type="submit"]').click();

    cy.wait('@getSystemIntake').its('response.statusCode').should('eq', 200);

    cy.get('[data-testid="grt-status"]').contains('Closed');

    cy.visit('/');
    cy.get('[data-testid="view-closed-intakes-btn"]').click();
    cy.get('[data-testid="20cbcfbf-6459-4c96-943b-e76b83122dbf-row"]').contains(
      'td',
      'Closed'
    );
  });

  it('can extend a Lifecycle ID', () => {
    cy.intercept('GET', '/api/v1/system_intakes?status=closed').as(
      'getClosedRequests'
    );

    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'GetAdminNotesAndActions') {
        req.alias = 'getAdminNotesAndActions';
      }
    });

    cy.get('button').contains('Closed Requests').click();

    cy.wait('@getClosedRequests').its('response.statusCode').should('eq', 200);
    cy.contains('a', 'With LCID Issued').should('be.visible').click();

    cy.contains('a', 'Actions').should('be.visible').click();

    cy.get('#extend-lcid').check({ force: true }).should('be.checked');
    cy.get('button[type="submit"]').click();

    cy.get('#ExtendLifecycleId-NewExpirationMonth')
      .type('08')
      .should('have.value', '08');
    cy.get('#ExtendLifecycleId-NewExpirationDay')
      .type('31')
      .should('have.value', '31');
    cy.get('#ExtendLifecycleId-NewExpirationYear')
      .type('2028')
      .should('have.value', '2028');

    cy.get('#ExtendLifecycleIdForm-Scope')
      .type('Scope')
      .should('have.value', 'Scope');

    cy.get('#ExtendLifecycleIdForm-NextSteps')
      .type('Next Steps')
      .should('have.value', 'Next Steps');

    cy.get('#ExtendLifecycleIdForm-CostBaseline')
      .type('Cost Baseline')
      .should('have.value', 'Cost Baseline');

    cy.get('button[type="submit"]').click();

    cy.wait('@getAdminNotesAndActions');
    cy.get('h1').contains('Admin team notes');
  });

  it('can extend a Lifecycle ID with no Cost Baseline', () => {
    cy.intercept('GET', '/api/v1/system_intakes?status=closed').as(
      'getClosedRequests'
    );

    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'GetAdminNotesAndActions') {
        req.alias = 'getAdminNotesAndActions';
      }
    });

    cy.get('button').contains('Closed Requests').click();

    cy.wait('@getClosedRequests').its('response.statusCode').should('eq', 200);
    cy.contains('a', 'With LCID Issued').should('be.visible').click();

    cy.contains('a', 'Actions').should('be.visible').click();

    cy.get('#extend-lcid').check({ force: true }).should('be.checked');
    cy.get('button[type="submit"]').click();

    cy.get('#ExtendLifecycleId-NewExpirationMonth')
      .type('08')
      .should('have.value', '08');
    cy.get('#ExtendLifecycleId-NewExpirationDay')
      .type('31')
      .should('have.value', '31');
    cy.get('#ExtendLifecycleId-NewExpirationYear')
      .type('2029')
      .should('have.value', '2029');

    cy.get('#ExtendLifecycleIdForm-Scope')
      .type('Scope')
      .should('have.value', 'Scope');

    cy.get('#ExtendLifecycleIdForm-NextSteps')
      .type('Next Steps')
      .should('have.value', 'Next Steps');

    cy.get('button[type="submit"]').click();

    cy.wait('@getAdminNotesAndActions');
    cy.get('h1').contains('Admin team notes');
  });
});
